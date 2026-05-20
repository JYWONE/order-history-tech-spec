import { defineConfig } from "vitest/config";

// integration suite: runs against a live Postgres, serially, with room for DB setup
export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["tests/integration/**/*.test.ts"],
    fileParallelism: false,
    testTimeout: 20000,
    hookTimeout: 30000
  }
});
