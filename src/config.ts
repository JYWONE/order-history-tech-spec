import "dotenv/config";

import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z
    .string()
    .default("postgres://order_history:order_history@localhost:5432/order_history"),
  PGPOOL_MAX: z.coerce.number().int().positive().default(10),
  QUERY_WINDOW_MAX_DAYS: z.coerce.number().int().positive().default(93),
  LATEST_LOOKBACK_DAYS: z.coerce.number().int().positive().default(90)
});

export type AppConfig = z.infer<typeof envSchema>;

export const config = envSchema.parse(process.env);
