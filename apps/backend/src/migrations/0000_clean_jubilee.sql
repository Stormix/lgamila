CREATE TYPE "public"."stream_platform" AS ENUM('twitch', 'kick');--> statement-breakpoint
CREATE TABLE "config" (
	"id" text PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"value" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "config_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "streamer" (
	"id" text PRIMARY KEY NOT NULL,
	"twitch_id" text,
	"kick_id" text,
	"twitch_username" text,
	"kick_username" text,
	"name" text NOT NULL,
	"avatar_url" text,
	"is_live" boolean DEFAULT false,
	"live_platform" "stream_platform",
	"viewer_count" integer DEFAULT 0,
	"category" text,
	"title" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "streamer_twitch_id_unique" UNIQUE("twitch_id"),
	CONSTRAINT "streamer_kick_id_unique" UNIQUE("kick_id"),
	CONSTRAINT "streamer_twitch_username_unique" UNIQUE("twitch_username"),
	CONSTRAINT "streamer_kick_username_unique" UNIQUE("kick_username"),
	CONSTRAINT "at_least_one_username" CHECK ("streamer"."twitch_username" IS NOT NULL OR "streamer"."kick_username" IS NOT NULL)
);
