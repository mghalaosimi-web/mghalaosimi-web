import { describe, expect, it } from "vitest";
// @ts-expect-error The production entrypoint is JavaScript and is syntax-checked by check:production.
import productionWorker from "../worker.production.js";

const digest = async (value: string) => {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(bytes)].map((part) => part.toString(16).padStart(2, "0")).join("");
};

function fakeDb(bootstrapHash = "", adminUserCount = 0, mediaRecord: { blob_data: Uint8Array; mime_type: string } | null = null, publishedCertificateReference = true) {
  return {
    prepare(sql: string) {
      return {
        bind(...params: unknown[]) {
          return {
            async run() { return { success: true, meta: { changes: 1 } }; },
            async first() {
              if (sql.includes("SELECT COUNT(*) n FROM admin_users")) return { n: adminUserCount };
              if (sql.includes("SELECT value_json FROM site_settings WHERE key='owner_bootstrap_hash'")) return bootstrapHash ? { value_json: bootstrapHash } : null;
              if (sql.includes("SELECT value_json FROM site_settings WHERE key=?") && params[0] === "owner_bootstrap_hash") return bootstrapHash ? { value_json: bootstrapHash } : null;
              if (sql.includes("SELECT value_json FROM site_settings WHERE key=?")) return { value_json: "1" };
              if (sql.includes("SELECT 1 AS ok")) return { ok: 1 };
              if (sql.includes("SELECT m.blob_data,m.mime_type FROM media")) {
                if (mediaRecord?.mime_type === "application/pdf" && !publishedCertificateReference) return null;
                return mediaRecord;
              }
              return null;
            },
          };
        },
      };
    },
    async batch() { return [{ meta: { changes: 1 } }, { meta: { changes: 1 } }, { meta: { changes: 1 } }]; },
  };
}


function engagementDb() {
  return {
    prepare(sql: string) {
      return {
        bind(...params: unknown[]) {
          return {
            async run() { return { success: true, meta: { changes: 1 } }; },
            async first() {
              if (sql.includes("SELECT value_json FROM site_settings WHERE key=?")) return { value_json: "1" };
              if (sql.includes("SELECT COUNT(*) count FROM followers") && sql.includes("consent_at IS NULL")) return { count: 5 };
              if (sql.includes("SELECT COUNT(*) count FROM followers") && sql.includes("consent_at IS NOT NULL")) return { count: 3 };
              if (sql.includes("SELECT id,status,display_name,consent_at FROM followers") && params[0] === "visitor:ffe054fe7ae0cb6dc65c3af9b61d5209f439851db43d0ba5997337df154668eb") return { id: "follower-1", status: "active", display_name: "Tester", consent_at: "2026-11-05T00:00:00.000Z" };
              if (sql.includes("SELECT id,status,display_name,consent_at FROM followers")) return null;
              if (sql.includes("SELECT id,status,display_name FROM followers")) return null;
              if (sql.includes("SELECT id,status FROM followers")) return { id: "follower-1", status: "unverified" };
              if (sql.includes("UPDATE followers SET display_name")) return { id: "follower-1", status: "active", display_name: "Tester", consent_at: "2026-11-05T00:00:00.000Z" };
              if (sql.includes("SELECT id FROM followers")) return { id: "follower-1" };
              if (sql.includes("SELECT id FROM projects") || sql.includes("SELECT id FROM articles")) return { id: params[0] };
              if (sql.includes("DELETE FROM reactions")) return { id: "reaction-1" };
              return null;
            },
            async all() {
              if (sql.includes("SELECT reaction,COUNT(*) count FROM reactions")) return { results: [{ reaction: "like", count: 2 }, { reaction: "clap", count: 1 }] };
              if (sql.includes("SELECT c.id,c.body,c.created_at")) return { results: [] };
              return { results: [] };
            },
          };
        },
      };
    },
  };
}


