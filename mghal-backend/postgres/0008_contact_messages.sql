-- M.GH.AL PostgreSQL migration 0008: persistent contact inbox.
-- Additive only: stores new visitor submissions without modifying existing records.

CREATE TABLE IF NOT EXISTS contact_messages (
  id TEXT PRIMARY KEY,
  sender_name TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  locale TEXT NOT NULL CHECK (locale IN ('ar','en')),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','read','replied','archived')),
  consent_at TEXT NOT NULL,
  ip_hash TEXT,
  user_agent TEXT,
  admin_note TEXT,
  created_at TEXT NOT NULL DEFAULT to_char(CURRENT_TIMESTAMP AT TIME ZONE 'UTC','YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'),
  updated_at TEXT NOT NULL DEFAULT to_char(CURRENT_TIMESTAMP AT TIME ZONE 'UTC','YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_status_created
  ON contact_messages(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created
  ON contact_messages(created_at DESC);

DO $migration$
DECLARE
  existing_checksum TEXT;
BEGIN
  SELECT checksum INTO existing_checksum
  FROM _mghal_migrations
  WHERE id = '0008_contact_messages';

  IF existing_checksum IS NOT NULL
     AND existing_checksum <> 'postgres-contact-messages-v1-2026-11-21' THEN
    RAISE EXCEPTION 'Migration 0008_contact_messages checksum mismatch';
  END IF;

  IF existing_checksum IS NULL THEN
    INSERT INTO _mghal_migrations(id, checksum)
    VALUES ('0008_contact_messages', 'postgres-contact-messages-v1-2026-11-21');
  END IF;
END
$migration$;
