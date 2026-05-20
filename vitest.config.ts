import { configDefaults, defineConfig } from "vitest/config";

// default suite is unit-only; integration tests need a live DB and run via `npm run test:integration`
export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    exclude: [...configDefaults.exclude, "**/dist/**", "tests/integration/**"]
  }
});
