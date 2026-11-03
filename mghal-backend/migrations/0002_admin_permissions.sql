-- Add granular permissions required by the admin console. Additive and safe to re-run.
INSERT OR IGNORE INTO permissions(id,code,description) VALUES
 ('perm_followers_read','followers.read','Read follower records without exposing contact secrets'),
 ('perm_comments_read','comments.read','Read comments submitted for moderation'),
 ('perm_comments_moderate','comments.moderate','Approve, reject or mark comments as spam'),
 ('perm_followers_manage','followers.manage','Change follower status or block abusive accounts');
INSERT OR IGNORE INTO role_permissions(role_id,permission_id)
 SELECT r.id,p.id FROM roles r JOIN permissions p ON p.code IN ('followers.read','comments.read','comments.moderate','followers.manage')
 WHERE r.name IN ('owner','editor');
INSERT OR IGNORE INTO role_permissions(role_id,permission_id)
 SELECT r.id,p.id FROM roles r JOIN permissions p ON p.code IN ('followers.read','comments.read')
 WHERE r.name='analyst';
