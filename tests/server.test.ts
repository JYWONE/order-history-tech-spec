import { describe, expect, it, vi } from "vitest";

import type { Queryable } from "../src/db.js";
import { buildServer } from "../src/server.js";
import { customerId, testConfig } from "./fixtures.js";

describe("server routes", () => {
  it("serves the demo console at the root route", async () => {
    const app = await buildServer({
      appConfig: testConfig,
      db: fakeDb()
    });

    const response = await app.inject({ method: "GET", url: "/" });
    expect(response.statusCode).toBe(200);
    expect(response.headers["content-type"]).toContain("text/html");
    expect(response.body).toContain("Order History Console");
    expect(response.body).toContain("Run checks");
    expect(response.body).toContain("/v1/orders");

    await app.close();
  });

  it("serves health without auth", async () => {
    const app = await buildServer({
      appConfig: testConfig,
      db: fakeDb()
    });

    const response = await app.inject({ method: "GET", url: "/health" });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ ok: true });

    await app.close();
  });

  it("requires auth for order history", async () => {
    const app = await buildServer({
      appConfig: testConfig,
      db: fakeDb()
    });

    const response = await app.inject({ method: "GET", url: "/v1/orders" });
    expect(response.statusCode).toBe(401);

    await app.close();
  });

  it("returns an empty scoped order page", async () => {
    const db = fakeDb();
    const app = await buildServer({
      appConfig: testConfig,
      db
    });

    const response = await app.inject({
      method: "GET",
      url: "/v1/orders",
      headers: {
        "x-actor-type": "customer",
        "x-user-id": customerId
      }
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.data).toEqual([]);
    expect(body.page).toEqual({ limit: 50, nextCursor: null });
    expect(typeof body.meta.lookupMs).toBe("number");
    expect(body.meta.partitionWindow.monthsSpanned).toBeGreaterThanOrEqual(1);
    expect(db.query).toHaveBeenCalledOnce();

    await app.close();
  });
});

function fakeDb(): Queryable {
  return {
    query: vi.fn(async () => ({
      rows: [],
      rowCount: 0
    }))
  };
}
