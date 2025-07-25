import IORedis from 'ioredis';
import { env } from './env';
import { logger } from './logger';

const redis = new IORedis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

redis.on('error', (error) => {
  logger.withError(error).error('Redis error');
  process.exit(1);
});

redis.on('connect', () => {
  logger
    .withMetadata({
      service: 'redis',
    })
    .info('Redis connected');
});

export default redis;
