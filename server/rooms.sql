CREATE TABLE IF NOT EXISTS rooms (id TEXT PRIMARY KEY,host_token TEXT NOT NULL,guest_token TEXT,host_state TEXT NOT NULL,guest_state TEXT,host_seen INTEGER NOT NULL,guest_seen INTEGER,host_claps INTEGER NOT NULL DEFAULT 0,guest_claps INTEGER NOT NULL DEFAULT 0);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS room_limits (id TEXT PRIMARY KEY, attempts INTEGER NOT NULL, expires INTEGER NOT NULL);
