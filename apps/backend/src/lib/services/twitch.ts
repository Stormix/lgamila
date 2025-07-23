import type { Logger } from '@lgamila/logging';
import { ApiClient } from '@twurple/api';
import { AppTokenAuthProvider } from '@twurple/auth';
import { err, ok } from 'neverthrow';
import { env } from '../env';
import { NotFoundError } from '../errors/generic';
import { logger } from '../logger';
import { Singleton } from './base';

export class TwitchService extends Singleton {
  private logger: Logger;
  private client: ApiClient;
  private constructor() {
    super();
    this.logger = logger.child().withContext({ service: TwitchService.name });
    this.client = new ApiClient({
      authProvider: new AppTokenAuthProvider(
        env.TWITCH_CLIENT_ID,
        env.TWITCH_CLIENT_SECRET
      ),
    });
  }

  static get instance() {
    return super.getInstance<TwitchService>();
  }

  async getStreamer(channel: string) {
    try {
      const user = await this.client.users.getUserByName(channel);

      if (!user) {
        return err(new NotFoundError('User not found'));
      }

      return ok({
        broadcasterType: user.broadcasterType,
        creationDate: user.creationDate,
        description: user.description,
        displayName: user.displayName,
        id: user.id,
        name: user.name,
        offlinePlaceholderUrl: user.offlinePlaceholderUrl,
        profilePictureUrl: user.profilePictureUrl,
        type: user.type,
      });
    } catch (error) {
      this.logger.withError(error).error('Failed to lookup streamer');
      return err(error);
    }
  }

  async getStreamers(streamers: string[]) {
    try {
      const users = await this.client.users.getUsersByNames(streamers);
      return ok(users);
    } catch (error) {
      this.logger.withError(error).error('Failed to lookup streamer');
      return err(error);
    }
  }

  async isStreamerLive(channel: string) {
    const user = await this.client.users.getUserByName(channel);

    if (!user) {
      return err(new NotFoundError('User not found'));
    }

    const stream = await this.client.streams.getStreamByUserId(user.id);

    return ok({
      isLive: stream !== null,
      stream: stream
        ? {
            id: stream.id,
            title: stream.title,
            game: stream.gameName,
            viewerCount: stream.viewers,
            startedAt: stream.startDate,
          }
        : null,
    });
  }
}
