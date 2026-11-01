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
});
