-- Make technology publication state explicit so draft or archived records never leak publicly.
-- Additive migration: existing technology rows remain visible by default.
ALTER TABLE technologies ADD COLUMN is_published INTEGER NOT NULL DEFAULT 1 CHECK (is_published IN (0, 1));
ALTER TABLE technologies ADD COLUMN archived INTEGER NOT NULL DEFAULT 0 CHECK (archived IN (0, 1));
CREATE INDEX IF NOT EXISTS idx_technologies_public ON technologies(is_published, archived, name);
