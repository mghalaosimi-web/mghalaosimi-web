import { describe, expect, it } from "vitest";
// @ts-expect-error The production entrypoint is JavaScript and is syntax-checked by check:production.
import productionWorker from "../worker.production.js";

const digest = async (value: string) => {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(bytes)].map((part) => part.toString(16).padStart(2, "0")).join("");
};

function fakeDb(bootstrapHash = "") {
  return {
    prepare(sql: string) {
      return {
        bind(...params: unknown[]) {
          return {
            async run() { return { success: true, meta: { changes: 1 } }; },
            async first() {
              if (sql.includes("SELECT COUNT(*) n FROM admin_users")) return { n: 0 };
              if (sql.includes("SELECT value_json FROM site_settings WHERE key='owner_bootstrap_hash'")) return bootstrapHash ? { value_json: bootstrapHash } : null;
              if (sql.includes("SELECT value_json FROM site_settings WHERE key=?") && params[0] === "owner_bootstrap_hash") return bootstrapHash ? { value_json: bootstrapHash } : null;
              if (sql.includes("SELECT value_json FROM site_settings WHERE key=?")) return { value_json: "1" };
              if (sql.includes("SELECT 1 AS ok")) return { ok: 1 };
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
              if (sql.includes("SELECT COUNT(*) count FROM followers")) return { count: 3 };
              if (sql.includes("SELECT id,status,display_name,consent_at FROM followers")) return { id: "follower-1", status: "active", display_name: "Tester", consent_at: "2026-11-05T00:00:00.000Z" };
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

describe("production Worker security contract", () => {
  it("allows the official Vercel origin on preflight", async () => {
    const response = await productionWorker.fetch(new Request("https://api.example.test/api/admin/dashboard", { method: "OPTIONS", headers: { Origin: "https://mghalaosimi-web.vercel.app" } }), {} as never);
    expect(response.status).toBe(204);
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("https://mghalaosimi-web.vercel.app");
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

  it("reports a connected D1 binding", async () => {
    const response = await productionWorker.fetch(new Request("https://api.example.test/health"), { DB: fakeDb() } as never);
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ status: "ok", database: "connected" });
  });

  it("creates the first owner only through the one-time bootstrap token", async () => {
    const token = "test-bootstrap-token-with-enough-entropy-0001";
    const response = await productionWorker.fetch(new Request("https://api.example.test/api/admin/bootstrap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, email: "owner@example.test", displayName: "Platform Owner", password: "a-very-long-test-password-12345" }),
    }), { DB: fakeDb(await digest(token)) } as never);
    expect(response.status).toBe(201);
    expect(await response.json()).toMatchObject({ success: true });
  });

  it("creates anonymous visitor sessions as unverified, not followers", async () => {
    const response = await productionWorker.fetch(new Request("https://api.example.test/api/public/visitors", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ path: "/projects/waynah/" }),
    }), { DB: engagementDb() } as never);
    expect(response.status).toBe(201);
    expect(await response.json()).toMatchObject({ status: "unverified" });
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
    expect(await response.json()).toMatchObject({ count: 3 });
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