function siteReactionDb() {
  return {
    prepare(sql: string) {
      return {
        bind() {
          return {
            async run() { return { success: true, meta: { changes: 1 } }; },
            async first() {
              if (sql.includes("SELECT id,status,display_name,consent_at FROM followers")) {
                return { id: "follower-1", status: "unsubscribed", display_name: null, consent_at: null };
              }
              if (sql.includes("UPDATE followers SET status='active',display_name=NULL")) return { id: "follower-1", status: "active" };
              if (sql.includes("COUNT(DISTINCT session_hash)")) return { count: 9 };
              if (sql.includes("SELECT id FROM analytics_events")) return { id: "site-like-1" };
              if (sql.includes("DELETE FROM analytics_events")) return { id: "site-like-1" };
              return null;
            },
            async all() { return { results: [] }; },
          };
        },
      };
    },
  };
}

function googleIdentityDb() {
  const base = engagementDb();
  return {
    prepare(sql: string) {
      const statement = base.prepare(sql);
      return {
        bind(...params: unknown[]) {
          const bound = statement.bind(...params);
          return {
            ...bound,
            async first() {
              if (sql.includes("SELECT email,email_verified,display_name FROM follower_identities")) {
                return { email: "private@example.test", email_verified: 1, display_name: "Private Name" };
              }
              return bound.first();
            },
          };
        },
      };
    },
  };
}

function adminPermissionDb(permissions: string[] = []) {
  return {
    prepare(sql: string) {
      return {
        bind(...params: unknown[]) {
          return {
            async run() { return { success: true, meta: { changes: 1 } }; },
            async first() {
              if (sql.includes("SELECT value_json FROM site_settings WHERE key=?")) return { value_json: "1" };
              if (sql.includes("SELECT u.id,u.email FROM admin_sessions")) return { id: "admin-1", email: "admin@example.test" };
              if (sql.includes("SELECT 1 FROM admin_user_roles")) return permissions.includes(String(params[1])) ? { ok: 1 } : null;
              return null;
            },
            async all() { return { results: [] }; },
          };
        },
      };
    },
  };
}

async function testPasswordHash(password: string) {
  const salt = new Uint8Array(16).fill(7);
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations: 210000 }, key, 256);
  const encode = (value: Uint8Array) => btoa(String.fromCharCode(...value));
  return "pbkdf2-sha256$210000$" + encode(salt) + "$" + encode(new Uint8Array(bits));
}

function loginDb(user: { id: string; email: string; password_hash: string; status: string }) {
  let sessionInserted = false;
  return {
    prepare(sql: string) {
      return {
        bind(..._params: unknown[]) {
          return {
            async run() {
              if (sql.includes("INSERT INTO admin_sessions")) sessionInserted = true;
              return { success: true, meta: { changes: 1 } };
            },
            async first() {
              if (sql.includes("SELECT value_json FROM site_settings WHERE key=?")) return { value_json: "1" };
              if (sql.includes("SELECT id,email,password_hash,status FROM admin_users")) return user;
              return null;
            },
            async all() { return { results: [] }; },
          };
        },
      };
    },
    get sessionInserted() { return sessionInserted; },
  };
}

function adminCrudDb(permissions: string[] = []) {
  return {
    prepare(sql: string) {
      return {
        bind(...params: unknown[]) {
          return {
            async run() { return { success: true, meta: { changes: 1 } }; },
            async first() {
              if (sql.includes("SELECT value_json FROM site_settings WHERE key=?")) return { value_json: "1" };
              if (sql.includes("SELECT u.id,u.email FROM admin_sessions")) return { id: "admin-1", email: "admin@example.test" };
              if (sql.includes("SELECT 1 FROM admin_user_roles")) return permissions.includes(String(params[1])) ? { ok: 1 } : null;
              if (sql.includes("FROM projects WHERE id=?")) return { id: "project-1", slug: "waynah", name: "WAYNAH", status: "Experimental" };
              if (sql.startsWith("INSERT INTO projects")) return { id: params[0], slug: params[1], name: params[2], status: params[3] };
              if (sql.startsWith("UPDATE projects SET")) return { id: params[params.length - 1], status: params[0] };
              if (sql.includes("FROM media WHERE id=?")) return { id: params[0], original_name: "brand-mark.webp" };
              return null;
            },
            async all() {
              if (sql.includes("FROM projects ORDER BY")) return { results: [{ id: "project-1", slug: "waynah" }] };
              return { results: [] };
            },
          };
        },
      };
    },
  };
}

