-- M.GH.AL PostgreSQL baseline schema.
-- Source: verified application schema snapshot ported to Neon PostgreSQL on 2026-11-08.
-- Compatibility policy: keep existing identifiers and ISO-8601 timestamp strings;
-- convert boolean-like flags to constrained INTEGER values to preserve API semantics.
-- This file is additive/idempotent and does not drop or rewrite existing data.

CREATE TABLE IF NOT EXISTS _mghal_migrations (
  id TEXT PRIMARY KEY,
  checksum TEXT NOT NULL,
  applied_at TEXT NOT NULL DEFAULT to_char(CURRENT_TIMESTAMP AT TIME ZONE 'UTC','YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')
);

CREATE TABLE IF NOT EXISTS roles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT
);

CREATE TABLE IF NOT EXISTS permissions (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  description TEXT
);

CREATE TABLE IF NOT EXISTS admin_users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  display_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','disabled','locked')),
  created_at TEXT NOT NULL DEFAULT to_char(CURRENT_TIMESTAMP AT TIME ZONE 'UTC','YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'),
  updated_at TEXT NOT NULL DEFAULT to_char(CURRENT_TIMESTAMP AT TIME ZONE 'UTC','YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'),
  last_login_at TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_admin_users_email_lower ON admin_users (LOWER(email));

CREATE TABLE IF NOT EXISTS admin_user_roles (
  user_id TEXT NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  role_id TEXT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, role_id)
);

CREATE TABLE IF NOT EXISTS admin_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT to_char(CURRENT_TIMESTAMP AT TIME ZONE 'UTC','YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'),
  revoked_at TEXT,
  ip_hash TEXT,
  user_agent TEXT
);
CREATE INDEX IF NOT EXISTS idx_sessions_user_expiry ON admin_sessions(user_id, expires_at);

CREATE TABLE IF NOT EXISTS analytics_events (
  id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  path TEXT NOT NULL,
  target_type TEXT,
  target_id TEXT,
  referrer_host TEXT,
  session_hash TEXT,
  country_code TEXT,
  created_at TEXT NOT NULL DEFAULT to_char(CURRENT_TIMESTAMP AT TIME ZONE 'UTC','YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')
);
CREATE INDEX IF NOT EXISTS idx_analytics_created ON analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_target ON analytics_events(target_type, target_id, created_at DESC);

CREATE TABLE IF NOT EXISTS article_categories (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS articles (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  locale TEXT NOT NULL CHECK (locale IN ('ar','en')),
  title TEXT NOT NULL,
  excerpt TEXT,
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft','Scheduled','Published','Archived')),
  category_id TEXT REFERENCES article_categories(id) ON DELETE SET NULL,
  cover_media_id TEXT,
  seo_title TEXT,
  seo_description TEXT,
  canonical_url TEXT,
  scheduled_at TEXT,
  published_at TEXT,
  author_id TEXT REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at TEXT NOT NULL DEFAULT to_char(CURRENT_TIMESTAMP AT TIME ZONE 'UTC','YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'),
  updated_at TEXT NOT NULL DEFAULT to_char(CURRENT_TIMESTAMP AT TIME ZONE 'UTC','YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')
);
CREATE INDEX IF NOT EXISTS idx_articles_status_publish ON articles(status, published_at DESC);

CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  actor_user_id TEXT REFERENCES admin_users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  before_json TEXT,
  after_json TEXT,
  request_id TEXT,
  created_at TEXT NOT NULL DEFAULT to_char(CURRENT_TIMESTAMP AT TIME ZONE 'UTC','YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')
);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at DESC);

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'en' CHECK (locale IN ('ar','en')),
  short_description TEXT,
  description TEXT,
  status TEXT NOT NULL CHECK (status IN ('Completed','In Progress','Experimental','Incomplete','Paused','Planned','Archived')),
  repository_url TEXT,
  live_url TEXT,
  cover_media_id TEXT,
  started_at TEXT,
  completed_at TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published INTEGER NOT NULL DEFAULT 1 CHECK (is_published IN (0,1)),
  created_at TEXT NOT NULL DEFAULT to_char(CURRENT_TIMESTAMP AT TIME ZONE 'UTC','YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'),
  updated_at TEXT NOT NULL DEFAULT to_char(CURRENT_TIMESTAMP AT TIME ZONE 'UTC','YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'),
  name_ar TEXT,
  short_description_ar TEXT,
  description_ar TEXT
);

