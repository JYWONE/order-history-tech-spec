import pg from "pg";

import type { AppConfig } from "./config.js";
import { config } from "./config.js";

const { Pool } = pg;

export interface Queryable {
  query<T = Record<string, unknown>>(
    text: string,
    values?: unknown[]
  ): Promise<{ rows: T[]; rowCount: number | null }>;
}

export function createPool(appConfig: AppConfig = config) {
  return new Pool({
    connectionString: appConfig.DATABASE_URL,
    max: appConfig.PGPOOL_MAX
  });
}
