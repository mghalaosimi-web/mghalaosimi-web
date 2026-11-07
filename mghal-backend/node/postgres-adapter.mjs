/**
 * Minimal Cloudflare D1-compatible adapter backed by PostgreSQL.
 *
 * This compatibility layer lets the existing, security-reviewed API contract
 * run in Node.js while SQL is migrated incrementally. It is deliberately small:
 * only prepare/bind, first, all, run, and transactional batch are implemented.
 */
export function translateSqliteSql(sql) {
  let translated = String(sql);

  // SQLite's NOCASE collation is not available in PostgreSQL. Preserve the
  // case-insensitive lookup semantics explicitly for the two identity queries.
  translated = translated.replace(
    /\bemail\s*=\s*\?\s+COLLATE\s+NOCASE\b/gi,
    "LOWER(email) = LOWER(?)"
  );

  let index = 0;
  translated = translated.replace(/\?/g, () => `$${++index}`);

  return translated;
}

class PgPreparedStatement {
  constructor(pool, sql, params = []) {
    this.pool = pool;
    this.sql = sql;
    this.params = params;
  }

  bind(...params) {
    return new PgPreparedStatement(this.pool, this.sql, params);
  }

  async first() {
    const result = await this.pool.query(
      translateSqliteSql(this.sql),
      this.params
    );
    return result.rows[0] ?? null;
  }

  async all() {
    const result = await this.pool.query(
      translateSqliteSql(this.sql),
      this.params
    );
    return {
      success: true,
      results: result.rows,
      meta: {
        changes: result.rowCount ?? 0,
        last_row_id: 0
      }
    };
  }

  async run() {
    const result = await this.pool.query(
      translateSqliteSql(this.sql),
      this.params
    );
    return {
      success: true,
      meta: {
        changes: result.rowCount ?? 0,
        last_row_id: 0
      }
    };
  }
}

export class PgD1Database {
  constructor(pool) {
    this.pool = pool;
  }

  prepare(sql) {
    return new PgPreparedStatement(this.pool, sql);
  }

  async batch(statements) {
    const client = await this.pool.connect();
    const results = [];

    try {
      await client.query("BEGIN");

      for (const statement of statements) {
        if (!(statement instanceof PgPreparedStatement)) {
          throw new TypeError("batch() accepts prepared statements created by this adapter");
        }

        const result = await client.query(
          translateSqliteSql(statement.sql),
          statement.params
        );

        results.push({
          success: true,
          results: result.rows,
          meta: {
            changes: result.rowCount ?? 0,
            last_row_id: 0
          }
        });
      }

      await client.query("COMMIT");
      return results;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}
