/**
 * Enum of database error codes
 */
export enum DatabaseErrorCode {
  ENTITY_NOT_FOUND = 'DB_ENTITY_NOT_FOUND',
  CONNECTION_ERROR = 'DB_CONNECTION_ERROR',
  QUERY_SYNTAX_ERROR = 'DB_QUERY_SYNTAX_ERROR',
  UNIQUE_CONSTRAINT_ERROR = 'DB_UNIQUE_CONSTRAINT_ERROR',
  FOREIGN_KEY_ERROR = 'DB_FOREIGN_KEY_ERROR',
  TRANSACTION_ERROR = 'DB_TRANSACTION_ERROR',
  AUTH_ERROR = 'DB_AUTH_ERROR',
  PERMISSION_ERROR = 'DB_PERMISSION_ERROR',
  TIMEOUT_ERROR = 'DB_TIMEOUT_ERROR',
  BATCH_ERROR = 'DB_BATCH_ERROR',
  INSERT_ERROR = 'DB_INSERT_ERROR',
  UPDATE_ERROR = 'DB_UPDATE_ERROR',
  NOT_NULL_ERROR = 'DB_NOT_NULL_ERROR',
}

export enum GenericErrorCode {
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  KICK_API_ERROR = 'KICK_API_ERROR',
  RUNTIME_ERROR = 'RUNTIME_ERROR',
  HTTP_ERROR = 'HTTP_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  RATE_LIMIT_RETRIES_EXCEEDED = 'RATE_LIMIT_RETRIES_EXCEEDED',
}

export enum AuthenticationErrorCode {
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
}

/**
 * Enum of API error codes
 */
export enum ApiErrorCode {
  VALIDATION_ERROR = 'API_VALIDATION_ERROR',
  REQUEST_ERROR = 'API_REQUEST_ERROR',
  RESPONSE_ERROR = 'API_RESPONSE_ERROR',
  NETWORK_ERROR = 'API_NETWORK_ERROR',
  PARSE_ERROR = 'API_PARSE_ERROR',
  TIMEOUT_ERROR = 'API_TIMEOUT_ERROR',
  SERVER_ERROR = 'API_SERVER_ERROR',
  UNAUTHORIZED_ERROR = 'API_UNAUTHORIZED_ERROR',
  FORBIDDEN_ERROR = 'API_FORBIDDEN_ERROR',
  RATE_LIMIT_ERROR = 'API_RATE_LIMIT_ERROR',
  RATE_LIMIT_RETRIES_EXCEEDED_ERROR = 'API_RATE_LIMIT_RETRIES_EXCEEDED_ERROR',
  ENTITY_NOT_FOUND = 'API_ENTITY_NOT_FOUND',
}
