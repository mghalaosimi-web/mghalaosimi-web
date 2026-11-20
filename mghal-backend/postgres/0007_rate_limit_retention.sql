-- M.GH.AL PostgreSQL migration 0007.
-- Bound the lifetime and lookup cost of minute-scoped API rate-limit buckets.
-- This migration is additive and does not delete existing records.

CREATE INDEX IF NOT EXISTS idx_site_settings_rate_limit_expiry
  ON site_settings(updated_at)
  WHERE key LIKE 'rl:%';

DO $migration$
DECLARE
  existing_checksum TEXT;
BEGIN
  SELECT checksum INTO existing_checksum
  FROM _mghal_migrations
  WHERE id = '0007_rate_limit_retention';

  IF existing_checksum IS NOT NULL
     AND existing_checksum <> 'postgres-rate-limit-retention-v1-2026-11-20' THEN
    RAISE EXCEPTION 'Migration 0007_rate_limit_retention checksum mismatch';
  END IF;

  IF existing_checksum IS NULL THEN
    INSERT INTO _mghal_migrations(id, checksum)
    VALUES ('0007_rate_limit_retention', 'postgres-rate-limit-retention-v1-2026-11-20');
  END IF;
END
$migration$;
