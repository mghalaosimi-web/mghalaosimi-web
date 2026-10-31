# M.GH.AL Backend API

Independent Worker package. No frontend rebuild, production route, or admin account is created.

Public read-only: GET /health; GET /api/public/{identity|education|skills|technologies|projects|certificates|achievements}[/:id]. Admin: POST /api/admin/auth/login and /logout; authenticated GET|POST|PATCH|DELETE /api/admin/{resource}. Bearer sessions are SHA-256 hashed and RBAC permissions are resolved server-side.

Run npm ci then npm run check. Login expects PBKDF2-SHA256 password hashes encoded as pbkdf2-sha256$iterations$base64(salt)$base64(derivedBits). Provisioning an owner account is intentionally not part of this task. CORS is not authentication. Technologies have no is_published field in the verified schema and are publicly readable. Rate limiting uses D1 site_settings counters and fails closed if D1 is unavailable.
