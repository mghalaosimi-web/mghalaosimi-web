-- M.GH.AL PostgreSQL migration 0006.
-- Additive/idempotent migration for Google identity linking of public followers.
-- The current Neon schema already contains these tables; this migration also
-- reconciles the migration ledger without changing existing rows.

CREATE TABLE IF NOT EXISTS follower_identities (
  id TEXT PRIMARY KEY,
  follower_id TEXT NOT NULL REFERENCES followers(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider = 'google'),
  provider_subject TEXT NOT NULL,
  email TEXT NOT NULL,
  email_verified INTEGER NOT NULL DEFAULT 0 CHECK (email_verified IN (0, 1)),
  display_name TEXT,
  created_at TEXT NOT NULL DEFAULT to_char(CURRENT_TIMESTAMP AT TIME ZONE 'UTC','YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'),
  updated_at TEXT NOT NULL DEFAULT to_char(CURRENT_TIMESTAMP AT TIME ZONE 'UTC','YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'),
  UNIQUE (provider, provider_subject),
  UNIQUE (provider, email)
);

CREATE INDEX IF NOT EXISTS idx_follower_identities_follower
  ON follower_identities(follower_id);

CREATE TABLE IF NOT EXISTS follower_identity_sessions (
  visitor_hash TEXT PRIMARY KEY,
  follower_id TEXT NOT NULL REFERENCES followers(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL DEFAULT to_char(CURRENT_TIMESTAMP AT TIME ZONE 'UTC','YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')
);

CREATE INDEX IF NOT EXISTS idx_follower_identity_sessions_follower
  ON follower_identity_sessions(follower_id);

CREATE TABLE IF NOT EXISTS oauth_transactions (
  state_hash TEXT PRIMARY KEY,
  visitor_hash TEXT NOT NULL,
  code_verifier TEXT NOT NULL,
  return_path TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT to_char(CURRENT_TIMESTAMP AT TIME ZONE 'UTC','YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')
);

CREATE INDEX IF NOT EXISTS idx_oauth_transactions_expiry
  ON oauth_transactions(expires_at);

DO $migration$
DECLARE
  existing_checksum TEXT;
BEGIN
  SELECT checksum INTO existing_checksum
  FROM _mghal_migrations
  WHERE id = '0006_google_follower_identity';

  IF existing_checksum IS NOT NULL
     AND existing_checksum <> 'postgres-google-follower-identity-v1-2026-11-11' THEN
    RAISE EXCEPTION 'Migration 0006_google_follower_identity checksum mismatch';
  END IF;

  IF existing_checksum IS NULL THEN
    INSERT INTO _mghal_migrations(id, checksum)
    VALUES ('0006_google_follower_identity', 'postgres-google-follower-identity-v1-2026-11-11');
  END IF;
END
$migration$;
