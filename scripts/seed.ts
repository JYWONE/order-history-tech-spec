import "dotenv/config";

import { randomUUID } from "node:crypto";
import pg from "pg";

import type { OrderStatus } from "../src/types.js";
import { insertOrder, type NewOrder } from "../src/orders/ingest.js";

const { Client } = pg;

const databaseUrl =
  process.env.DATABASE_URL ??
  "postgres://order_history:order_history@localhost:5432/order_history";

const ORDER_COUNT = Number(process.env.SEED_ORDERS ?? 800);

// Canonical demo entities. These IDs MUST match the labels used in src/demo.ts.
//   Ava Chen   -> customer aaaa...   Mia Park -> customer cccc...
//   Nori Thai – Midtown -> store 1111...   Bean & Batch -> store 2222...
const AVA_CHEN = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const MIA_PARK = "cccccccc-cccc-4ccc-8ccc-cccccccccccc";
const NORI_THAI = "11111111-1111-4111-8111-111111111111";
const BEAN_BATCH = "22222222-2222-4222-8222-222222222222";
const COURIER = "77777777-7777-4777-8777-777777777777";

const MENU: Array<[name: string, priceCents: number]> = [
  ["Pad Thai", 1450],
  ["Green Curry", 1600],
  ["Tom Yum", 1300],
  ["Spring Roll", 600],
  ["Mango Sticky Rice", 900],
  ["Latte", 550],
  ["Americano", 450],
  ["Cold Brew", 525],
  ["Drip Coffee", 350]
];

// weighted toward delivered so refunds/active stay realistic
const STATUSES: OrderStatus[] = [
  "delivered",
  "delivered",
  "delivered",
  "delivered",
  "refunded",
  "cancelled",
  "out_for_delivery"
];

// spread across two existing partitions (Apr + May 2026), ending before "now"
const WINDOW_START = Date.UTC(2026, 3, 1);
const WINDOW_END = Date.UTC(2026, 4, 19);

const pick = <T>(values: T[]): T => values[Math.floor(Math.random() * values.length)]!;
const randomTimestamp = () => new Date(WINDOW_START + Math.random() * (WINDOW_END - WINDOW_START));

function buildOrder(userId: string, storeId: string): NewOrder {
  const lineCount = 1 + Math.floor(Math.random() * 2);
  const items = Array.from({ length: lineCount }, () => {
    const [nameSnapshot, priceCents] = pick(MENU);
    return { itemId: randomUUID(), nameSnapshot, quantity: 1 + Math.floor(Math.random() * 3), priceCents };
  });
  const totalCents = items.reduce((sum, item) => sum + item.quantity * item.priceCents, 0);
  const status = pick(STATUSES);

  return {
    createdAt: randomTimestamp(),
    userId,
    storeId,
    deliveryPersonId: status === "out_for_delivery" ? COURIER : null,
    status,
    totalCents,
    currency: "USD",
    items
  };
}

// give the named entities long, paginatable, multi-partition histories
function plannedOrders(count: number): NewOrder[] {
  return Array.from({ length: count }, () => {
    const r = Math.random();
    if (r < 0.45) return buildOrder(AVA_CHEN, NORI_THAI);
    if (r < 0.6) return buildOrder(AVA_CHEN, BEAN_BATCH);
    if (r < 0.85) return buildOrder(MIA_PARK, NORI_THAI);
    return buildOrder(MIA_PARK, BEAN_BATCH);
  });
}

async function main() {
  const client = new Client({ connectionString: databaseUrl });
  await client.connect();

  try {
    await client.query("TRUNCATE orders, order_items, order_events");
    await client.query("BEGIN");
    const orders = plannedOrders(ORDER_COUNT);
    for (const order of orders) {
      await insertOrder(client, order);
    }
    await client.query("COMMIT");
    console.log(`seeded ${orders.length} orders (Ava Chen + Mia Park x Nori Thai + Bean & Batch, Apr–May 2026)`);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