function adminUserCreateDb(changes: [number, number]) {
  let cleanup = false;
  return {
    prepare(sql: string) {
      return {
        bind(..._params: unknown[]) {
          return {
            async run() {
              if (sql.startsWith("DELETE FROM admin_users WHERE id=? AND NOT EXISTS")) cleanup = true;
              return { success: true, meta: { changes: 1 } };
            },
            async first() {
              if (sql.includes("SELECT value_json FROM site_settings WHERE key=?")) return { value_json: "1" };
              if (sql.includes("SELECT u.id,u.email FROM admin_sessions")) return { id: "admin-1", email: "admin@example.test" };
              if (sql.includes("SELECT 1 FROM admin_user_roles")) return { ok: 1 };
              return null;
            },
            async all() { return { results: [] }; },
          };
        },
      };
    },
    async batch() { return changes.map(value => ({ meta: { changes: value } })); },
    get cleanup() { return cleanup; },
  };
}

function idempotentReactionDb() {
  const base = engagementDb();
  let writes = 0;
  return {
    prepare(sql: string) {
      const statement = base.prepare(sql);
      return {
        bind(...params: unknown[]) {
          const bound = statement.bind(...params);
          if (sql.includes("INSERT INTO reactions")) {
            return { ...bound, async run() {
              writes += 1;
              return { success: true, meta: { changes: writes === 1 ? 1 : 0 } };
            }};
          }
          return bound;
        },
      };
    },
  };
}

