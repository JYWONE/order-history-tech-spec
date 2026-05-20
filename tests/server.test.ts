import { describe, expect, it, vi } from "vitest";

import type { Queryable } from "../src/db.js";
import { buildServer } from "../src/server.js";
import { customerId, testConfig } from "./fixtures.js";

describe("server routes", () => {
  it("serves a root service descriptor", async () => {
    const app = await buildServer({
      appConfig: testConfig,
      db: fakeDb()
    });

    const response = await app.inject({ method: "GET", url: "/" });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      service: "order-history-tech-spec",
      status: "ok",
      endpoints: {
        health: "/health",
        orderHistory: "/v1/orders"
      }
    });

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
    expect(response.json()).toEqual({
      data: [],
      page: {
        limit: 50,
        nextCursor: null
      }
    });
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
