import type { Logger } from '@lgamila/logging';
import * as Sentry from '@sentry/node';
import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
} from 'axios';
import { err, ok, type Result } from 'neverthrow';
import { ZodError, type z } from 'zod';
import {
  ApiForbiddenError,
  ApiNetworkError,
  ApiRequestError,
  ApiResponseError,
  ApiServerError,
  ApiUnauthorizedError,
  ApiValidationError,
  BaseError,
} from '@/lib/errors/generic';
import { rateLimit } from '@/lib/ratelimit';

// Move this interface outside the class
export interface HttpRequestOptions<
  Req extends z.ZodType,
  Res extends z.ZodType,
> {
  method: string;
  endpoint: string;
  data?: z.infer<Req>;
  params?: Record<string, unknown>;
  requestSchema?: Req;
  responseSchema?: Res;
  config?: Omit<AxiosRequestConfig, 'method' | 'data'>;
}

export class HttpClient {
  private readonly baseUrl: string;
  private readonly client: AxiosInstance;
  protected readonly logger: Logger;

  constructor(baseUrl: string, logger: Logger, config?: AxiosRequestConfig) {
    this.baseUrl = baseUrl;
    this.client = axios.create({
      baseURL: this.baseUrl,
      ...config,
    });
    this.logger = logger.child();
  }

  @rateLimit({
    maxRetries: 3,
    defaultDelayMs: 1000,
  })
  async request<Req extends z.ZodType, Res extends z.ZodType>(
    options: HttpRequestOptions<Req, Res>
  ): Promise<Result<z.infer<Res>, BaseError>> {
    try {
      this.logger
        .withMetadata({
          endpoint: options.endpoint,
          method: options.method,
          url: this.baseUrl + options.endpoint,
        })
        .info('Performing HTTP request');

      // Validate request data
      let validatedData: Record<string, unknown> | undefined;

      if (options.requestSchema) {
        const validationResult = this.validateRequest(
          options.requestSchema,
          options.data
        );

        if (validationResult.isErr()) {
          this.logger
            .withError(validationResult.error)
            .debug('Request validation failed');
          return validationResult;
        }

        validatedData = validationResult.value;
      } else {
        validatedData = options.data;
      }

      // Make the request
      const requestResult = await this.makeRequest(
        options.method,
        options.endpoint,
        validatedData,
        options.params,
        options.config
      );
      if (requestResult.isErr()) {
        return requestResult;
      }

      // Validate response
      if (options.responseSchema) {
        const validationResult = this.validateResponse(
          options.responseSchema,
          requestResult.value
        );
        if (validationResult.isErr()) {
          return validationResult;
        }
      }

      return ok(requestResult.value);
    } catch (error) {
      return this.handleUnexpectedError(error);
    }
  }

  private validateWithSchema<TSchema extends z.ZodType, TInput>(
    schema: TSchema,
    data: TInput,
    context: 'Request' | 'Response'
  ): Result<z.infer<TSchema>, ApiValidationError> {
    try {
      return ok(schema.parse(data));
    } catch (parseError) {
      const prefix = `${context} validation failed:`;
      if (parseError instanceof ZodError) {
        return err(
          new ApiValidationError(
            `${prefix} ${parseError.message}`,
            parseError.errors
          )
        );
      }
      return err(
        new ApiValidationError(
          `${prefix} ${parseError instanceof Error ? parseError.message : String(parseError)}`,
          []
        )
      );
    }
  }

  private validateRequest<TSchema extends z.ZodType, TInput>(
    schema: TSchema,
    data: TInput
  ): Result<z.infer<TSchema>, ApiValidationError> {
    return this.validateWithSchema(schema, data, 'Request');
  }

  private validateResponse<TSchema extends z.ZodType>(
    schema: TSchema,
    data: unknown
  ): Result<z.infer<TSchema>, ApiValidationError> {
    return this.validateWithSchema(schema, data, 'Response');
  }

  private async makeRequest(
    method: string,
    path: string,
    data: Record<string, unknown> | undefined,
    params: Record<string, unknown> | undefined,
    config?: AxiosRequestConfig
  ): Promise<Result<unknown, BaseError>> {
    return await Sentry.startSpan(
      { op: 'http.client', name: `${method} ${path}` },
      async (span) => {
        try {
          const requestConfig: AxiosRequestConfig = {
            method,
            url: path,
            params,
            data,
            ...config,
          };

          const url = path.startsWith('http')
            ? new URL(path)
            : new URL(path, this.baseUrl);

          span.setAttribute('http.request.method', method);
          span.setAttribute('server.address', url.hostname);
          span.setAttribute('server.port', url.port || undefined);

          this.logger
            ?.withMetadata({
              method,
              path,
              // Don't log full request data to avoid sensitive info
              hasData: !!data,
            })
            .debug('Making HTTP request');

          const response = await this.client.request(requestConfig);

          span.setAttribute('http.response.status_code', response.status);
          const contentLength = Number(response.headers['content-length']);
          span.setAttribute(
            'http.response_content_length',
            Number.isNaN(contentLength) ? undefined : contentLength
          );

          this.logger
            ?.withMetadata({
              method,
              path,
              status: response.status,
            })
            .debug('Received HTTP response');

          return ok(response.data);
        } catch (error) {
          return this.handleAxiosError(error);
        }
      }
    );
  }

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: hh skill issue
  private handleAxiosError(error: unknown): Result<never, BaseError> {
    if (error instanceof AxiosError) {
      if (error.response) {
        // The request was made and the server responded with a status code outside of 2xx
        const statusCode = error.response.status;
        const message = error.response.data?.message || error.message;

        this.logger
          ?.withError(error)
          .withMetadata({
            status: statusCode,
            url: error.config?.url,
          })
          .info('HTTP error response');

        if (statusCode === 401) {
          return err(new ApiUnauthorizedError(message));
        }
        if (statusCode === 403) {
          return err(new ApiForbiddenError(message));
        }
        if (statusCode >= 400 && statusCode < 500) {
          return err(new ApiResponseError(message, statusCode));
        }
        if (statusCode >= 500) {
          return err(new ApiServerError(message, statusCode));
        }
      } else if (error.request) {
        // The request was made but no response was received
        this.logger
          ?.withError(error)
          .withMetadata({
            url: error.config?.url,
          })
          .warn('No response received from server');
        return err(
          new ApiNetworkError(`No response received: ${error.message}`)
        );
      } else {
        // Something happened in setting up the request
        this.logger
          ?.withError(error)
          .withMetadata({
            url: error.config?.url,
          })
          .warn('Request setup failed');
        return err(
          new ApiRequestError(`Request setup failed: ${error.message}`)
        );
      }
    }

    return this.handleUnexpectedError(error);
  }

  private handleUnexpectedError(error: unknown): Result<never, BaseError> {
    if (error instanceof BaseError) {
      this.logger.withError(error).error('Base error in API client');
      return err(error);
    }

    if (error instanceof ZodError) {
      this.logger.withError(error).error('Zod validation error in API client');
      return err(new ApiValidationError(error.message, error.errors));
    }

    this.logger
      .withError(error as Error)
      .error('Unexpected error in API client');

    return err(
      new ApiRequestError(
        `Unexpected error: ${error instanceof Error ? error.message : String(error)}`
      )
    );
  }
}
