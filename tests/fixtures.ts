import type { AppConfig } from "../src/config.js";

export const customerId = "11111111-1111-4111-8111-111111111111";
export const storeId = "22222222-2222-4222-8222-222222222222";
export const otherStoreId = "33333333-3333-4333-8333-333333333333";
export const orderIdV7 = "019e3d88-4000-7000-8000-000000000001";

export const testConfig: AppConfig = {
  NODE_ENV: "test",
  PORT: 3000,
  DATABASE_URL: "postgres://order_history:order_history@localhost:5432/order_history",
  PGPOOL_MAX: 10,
  QUERY_WINDOW_MAX_DAYS: 93,
  LATEST_LOOKBACK_DAYS: 90
};
