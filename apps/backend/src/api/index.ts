import { zValidator } from '@hono/zod-validator';
import { and, desc, eq, ilike, isNotNull, or, type SQL } from 'drizzle-orm';
import { Hono } from 'hono';
import { z } from 'zod';
import cache from '@/lib/cache/default';
import { db } from '@/lib/db';
import { streamer } from '@/lib/db/schema';
import type { Streamer } from '@/lib/db/types';
import { logger } from '@/lib/logger';
import type { ApiContext } from '../types/api';

const api = new Hono<ApiContext>()
  .get(
    '/streamers',
    zValidator(
      'query',
      z.object({
        search: z.string().optional(),
        platform: z.enum(['twitch', 'kick']).optional(),
      })
    ),
    async (c) => {
      const { search, platform } = c.req.valid('query');
      const cacheKey =
        `streamers:${search || ''}:${platform || ''}` +
        (Math.random() * 1_000_000).toString();
      logger.info(`Cache key: ${cacheKey}`);
      const cachedStreamers = await cache.get<string>(cacheKey);

      if (cachedStreamers) {
        logger.info(`Returning cached streamers: ${cacheKey}`);
        return c.json({
          streamers: JSON.parse(cachedStreamers) as Streamer[],
        });
      }

      // Build the where condition with approved filter
      const conditions: SQL[] = [eq(streamer.approved, true)];

      if (search && platform) {
        const searchCondition =
          platform === 'twitch'
            ? ilike(streamer.twitchUsername, `${search}`)
            : ilike(streamer.kickUsername, `${search}`);
        conditions.push(searchCondition);
      } else if (search) {
        conditions.push(
          // biome-ignore lint/style/noNonNullAssertion: DO NOT CARE
          or(
            ilike(streamer.name, `${search}`),
            ilike(streamer.twitchUsername, `${search}`),
            ilike(streamer.kickUsername, `${search}`)
          )!
        );
      }

      const streamers = await db.query.streamer.findMany({
        columns: {
          id: true,
          name: true,
          avatarUrl: true,
          twitchUsername: true,
          kickUsername: true,
          isLive: true,
          livePlatform: true,
          viewerCount: true,
          category: true,
          title: true,
        },
        where: and(...conditions),
        orderBy: [desc(streamer.isLive), desc(streamer.viewerCount)],
      });

      await cache.set(cacheKey, JSON.stringify(streamers));

      return c.json({
        streamers,
      });
    }
  )
  .get('/streamers/multi', async (c) => {
    const cachedStreamers = await cache.get<string>('streamers-multi');

    if (cachedStreamers) {
      logger.info('Returning cached streamers');
      return c.json({
        streamers: JSON.parse(cachedStreamers),
      });
    }

    // Return streamers that have both a twitch and kick username AND are approved
    const streamers = await db.query.streamer.findMany({
      where: and(
        eq(streamer.approved, true),
        isNotNull(streamer.twitchUsername),
        isNotNull(streamer.kickUsername)
      ),
    });

    await cache.set('streamers-multi', JSON.stringify(streamers));

    return c.json({
      streamers,
    });
  })
  .post(
    '/streamers/suggest',
    zValidator(
      'json',
      z.object({
        name: z.string(),
        twitchUsername: z.string(),
        kickUsername: z.string(),
      })
    ),
    async (c) => {
      const { name, twitchUsername, kickUsername } = await c.req.json();

      try {
        await db
          .insert(streamer)
          .values({
            name: name.trim().toLowerCase(),
            twitchUsername: twitchUsername.trim().toLowerCase(),
            kickUsername: kickUsername.trim().toLowerCase(),
            approved: false,
          })
          .onConflictDoNothing();

        return c.json({
          message: 'Streamer suggested',
        });
      } catch (error) {
        logger.withError(error).error('Failed to suggest streamer');
        return c.json(
          {
            message: 'Failed to suggest streamer',
          },
          500
        );
      }
    }
  );

export default api;
