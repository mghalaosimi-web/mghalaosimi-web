-- Google identity linking for public followers. Additive only; do not apply automatically.
CREATE TABLE IF NOT EXISTS follower_identities (
  id TEXT PRIMARY KEY,
  follower_id TEXT NOT NULL REFERENCES followers(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider = 'google'),
  provider_subject TEXT NOT NULL,
  email TEXT NOT NULL,
  email_verified INTEGER NOT NULL DEFAULT 0 CHECK (email_verified IN (0, 1)),
  display_name TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (provider, provider_subject),
  UNIQUE (provider, email)
);

CREATE INDEX IF NOT EXISTS idx_follower_identities_follower
  ON follower_identities(follower_id);

CREATE TABLE IF NOT EXISTS follower_identity_sessions (
  visitor_hash TEXT PRIMARY KEY,
  follower_id TEXT NOT NULL REFERENCES followers(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_follower_identity_sessions_follower
  ON follower_identity_sessions(follower_id);

CREATE TABLE IF NOT EXISTS oauth_transactions (
  state_hash TEXT PRIMARY KEY,
  visitor_hash TEXT NOT NULL,
  code_verifier TEXT NOT NULL,
  return_path TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_oauth_transactions_expiry
  ON oauth_transactions(expires_at);