CREATE TABLE IF NOT EXISTS achievements (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  achieved_at TEXT,
  related_project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
  media_id TEXT,
  is_published INTEGER NOT NULL DEFAULT 1 CHECK (is_published IN (0,1)),
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS certificates (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  category TEXT NOT NULL,
  credential_id TEXT,
  issued_at TEXT,
  expires_at TEXT,
  verification_url TEXT,
  image_media_id TEXT,
  pdf_media_id TEXT,
  qr_url TEXT,
  description TEXT,
  is_published INTEGER NOT NULL DEFAULT 1 CHECK (is_published IN (0,1)),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT to_char(CURRENT_TIMESTAMP AT TIME ZONE 'UTC','YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'),
  updated_at TEXT NOT NULL DEFAULT to_char(CURRENT_TIMESTAMP AT TIME ZONE 'UTC','YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')
);
CREATE INDEX IF NOT EXISTS idx_certificates_published_sort ON certificates(is_published, sort_order);

CREATE TABLE IF NOT EXISTS education (
  id TEXT PRIMARY KEY,
  institution TEXT NOT NULL,
  degree TEXT,
  field_of_study TEXT,
  location TEXT,
  start_date TEXT,
  end_date TEXT,
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress','completed','paused')),
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published INTEGER NOT NULL DEFAULT 1 CHECK (is_published IN (0,1))
);

CREATE TABLE IF NOT EXISTS followers (
  id TEXT PRIMARY KEY,
  email_hash TEXT UNIQUE,
  email_ciphertext TEXT,
  display_name TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','unverified','unsubscribed','blocked')),
  verified_at TEXT,
  consent_at TEXT,
  created_at TEXT NOT NULL DEFAULT to_char(CURRENT_TIMESTAMP AT TIME ZONE 'UTC','YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'),
  unsubscribed_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_followers_status_created ON followers(status, created_at DESC);

CREATE TABLE IF NOT EXISTS follower_tokens (
  id TEXT PRIMARY KEY,
  follower_id TEXT NOT NULL REFERENCES followers(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  purpose TEXT NOT NULL CHECK (purpose IN ('verify','unsubscribe')),
  expires_at TEXT NOT NULL,
  used_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_follower_tokens_lookup ON follower_tokens(token_hash, expires_at);

CREATE TABLE IF NOT EXISTS identity_profiles (
  id TEXT PRIMARY KEY,
  locale TEXT NOT NULL CHECK (locale IN ('ar','en')),
  full_name TEXT NOT NULL,
  professional_title TEXT NOT NULL,
  headline TEXT,
  biography TEXT,
  location TEXT,
  avatar_media_id TEXT,
  is_published INTEGER NOT NULL DEFAULT 1 CHECK (is_published IN (0,1)),
  updated_at TEXT NOT NULL DEFAULT to_char(CURRENT_TIMESTAMP AT TIME ZONE 'UTC','YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'),
  UNIQUE (locale)
);

CREATE TABLE IF NOT EXISTS media (
  id TEXT PRIMARY KEY,
  storage_provider TEXT NOT NULL,
  storage_key TEXT NOT NULL,
  public_url TEXT,
  original_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes INTEGER NOT NULL CHECK (size_bytes >= 0),
  alt_ar TEXT,
  alt_en TEXT,
  uploaded_by TEXT REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at TEXT NOT NULL DEFAULT to_char(CURRENT_TIMESTAMP AT TIME ZONE 'UTC','YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'),
  blob_data BYTEA,
  UNIQUE (storage_provider, storage_key)
);

CREATE TABLE IF NOT EXISTS skills (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'en' CHECK (locale IN ('ar','en')),
  category TEXT NOT NULL,
  proficiency TEXT CHECK (proficiency IN ('beginner','intermediate','advanced','not_specified')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published INTEGER NOT NULL DEFAULT 1 CHECK (is_published IN (0,1)),
  UNIQUE (name, locale)
);

CREATE TABLE IF NOT EXISTS technologies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT,
  logo_url TEXT,
  website_url TEXT,
  is_published INTEGER NOT NULL DEFAULT 1 CHECK (is_published IN (0,1)),
  archived INTEGER NOT NULL DEFAULT 0 CHECK (archived IN (0,1))
);
CREATE INDEX IF NOT EXISTS idx_technologies_public ON technologies(is_published, archived, name);

CREATE TABLE IF NOT EXISTS project_technologies (
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  technology_id TEXT NOT NULL REFERENCES technologies(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, technology_id)
);

CREATE TABLE IF NOT EXISTS reactions (
  id TEXT PRIMARY KEY,
  target_type TEXT NOT NULL CHECK (target_type IN ('article','project')),
  target_id TEXT NOT NULL,
  follower_id TEXT REFERENCES followers(id) ON DELETE SET NULL,
  reaction TEXT NOT NULL CHECK (reaction IN ('like','clap')),
  created_at TEXT NOT NULL DEFAULT to_char(CURRENT_TIMESTAMP AT TIME ZONE 'UTC','YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'),
  UNIQUE (target_type, target_id, follower_id, reaction)
);

CREATE TABLE IF NOT EXISTS role_permissions (
  role_id TEXT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id TEXT NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value_json TEXT NOT NULL,
  updated_by TEXT REFERENCES admin_users(id) ON DELETE SET NULL,
  updated_at TEXT NOT NULL DEFAULT to_char(CURRENT_TIMESTAMP AT TIME ZONE 'UTC','YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')
);

CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  article_id TEXT NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  follower_id TEXT REFERENCES followers(id) ON DELETE SET NULL,
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','spam')),
  created_at TEXT NOT NULL DEFAULT to_char(CURRENT_TIMESTAMP AT TIME ZONE 'UTC','YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')
);

-- Google identity linking tables are included in the PostgreSQL target schema.
-- The production D1 database did not yet contain the 0006 migration when snapshotted.
CREATE TABLE IF NOT EXISTS follower_identities (
  id TEXT PRIMARY KEY,
  follower_id TEXT NOT NULL REFERENCES followers(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider = 'google'),
  provider_subject TEXT NOT NULL,
  email TEXT NOT NULL,
  email_verified INTEGER NOT NULL DEFAULT 0 CHECK (email_verified IN (0,1)),
  display_name TEXT,
  created_at TEXT NOT NULL DEFAULT to_char(CURRENT_TIMESTAMP AT TIME ZONE 'UTC','YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'),
  updated_at TEXT NOT NULL DEFAULT to_char(CURRENT_TIMESTAMP AT TIME ZONE 'UTC','YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'),
  UNIQUE (provider, provider_subject),
  UNIQUE (provider, email)
);
CREATE INDEX IF NOT EXISTS idx_follower_identities_follower ON follower_identities(follower_id);

CREATE TABLE IF NOT EXISTS follower_identity_sessions (
  visitor_hash TEXT PRIMARY KEY,
  follower_id TEXT NOT NULL REFERENCES followers(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL DEFAULT to_char(CURRENT_TIMESTAMP AT TIME ZONE 'UTC','YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')
);
CREATE INDEX IF NOT EXISTS idx_follower_identity_sessions_follower ON follower_identity_sessions(follower_id);

CREATE TABLE IF NOT EXISTS oauth_transactions (
  state_hash TEXT PRIMARY KEY,
  visitor_hash TEXT NOT NULL,
  code_verifier TEXT NOT NULL,
  return_path TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT to_char(CURRENT_TIMESTAMP AT TIME ZONE 'UTC','YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')
);
CREATE INDEX IF NOT EXISTS idx_oauth_transactions_expiry ON oauth_transactions(expires_at);
