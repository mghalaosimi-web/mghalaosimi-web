export async function checkReadiness(pool) {
  try {
    const result = await pool.query("SELECT 1 AS ok");
    if (result.rows?.[0]?.ok !== 1) {
      return {
        statusCode: 503,
        body: { status: "not_ready", database: "unavailable" }
      };
    }

    return {
      statusCode: 200,
      body: { status: "ready", database: "connected" }
    };
  } catch {
    return {
      statusCode: 503,
      body: { status: "not_ready", database: "unavailable" }
    };
  }
}
