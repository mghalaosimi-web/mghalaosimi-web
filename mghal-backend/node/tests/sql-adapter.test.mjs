import test from "node:test";
import assert from "node:assert/strict";
import { translateSqliteSql } from "../postgres-adapter.mjs";

test("converts positional SQLite placeholders to PostgreSQL parameters", () => {
  assert.equal(
    translateSqliteSql("SELECT * FROM followers WHERE id=? AND status=?"),
    "SELECT * FROM followers WHERE id=$1 AND status=$2"
  );
});

test("preserves case-insensitive email lookup semantics", () => {
  assert.equal(
    translateSqliteSql("SELECT id FROM admin_users WHERE email=? COLLATE NOCASE LIMIT 1"),
    "SELECT id FROM admin_users WHERE LOWER(email) = LOWER($1) LIMIT 1"
  );
});

test("translates Google identity email lookup semantics", () => {
  assert.equal(
    translateSqliteSql("SELECT provider_subject FROM follower_identities WHERE provider='google' AND email=? COLLATE NOCASE LIMIT 1"),
    "SELECT provider_subject FROM follower_identities WHERE provider='google' AND LOWER(email) = LOWER($1) LIMIT 1"
  );
});

test("does not rewrite SQL that has no SQLite-specific syntax", () => {
  const sql = "DELETE FROM oauth_transactions WHERE state_hash=$1 RETURNING visitor_hash";
  assert.equal(translateSqliteSql(sql), sql);
});
