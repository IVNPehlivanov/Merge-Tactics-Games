import postgres from "postgres";

// Use a global singleton to survive Next.js hot reloads in dev.
// prepare: false avoids "prepared statement does not exist" errors in serverless/pooled environments.
const globalForDb = globalThis as unknown as { sql: ReturnType<typeof postgres> | undefined };

export const sql =
  globalForDb.sql ??
  (globalForDb.sql = postgres(process.env.DATABASE_URL!, { prepare: false }));
