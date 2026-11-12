import test from "node:test";
import assert from "node:assert/strict";
import { checkReadiness } from "../health.mjs";

test("readiness returns ready when PostgreSQL responds to SELECT 1", async () => {
  const result = await checkReadiness({
    query: async (sql) => {
      assert.equal(sql, "SELECT 1 AS ok");
      return { rows: [{ ok: 1 }] };
    }
  });
  assert.deepEqual(result, {
    statusCode: 200,
    body: { status: "ready", database: "connected" }
  });
});

test("readiness returns 503 when PostgreSQL is unavailable", async () => {
  const result = await checkReadiness({
    query: async () => { throw new Error("private connection detail"); }
  });
  assert.deepEqual(result, {
    statusCode: 503,
    body: { status: "not_ready", database: "unavailable" }
  });
  assert.equal(JSON.stringify(result).includes("private connection detail"), false);
});

test("readiness does not accept an unexpected probe result", async () => {
  const result = await checkReadiness({ query: async () => ({ rows: [] }) });
  assert.equal(result.statusCode, 503);
});