describe("production Worker security contract", () => {
  it("allows the official Vercel origin on preflight", async () => {
    const response = await productionWorker.fetch(new Request("https://api.example.test/api/admin/dashboard", { method: "OPTIONS", headers: { Origin: "https://mghalaosimi-web.vercel.app" } }), {} as never);
    expect(response.status).toBe(204);
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("https://mghalaosimi-web.vercel.app");
    expect(response.headers.get("Access-Control-Allow-Headers")).toContain("X-Visitor-Token");
  });

  it("allows only Vercel preview hostnames belonging to this project", async () => {
    const origin = "https://mghalaosimi-preview123-mghalaosimi-webs-projects.vercel.app";
    const response = await productionWorker.fetch(new Request("https://api.example.test/api/admin/dashboard", { method: "OPTIONS", headers: { Origin: origin } }), {} as never);
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe(origin);
  });

  it("rejects untrusted origins before database access", async () => {
    const response = await productionWorker.fetch(new Request("https://api.example.test/api/public/projects", { headers: { Origin: "https://attacker.example" } }), {} as never);
    expect(response.status).toBe(403);
  });

  it("keeps Google sign-in disabled until all server-side credentials are configured", async () => {
    const response = await productionWorker.fetch(new Request("https://api.example.test/api/public/auth/google/config"), { DB: fakeDb() } as never);
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ enabled: false, provider: "google" });
  });

  it("refuses to start Google sign-in when Worker credentials are missing", async () => {
    const response = await productionWorker.fetch(new Request("https://api.example.test/api/public/auth/google/start", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorToken: "a".repeat(64), returnPath: "/" }),
    }), { DB: fakeDb() } as never);
    expect(response.status).toBe(503);
    expect(await response.json()).toMatchObject({ error: { code: "GOOGLE_AUTH_NOT_CONFIGURED" } });
  });

  it("reports a connected D1 binding", async () => {
    const response = await productionWorker.fetch(new Request("https://api.example.test/health"), { DB: fakeDb() } as never);
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ status: "ok", database: "connected" });
  });

  it("honors RATE_LIMIT_PER_MINUTE from the Worker environment", async () => {
    const counts = new Map<string, number>();
    const DB = {
      prepare(sql: string) {
        return {
          bind(...params: unknown[]) {
            return {
              async run() {
                if (sql.startsWith("INSERT INTO site_settings(key,value_json)")) {
                  const key = String(params[0] ?? "");
                  counts.set(key, (counts.get(key) ?? 0) + 1);
                }
                return { success: true, meta: { changes: 1 } };
              },
              async first() {
                if (sql.includes("SELECT value_json FROM site_settings WHERE key=?")) {
                  return { value_json: String(counts.get(String(params[0] ?? "")) ?? 0) };
                }
                if (sql.includes("SELECT COUNT(*) count FROM followers")) return { count: 0 };
                return null;
              },
              async all() { return { results: [] }; },
            };
          },
        };
      },
    };
    const request = () => productionWorker.fetch(new Request("https://api.example.test/api/public/followers/count", {
      headers: { "CF-Connecting-IP": "203.0.113.42" },
    }), { DB, RATE_LIMIT_PER_MINUTE: "2" } as never);

    expect((await request()).status).toBe(200);
    expect((await request()).status).toBe(200);
    const blocked = await request();
    expect(blocked.status).toBe(429);
    expect(await blocked.json()).toMatchObject({ error: { code: "RATE_LIMITED" } });
  });

  it("creates the first owner only through the one-time bootstrap token", async () => {
    const token = "test-bootstrap-token-with-enough-entropy-0001";
    const response = await productionWorker.fetch(new Request("https://api.example.test/api/admin/bootstrap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, email: "owner@example.test", displayName: "Platform Owner", password: "a-very-long-test-password-12345" }),
    }), { DB: fakeDb(await digest(token)), OWNER_BOOTSTRAP_TOKEN: token } as never);
    expect(response.status).toBe(201);
    expect(await response.json()).toMatchObject({ success: true });
  });

  it("keeps first-owner bootstrap unavailable when the Worker secret is missing", async () => {
    const token = "stored-bootstrap-token-with-enough-entropy-0001";
    const status = await productionWorker.fetch(new Request("https://api.example.test/api/admin/bootstrap/status"), { DB: fakeDb(await digest(token)) } as never);
    expect(status.status).toBe(200);
    expect(await status.json()).toMatchObject({ available: false, ownerExists: false, rotationRequired: false });
    const bootstrap = await productionWorker.fetch(new Request("https://api.example.test/api/admin/bootstrap", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, email: "owner@example.test", displayName: "Platform Owner", password: "a-very-long-test-password-12345" }),
    }), { DB: fakeDb(await digest(token)) } as never);
    expect(bootstrap.status).toBe(503);
    expect(await bootstrap.json()).toMatchObject({ error: { code: "BOOTSTRAP_NOT_CONFIGURED" } });
  });

  it("requires the D1 bootstrap hash to match the configured Worker secret", async () => {
    const configuredToken = "configured-bootstrap-secret-with-at-least-32-characters";
    const staleToken = "stale-bootstrap-token-with-at-least-32-characters-0001";
    const response = await productionWorker.fetch(new Request("https://api.example.test/api/admin/bootstrap", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: configuredToken, email: "owner@example.test", displayName: "Platform Owner", password: "a-very-long-test-password-12345" }),
    }), { DB: fakeDb(await digest(staleToken)), OWNER_BOOTSTRAP_TOKEN: configuredToken } as never);
    expect(response.status).toBe(409);
    expect(await response.json()).toMatchObject({ error: { code: "BOOTSTRAP_ROTATION_REQUIRED" } });
  });

  it("reports rotation required when the configured Worker secret does not match the stored hash", async () => {
    const token = "rotation-secret-with-at-least-32-characters-0001";
    const response = await productionWorker.fetch(new Request("https://api.example.test/api/admin/bootstrap/status"), {
      DB: fakeDb("old-bootstrap-hash"), OWNER_BOOTSTRAP_TOKEN: token,
    } as never);
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ available: false, ownerExists: false, rotationRequired: true });
  });

  it("rotates the one-time bootstrap hash using a configured Worker secret", async () => {
    const token = "rotation-secret-with-at-least-32-characters-0001";
    const response = await productionWorker.fetch(new Request("https://api.example.test/api/admin/bootstrap/rotate", {
      method: "POST", headers: { Authorization: "Bearer " + token },
    }), { DB: fakeDb("old-bootstrap-hash"), OWNER_BOOTSTRAP_TOKEN: token } as never);
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ success: true });
  });

  it("refuses bootstrap rotation when the Worker secret is not configured", async () => {
    const response = await productionWorker.fetch(new Request("https://api.example.test/api/admin/bootstrap/rotate", {
      method: "POST", headers: { Authorization: "Bearer " + "x".repeat(40) },
    }), { DB: fakeDb("old-bootstrap-hash") } as never);
    expect(response.status).toBe(503);
  });

  it("rejects bootstrap rotation with an invalid secret", async () => {
    const token = "rotation-secret-with-at-least-32-characters-0001";
    const response = await productionWorker.fetch(new Request("https://api.example.test/api/admin/bootstrap/rotate", {
      method: "POST", headers: { Authorization: "Bearer " + "x".repeat(40) },
    }), { DB: fakeDb("old-bootstrap-hash"), OWNER_BOOTSTRAP_TOKEN: token } as never);
    expect(response.status).toBe(403);
  });

  it("prevents bootstrap rotation after an admin account exists", async () => {
    const token = "rotation-secret-with-at-least-32-characters-0001";
    const response = await productionWorker.fetch(new Request("https://api.example.test/api/admin/bootstrap/rotate", {
      method: "POST", headers: { Authorization: "Bearer " + token },
    }), { DB: fakeDb("old-bootstrap-hash", 1), OWNER_BOOTSTRAP_TOKEN: token } as never);
    expect(response.status).toBe(409);
  });

  it("requires the configured Worker secret during first-owner bootstrap", async () => {
    const configuredToken = "rotation-secret-with-at-least-32-characters-0001";
    const suppliedToken = "different-token-with-at-least-32-characters-0002";
    const response = await productionWorker.fetch(new Request("https://api.example.test/api/admin/bootstrap", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: suppliedToken, email: "owner@example.test", displayName: "Platform Owner", password: "a-very-long-test-password-12345" }),
    }), { DB: fakeDb(await digest(suppliedToken)), OWNER_BOOTSTRAP_TOKEN: configuredToken } as never);
    expect(response.status).toBe(403);
  });

  it("allows unauthenticated login attempts to reach credential verification", async () => {
    const response = await productionWorker.fetch(new Request("https://api.example.test/api/admin/auth/login", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "owner@example.test", password: "a-very-long-test-password-12345" }),
    }), { DB: fakeDb() } as never);
    expect(response.status).toBe(401);
    expect(await response.json()).toMatchObject({ error: { code: "INVALID_CREDENTIALS" } });
  });

  it("creates a bounded admin session after valid password verification", async () => {
    const password = "a-very-long-test-password-12345";
    const db = loginDb({ id: "owner-1", email: "owner@example.test", password_hash: await testPasswordHash(password), status: "active" });
    const response = await productionWorker.fetch(new Request("https://api.example.test/api/admin/auth/login", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "owner@example.test", password }),
    }), { DB: db } as never);
    expect(response.status).toBe(200);
    const data = await response.json() as { token: string; expiresAt: string; user: { id: string; email: string } };
    expect(data.token.length).toBeGreaterThan(32);
    expect(data.user).toEqual({ id: "owner-1", email: "owner@example.test" });
    expect(data).not.toHaveProperty("password_hash");
    expect(db.sessionInserted).toBe(true);
  });

  it("does not create an admin session when password verification fails", async () => {
    const db = loginDb({ id: "owner-1", email: "owner@example.test", password_hash: await testPasswordHash("a-very-long-test-password-12345"), status: "active" });
    const response = await productionWorker.fetch(new Request("https://api.example.test/api/admin/auth/login", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "owner@example.test", password: "a-different-long-password-67890" }),
    }), { DB: db } as never);
    expect(response.status).toBe(401);
    expect(db.sessionInserted).toBe(false);
  });

  it("serves a PDF only when it is referenced by a published certificate", async () => {
    const bytes = new Uint8Array([37, 80, 68, 70, 45, 49, 46, 52]);
    const response = await productionWorker.fetch(new Request("https://api.example.test/api/public/media/certificate-pdf-1"), {
      DB: fakeDb("", 0, { blob_data: bytes, mime_type: "application/pdf" }),
    } as never);
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("application/pdf");
    expect(response.headers.get("Content-Disposition")).toBe("inline");
    expect(response.headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(new Uint8Array(await response.arrayBuffer())).toEqual(bytes);
  });

  it("does not expose an unreferenced PDF through the public media route", async () => {
    const response = await productionWorker.fetch(new Request("https://api.example.test/api/public/media/unlinked-pdf"), {
      DB: fakeDb("", 0, { blob_data: new Uint8Array([37, 80, 68, 70]), mime_type: "application/pdf" }, false),
    } as never);
    expect(response.status).toBe(404);
    expect(await response.json()).toMatchObject({ error: { code: "MEDIA_NOT_FOUND" } });
  });

  it("continues to serve public image media", async () => {
    const bytes = new Uint8Array([137, 80, 78, 71]);
    const response = await productionWorker.fetch(new Request("https://api.example.test/api/public/media/public-image-1"), {
      DB: fakeDb("", 0, { blob_data: bytes, mime_type: "image/png" }),
    } as never);
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("image/png");
    expect(new Uint8Array(await response.arrayBuffer())).toEqual(bytes);
  });


  it("rejects oversized visitor tokens and unknown identity fields", async () => {
    const response = await productionWorker.fetch(new Request("https://api.example.test/api/public/visitors", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorToken: "a".repeat(129), path: "/", email: "private@example.test" }),
    }), { DB: engagementDb() } as never);
    expect(response.status).toBe(400);
  });

  it("rejects unauthenticated dashboard and content administration requests", async () => {
    const dashboard = await productionWorker.fetch(new Request("https://api.example.test/api/admin/dashboard"), { DB: engagementDb() } as never);
    const projects = await productionWorker.fetch(new Request("https://api.example.test/api/admin/projects", { method: "POST", body: JSON.stringify({ slug: "waynah" }) }), { DB: engagementDb() } as never);
    expect(dashboard.status).toBe(401);
    expect(projects.status).toBe(401);
  });

  it("returns reaction state using a visitor header instead of requiring a token in the URL", async () => {
    const response = await productionWorker.fetch(new Request("https://api.example.test/api/public/reactions?targetType=project&targetId=project-1", {
      headers: { "X-Visitor-Token": "a".repeat(64) },
    }), { DB: engagementDb() } as never);
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ counts: { like: 2, clap: 1 }, viewerReactions: { like: false, clap: false } });
  });

  it("does not return a linked Google email to the public browser client", async () => {
    const response = await productionWorker.fetch(new Request("https://api.example.test/api/public/auth/google/status", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorToken: "a".repeat(64) }),
    }), { DB: googleIdentityDb() } as never);
    expect(response.status).toBe(200);
    const data = await response.json() as Record<string, unknown>;
    expect(data).toMatchObject({ connected: true, emailVerified: true, suggestedName: "Private Name" });
    expect(data).not.toHaveProperty("email");
  });

  it("deduplicates repeated reactions for one visitor, target, and reaction", async () => {
    const makeRequest = () => new Request("https://api.example.test/api/public/reactions", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorToken: "a".repeat(64), targetType: "project", targetId: "project-1", reaction: "like" }),
    });
    const db = idempotentReactionDb();
    const first = await productionWorker.fetch(makeRequest(), { DB: db } as never);
    const second = await productionWorker.fetch(makeRequest(), { DB: db } as never);
    expect(await first.json()).toMatchObject({ success: true, created: true });
    expect(await second.json()).toMatchObject({ success: true, created: false });
  });

  it("enforces read, write, and user-management permissions after authentication", async () => {
    const token = "test-admin-session";
    const getProjects = await productionWorker.fetch(new Request("https://api.example.test/api/admin/projects", {
      headers: { Authorization: "Bearer " + token },
    }), { DB: adminPermissionDb(["content.write"]) } as never);
    const createProject = await productionWorker.fetch(new Request("https://api.example.test/api/admin/projects", {
      method: "POST", headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
      body: JSON.stringify({ slug: "waynah", name: "WAYNAH", status: "Experimental" }),
    }), { DB: adminPermissionDb(["content.read"]) } as never);
    const listUsers = await productionWorker.fetch(new Request("https://api.example.test/api/admin/users", {
      headers: { Authorization: "Bearer " + token },
    }), { DB: adminPermissionDb(["content.read", "content.write"]) } as never);
    const deleteProject = await productionWorker.fetch(new Request("https://api.example.test/api/admin/projects/project-1", {
      method: "DELETE", headers: { Authorization: "Bearer " + token },
    }), { DB: adminPermissionDb(["content.read", "content.write"]) } as never);
    const changeUser = await productionWorker.fetch(new Request("https://api.example.test/api/admin/users/user-2", {
      method: "PATCH", headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
      body: JSON.stringify({ status: "disabled" }),
    }), { DB: adminPermissionDb(["content.read", "content.write"]) } as never);
    expect(getProjects.status).toBe(403);
    expect(createProject.status).toBe(403);
    expect(listUsers.status).toBe(403);
    expect(deleteProject.status).toBe(403);
    expect(changeUser.status).toBe(403);
  });

  it("allows project CRUD only with the corresponding content permissions", async () => {
    const token = "test-admin-session";
    const read = await productionWorker.fetch(new Request("https://api.example.test/api/admin/projects", {
      headers: { Authorization: "Bearer " + token },
    }), { DB: adminCrudDb(["content.read"]) } as never);
    const create = await productionWorker.fetch(new Request("https://api.example.test/api/admin/projects", {
      method: "POST", headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
      body: JSON.stringify({ slug: "waynah", name: "WAYNAH", status: "Experimental" }),
    }), { DB: adminCrudDb(["content.write"]) } as never);
    const update = await productionWorker.fetch(new Request("https://api.example.test/api/admin/projects/project-1", {
      method: "PATCH", headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Paused" }),
    }), { DB: adminCrudDb(["content.write"]) } as never);
    const remove = await productionWorker.fetch(new Request("https://api.example.test/api/admin/projects/project-1", {
      method: "DELETE", headers: { Authorization: "Bearer " + token },
    }), { DB: adminCrudDb(["content.delete"]) } as never);
    const mediaDenied = await productionWorker.fetch(new Request("https://api.example.test/api/admin/media/media-1", {
      method: "DELETE", headers: { Authorization: "Bearer " + token },
    }), { DB: adminCrudDb(["content.write"]) } as never);
    const mediaRemove = await productionWorker.fetch(new Request("https://api.example.test/api/admin/media/media-1", {
      method: "DELETE", headers: { Authorization: "Bearer " + token },
    }), { DB: adminCrudDb(["content.delete"]) } as never);
    expect(read.status).toBe(200);
    expect(create.status).toBe(201);
    expect(update.status).toBe(200);
    expect(remove.status).toBe(200);
    expect(mediaDenied.status).toBe(403);
    expect(mediaRemove.status).toBe(200);
  });

  it("assigns only the requested editor/analyst role when creating an admin user", async () => {
    const token = "test-admin-session";
    const db = adminUserCreateDb([1, 1]);
    const response = await productionWorker.fetch(new Request("https://api.example.test/api/admin/users", {
      method: "POST", headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
      body: JSON.stringify({ email: "editor@example.test", password: "a-very-long-test-password-12345", displayName: "Content Editor", role: "editor" }),
    }), { DB: db } as never);
    expect(response.status).toBe(201);
    expect(await response.json()).toMatchObject({ email: "editor@example.test", displayName: "Content Editor", role: "editor" });
  });

  it("cleans up a newly inserted admin account if role assignment fails", async () => {
    const token = "test-admin-session";
    const db = adminUserCreateDb([1, 0]);
    const response = await productionWorker.fetch(new Request("https://api.example.test/api/admin/users", {
      method: "POST", headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
      body: JSON.stringify({ email: "editor@example.test", password: "a-very-long-test-password-12345", displayName: "Content Editor", role: "editor" }),
    }), { DB: db } as never);
    expect(response.status).toBe(409);
    expect(await response.json()).toMatchObject({ error: { code: "USER_CREATE_FAILED" } });
    expect(db.cleanup).toBe(true);
  });

  it("creates a visitor session without silently following the site", async () => {
    const response = await productionWorker.fetch(new Request("https://api.example.test/api/public/visitors", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ path: "/projects/waynah/" }),
    }), { DB: engagementDb() } as never);
    expect(response.status).toBe(201);
    expect(await response.json()).toMatchObject({ status: "unsubscribed", displayName: null, guestFollowing: false });
  });

  it("activates anonymous following only after the visitor chooses the follow action", async () => {
    const response = await productionWorker.fetch(new Request("https://api.example.test/api/public/followers/guest", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorToken: "a".repeat(64) }),
    }), { DB: siteReactionDb() } as never);
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ success: true, following: true, anonymous: true });
  });

  it("requires explicit consent before following", async () => {
    const response = await productionWorker.fetch(new Request("https://api.example.test/api/public/followers", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorToken: "a".repeat(64), displayName: "Tester", consent: false }),
    }), { DB: engagementDb() } as never);
    expect(response.status).toBe(400);
  });


  it("activates a follower only after a valid explicit opt-in", async () => {
    const response = await productionWorker.fetch(new Request("https://api.example.test/api/public/followers", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorToken: "a".repeat(64), displayName: "Tester", consent: true }),
    }), { DB: engagementDb() } as never);
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ success: true, following: true, data: { status: "active" } });
  });

  it("allows a browser-linked follower to unsubscribe", async () => {
    const response = await productionWorker.fetch(new Request("https://api.example.test/api/public/followers", {
      method: "DELETE", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorToken: "a".repeat(64) }),
    }), { DB: engagementDb() } as never);
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ success: true, following: false });
  });

  it("records and returns a durable homepage like for the visitor identity", async () => {
    const token = "a".repeat(64);
    const db = siteReactionDb();
    const get = await productionWorker.fetch(new Request("https://api.example.test/api/public/site-reactions?targetId=mghal-home", {
      headers: { "X-Visitor-Token": token },
    }), { DB: db } as never);
    expect(get.status).toBe(200);
    expect(await get.json()).toMatchObject({ targetType: "page", targetId: "mghal-home", counts: { like: 9 }, viewerReactions: { like: true } });

    const post = await productionWorker.fetch(new Request("https://api.example.test/api/public/site-reactions", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorToken: token, targetId: "mghal-home", reaction: "like" }),
    }), { DB: db } as never);
    expect(post.status).toBe(200);
    expect(await post.json()).toMatchObject({ success: true, created: false });

    const remove = await productionWorker.fetch(new Request("https://api.example.test/api/public/site-reactions", {
      method: "DELETE", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorToken: token, targetId: "mghal-home", reaction: "like" }),
    }), { DB: db } as never);
    expect(remove.status).toBe(200);
    expect(await remove.json()).toMatchObject({ success: true, removed: true });
  });

  it("returns viewer-specific like and clap state for a visitor", async () => {
    const response = await productionWorker.fetch(new Request("https://api.example.test/api/public/reactions?targetType=project&targetId=project-1&visitorToken=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"), { DB: engagementDb() } as never);
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ counts: { like: 2, clap: 1 }, viewerReactions: { like: false, clap: false } });
  });

  it("records a project reaction for a valid visitor", async () => {
    const response = await productionWorker.fetch(new Request("https://api.example.test/api/public/reactions", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorToken: "a".repeat(64), targetType: "project", targetId: "project-1", reaction: "like" }),
    }), { DB: engagementDb() } as never);
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ success: true, created: true });
  });

  it("accepts a comment into moderation rather than publishing it immediately", async () => {
    const response = await productionWorker.fetch(new Request("https://api.example.test/api/public/comments", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorToken: "a".repeat(64), articleId: "article-1", body: "A useful article." }),
    }), { DB: engagementDb() } as never);
    expect(response.status).toBe(201);
    expect(await response.json()).toMatchObject({ status: "pending" });
  });
  it("returns only the public follower count", async () => {
    const response = await productionWorker.fetch(new Request("https://api.example.test/api/public/followers/count"), { DB: engagementDb() } as never);
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ count: 3, guestCount: 5 });
  });

  it("returns aggregate reactions for a published project", async () => {
    const response = await productionWorker.fetch(new Request("https://api.example.test/api/public/reactions?targetType=project&targetId=project-1"), { DB: engagementDb() } as never);
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ counts: { like: 2, clap: 1 } });
  });

  it("serves only approved comments for published articles", async () => {
    const response = await productionWorker.fetch(new Request("https://api.example.test/api/public/comments?articleId=article-1"), { DB: engagementDb() } as never);
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ data: [] });
  });
});
