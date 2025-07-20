import { sql } from 'drizzle-orm';
import {
  boolean,
  check,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { typeid as generateId } from 'typeid-js';
import { typeId } from './extensions';
import { StreamPlatform } from './types';

const timestamps = {
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
};

export const config = pgTable('config', {
  id: typeId('id', 'config')
    .primaryKey()
    .$defaultFn(() => generateId('config').toString()),
  key: text('key').notNull().unique(),
  value: text('value').notNull(),
  ...timestamps,
});

export const streamPlatformEnum = pgEnum(
  'stream_platform',
  Object.values(StreamPlatform) as [StreamPlatform, ...StreamPlatform[]]
);

export const streamer = pgTable(
  'streamer',
  {
    id: typeId('id', 'streamer')
      .primaryKey()
      .$defaultFn(() => generateId('streamer').toString()),
    twitchId: text('twitch_id').unique(),
    kickId: text('kick_id').unique(),
    twitchUsername: text('twitch_username').unique(),
    kickUsername: text('kick_username').unique(),
    name: text('name').notNull(),
    avatarUrl: text('avatar_url'),
    isLive: boolean('is_live').default(false),
    livePlatform: streamPlatformEnum('live_platform'),
    viewerCount: integer('viewer_count').default(0),
    category: text('category'),
    title: text('title'),
    approved: boolean('approved').default(false),
    ...timestamps,
  },
  (table) => [
    check(
      'at_least_one_username',
      sql`${table.twitchUsername} IS NOT NULL OR ${table.kickUsername} IS NOT NULL`
    ),
  ]
);
