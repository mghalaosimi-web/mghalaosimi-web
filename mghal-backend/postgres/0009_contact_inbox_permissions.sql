-- M.GH.AL PostgreSQL migration 0009: private contact inbox permissions.
-- Only the owner role receives access to private sender details and message management.

INSERT INTO permissions(id,code,description) VALUES
 ('perm_contact_messages_read','contact_messages.read','Read private contact messages and sender details'),
 ('perm_contact_messages_manage','contact_messages.manage','Update status and internal notes on private contact messages')
ON CONFLICT(code) DO NOTHING;

INSERT INTO role_permissions(role_id,permission_id)
SELECT r.id,p.id
FROM roles r
JOIN permissions p ON p.code IN ('contact_messages.read','contact_messages.manage')
WHERE r.name='owner'
ON CONFLICT(role_id,permission_id) DO NOTHING;

DO $migration$
DECLARE existing_checksum TEXT;
BEGIN
 SELECT checksum INTO existing_checksum FROM _mghal_migrations WHERE id='0009_contact_inbox_permissions';
 IF existing_checksum IS NOT NULL AND existing_checksum <> 'postgres-contact-permissions-v1-2026-11-21' THEN
  RAISE EXCEPTION 'Migration 0009_contact_inbox_permissions checksum mismatch';
 END IF;
 IF existing_checksum IS NULL THEN
  INSERT INTO _mghal_migrations(id,checksum) VALUES('0009_contact_inbox_permissions','postgres-contact-permissions-v1-2026-11-21');
 END IF;
END
$migration$;
