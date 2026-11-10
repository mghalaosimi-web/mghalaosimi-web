import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const workerUrl = new URL("../../api-handler.mjs", import.meta.url);
const workerSource = await readFile(workerUrl, "utf8");

test("API handler SQL no longer depends on SQLite rowid ordering", () => {
  assert.doesNotMatch(workerSource, /\browid\b/i);
});

test("admin user role aggregation uses PostgreSQL STRING_AGG", () => {
  assert.match(workerSource, /STRING_AGG\(r\.name, ', '\)/);
  assert.doesNotMatch(workerSource, /GROUP_CONCAT/i);
});

test("analytics groups ISO timestamps using PostgreSQL timestamptz casts", () => {
  assert.match(workerSource, /CAST\(CAST\(created_at AS TIMESTAMPTZ\) AS DATE\)/);
  assert.doesNotMatch(workerSource, /date\(created_at\)/i);
});

test("public resource ordering is explicit for every supported resource", () => {
  for (const resource of ["identity", "education", "skills", "projects", "certificates", "achievements", "technologies"]) {
    assert.match(workerSource, new RegExp(resource + ':'));
  }
  assert.ok(workerSource.includes('ORDER BY "+publicOrder[name]+" LIMIT 100'));
});
