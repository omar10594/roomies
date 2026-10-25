-- Run once against the existing migrated D1 database before deploying admin sessions.
-- Business data is preserved; tenant-specific PINs are intentionally removed.
CREATE TABLE admin_sessions (token_hash TEXT PRIMARY KEY NOT NULL, expires_at INTEGER NOT NULL);
CREATE INDEX admin_sessions_expires_at_idx ON admin_sessions(expires_at);
ALTER TABLE roomies DROP COLUMN access_code;
