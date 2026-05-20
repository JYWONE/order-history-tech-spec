import "dotenv/config";

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import pg from "pg";

const { Client } = pg;

const databaseUrl =
  process.env.DATABASE_URL ??
  "postgres://order_history:order_history@localhost:5432/order_history";

const migrationsDir = path.resolve("migrations");

async function main() {
  const client = new Client({ connectionString: databaseUrl });
  await client.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        filename text PRIMARY KEY,
        applied_at timestamptz NOT NULL DEFAULT now()
      )
    `);

    const files = (await readdir(migrationsDir))
      .filter((file) => file.endsWith(".sql"))
      .sort();

    for (const file of files) {
      const existing = await client.query(
        "SELECT 1 FROM schema_migrations WHERE filename = $1",
        [file]
      );

      if (existing.rowCount) {
        console.log(`skip ${file}`);
        continue;
      }

      const sql = await readFile(path.join(migrationsDir, file), "utf8");
      console.log(`apply ${file}`);

      await client.query("BEGIN");
      try {
        await client.query(sql);
        await client.query("INSERT INTO schema_migrations (filename) VALUES ($1)", [
          file
        ]);
        await client.query("COMMIT");
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      }
    }
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
