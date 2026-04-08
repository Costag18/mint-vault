ALTER TABLE "items" ADD COLUMN "asking_price" numeric(12, 2);--> statement-breakpoint
ALTER TABLE "user_preferences" ADD COLUMN "leaderboard_opt_in" boolean DEFAULT false NOT NULL;