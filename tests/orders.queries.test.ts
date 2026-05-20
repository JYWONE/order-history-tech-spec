import { describe, expect, it } from "vitest";

import type { Principal } from "../src/auth.js";
import { encodeCursor } from "../src/cursor.js";
import {
  buildListOrdersQuery,
  normalizeListOrdersQuery
} from "../src/orders/queries.js";
import {
  customerId,
  orderIdV7,
  otherStoreId,
  storeId,
  testConfig
} from "./fixtures.js";

const customerPrincipal: Principal = {
  actor: "customer",
  userId: customerId
};

const storePrincipal: Principal = {
  actor: "store",
  storeIds: [storeId, otherStoreId]
};

describe("order history query normalization", () => {
  it("uses auth user_id for customer history and applies the default latest window", () => {
    const now = new Date("2026-05-20T12:00:00.000Z");
    const query = normalizeListOrdersQuery({}, customerPrincipal, testConfig, now);

    expect(query.userId).toBe(customerId);
    expect(query.dateWindow.to).toEqual(now);
    expect(query.dateWindow.from).toEqual(new Date("2026-02-19T12:00:00.000Z"));
    expect(query.limit).toBe(50);
  });

  it("rejects user_id on customer queries", () => {
    expect(() =>
      normalizeListOrdersQuery(
        { user_id: customerId },
        customerPrincipal,
        testConfig
      )
    ).toThrow("user_id is taken from auth for customer queries");
  });

  it("requires store_id when a store principal has multiple stores", () => {
    expect(() =>
      normalizeListOrdersQuery({}, storePrincipal, testConfig)
    ).toThrow("store_id is required when the principal has multiple stores");
  });

  it("rejects stores outside the principal scope", () => {
    expect(() =>
      normalizeListOrdersQuery(
        { store_id: "44444444-4444-4444-8444-444444444444" },
        storePrincipal,
        testConfig
      )
    ).toThrow("store_id is outside the authenticated store scope");
  });

  it("rejects deferred item search", () => {
    expect(() =>
      normalizeListOrdersQuery(
        { item_id: "55555555-5555-4555-8555-555555555555" },
        customerPrincipal,
        testConfig
      )
    ).toThrow("item_id filtering is deferred for MVP");
  });
});

describe("order history SQL builder", () => {
  it("builds a scoped keyset query with no OFFSET", () => {
    const cursor = encodeCursor({
      createdAt: "2026-05-19T00:00:00.000Z",
      orderId: orderIdV7
    });
    const normalized = normalizeListOrdersQuery(
      {
        from: "2026-05-01T00:00:00.000Z",
        to: "2026-06-01T00:00:00.000Z",
        store_id: storeId,
        status: "delivered",
        cursor,
        limit: "25"
      },
      customerPrincipal,
      testConfig
    );

    const sql = buildListOrdersQuery(normalized);

    expect(sql.text).toContain("user_id =");
    expect(sql.text).toContain("store_id =");
    expect(sql.text).toContain("(created_at, order_id) <");
    expect(sql.text).toContain("ORDER BY created_at DESC, order_id DESC");
    expect(sql.text).not.toContain("OFFSET");
    expect(sql.values).toContain(customerId);
    expect(sql.values).toContain(storeId);
    expect(sql.values.at(-1)).toBe(26);
  });
});
