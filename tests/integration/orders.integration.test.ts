import { randomUUID } from "node:crypto";

import { afterAll, beforeAll, describe, expect, it } from "vitest";

import type { Principal } from "../../src/auth.js";
import { createPool } from "../../src/db.js";
import { insertOrder, type NewOrder } from "../../src/orders/ingest.js";
import { normalizeListOrdersQuery } from "../../src/orders/queries.js";
import { getOrderById, listOrders } from "../../src/orders/repository.js";
import type { OrderStatus } from "../../src/types.js";
import { testConfig } from "../fixtures.js";

// these tests hit a real Postgres; bring it up with `docker compose up -d` and `npm run migrate` first
const pool = createPool();

const CUSTOMER_A = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const CUSTOMER_B = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const STORE_1 = "11111111-1111-4111-8111-111111111111";
const STORE_2 = "22222222-2222-4222-8222-222222222222";

const customerA: Principal = { actor: "customer", userId: CUSTOMER_A };
const customerB: Principal = { actor: "customer", userId: CUSTOMER_B };
const store1: Principal = { actor: "store", storeIds: [STORE_1] };

const mayWindow = { from: "2026-05-01T00:00:00.000Z", to: "2026-06-01T00:00:00.000Z" };
const springWindow = { from: "2026-04-01T00:00:00.000Z", to: "2026-06-01T00:00:00.000Z" };

let aprilOrderId: string;
let store2OrderId: string;

function mkOrder(iso: string, userId: string, storeId: string, status: OrderStatus): NewOrder {
  return {
    createdAt: new Date(iso),
    userId,
    storeId,
    status,
    totalCents: 1450,
    currency: "USD",
    items: [{ itemId: randomUUID(), nameSnapshot: "Pad Thai", quantity: 1, priceCents: 1450 }]
  };
}

beforeAll(async () => {
  await pool.query("TRUNCATE orders, order_items, order_events");

  // customer A at store 1, four orders in May 2026
  await insertOrder(pool, mkOrder("2026-05-15T18:30:00Z", CUSTOMER_A, STORE_1, "delivered"));
  await insertOrder(pool, mkOrder("2026-05-12T12:05:00Z", CUSTOMER_A, STORE_1, "delivered"));
  await insertOrder(pool, mkOrder("2026-05-08T20:10:00Z", CUSTOMER_A, STORE_1, "refunded"));
  await insertOrder(pool, mkOrder("2026-05-03T11:45:00Z", CUSTOMER_A, STORE_1, "delivered"));
  // April order in a different partition
  aprilOrderId = await insertOrder(pool, mkOrder("2026-04-22T19:00:00Z", CUSTOMER_A, STORE_1, "delivered"));
  // customer A at store 2, plus customer B at store 1 (noise)
  store2OrderId = await insertOrder(pool, mkOrder("2026-05-10T13:20:00Z", CUSTOMER_A, STORE_2, "delivered"));
  await insertOrder(pool, mkOrder("2026-05-14T09:15:00Z", CUSTOMER_B, STORE_1, "delivered"));
}, 30000);

afterAll(async () => {
  await pool.query("TRUNCATE orders, order_items, order_events");
  await pool.end();
});

describe("order history lookup against real Postgres", () => {
  it("returns a customer's own orders within the window, newest first", async () => {
    const query = normalizeListOrdersQuery(mayWindow, customerA, testConfig);
    const result = await listOrders(pool, query);

    // four store-1 orders + one store-2 order in May
    expect(result.data).toHaveLength(5);
    expect(result.data.every((order) => order.userId === CUSTOMER_A)).toBe(true);

    const timestamps = result.data.map((order) => order.createdAt);
    const sortedDesc = [...timestamps].sort().reverse();
    expect(timestamps).toEqual(sortedDesc);
  });

  it("excludes orders outside the requested time window", async () => {
    const query = normalizeListOrdersQuery(mayWindow, customerA, testConfig);
    const result = await listOrders(pool, query);

    expect(result.data.some((order) => order.orderId === aprilOrderId)).toBe(false);
  });

  it("paginates with a keyset cursor and no overlap between pages", async () => {
    const firstPage = await listOrders(
      pool,
      normalizeListOrdersQuery({ ...mayWindow, limit: "2" }, customerA, testConfig)
    );
    expect(firstPage.data).toHaveLength(2);
    expect(firstPage.page.nextCursor).not.toBeNull();

    const secondPage = await listOrders(
      pool,
      normalizeListOrdersQuery(
        { ...mayWindow, limit: "2", cursor: firstPage.page.nextCursor! },
        customerA,
        testConfig
      )
    );
    expect(secondPage.data).toHaveLength(2);

    const firstIds = new Set(firstPage.data.map((order) => order.orderId));
    expect(secondPage.data.some((order) => firstIds.has(order.orderId))).toBe(false);

    const lastOfFirst = firstPage.data.at(-1)!.createdAt;
    expect(secondPage.data[0]!.createdAt <= lastOfFirst).toBe(true);
  });

  it("scopes a store to its own orders across customers", async () => {
    const query = normalizeListOrdersQuery(springWindow, store1, testConfig);
    const result = await listOrders(pool, query);

    // five store-1 orders for customer A (incl. April) + one for customer B
    expect(result.data).toHaveLength(6);
    expect(result.data.every((order) => order.storeId === STORE_1)).toBe(true);
  });

  it("fetches an order by id by routing through the partition encoded in the UUIDv7", async () => {
    const order = await getOrderById(pool, customerA, aprilOrderId);

    expect(order).not.toBeNull();
    expect(order!.orderId).toBe(aprilOrderId);
    expect(order!.createdAt.startsWith("2026-04")).toBe(true);
    expect(order!.items).toHaveLength(1);
  });

  it("hides another customer's order (IDOR protection)", async () => {
    const order = await getOrderById(pool, customerB, aprilOrderId);
    expect(order).toBeNull();
  });

  it("hides an order outside the store's scope", async () => {
    const order = await getOrderById(pool, store1, store2OrderId);
    expect(order).toBeNull();
  });
});
