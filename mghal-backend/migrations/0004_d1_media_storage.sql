-- Store small media objects in the existing D1 database.
-- Additive only: existing metadata and URLs are preserved.
ALTER TABLE media ADD COLUMN blob_data BLOB;
