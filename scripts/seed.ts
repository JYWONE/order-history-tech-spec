import "dotenv/config";

import { randomUUID } from "node:crypto";
import pg from "pg";

import type { OrderStatus } from "../src/types.js";
import { insertOrder, type NewOrder } from "../src/orders/ingest.js";

const { Client } = pg;

const databaseUrl =
  process.env.DATABASE_URL ??
  "postgres://order_history:order_history@localhost:5432/order_history";

// fixed actor ids so the seeded data is easy to eyeball
const CUSTOMER_A = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const CUSTOMER_B = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const STORE_1 = "11111111-1111-4111-8111-111111111111";
const STORE_2 = "22222222-2222-4222-8222-222222222222";

type Line = [name: string, quantity: number, priceCents: number];

function buildOrder(
  iso: string,
  userId: string,
  storeId: string,
  status: OrderStatus,
  lines: Line[]
): NewOrder {
  const items = lines.map(([nameSnapshot, quantity, priceCents]) => ({
    itemId: randomUUID(),
    nameSnapshot,
    quantity,
    priceCents
  }));
  const totalCents = items.reduce((sum, item) => sum + item.quantity * item.priceCents, 0);

  return { createdAt: new Date(iso), userId, storeId, status, totalCents, currency: "USD", items };
}

function sampleOrders(): NewOrder[] {
  return [
    buildOrder("2026-05-15T18:30:00Z", CUSTOMER_A, STORE_1, "delivered", [["Pad Thai", 1, 1450]]),
    buildOrder("2026-05-12T12:05:00Z", CUSTOMER_A, STORE_1, "delivered", [["Green Curry", 2, 1600]]),
    buildOrder("2026-05-08T20:10:00Z", CUSTOMER_A, STORE_1, "refunded", [["Spring Roll", 3, 600]]),
    buildOrder("2026-05-03T11:45:00Z", CUSTOMER_A, STORE_1, "delivered", [["Tom Yum", 1, 1300]]),
    // April lands in a different partition, exercising order_id partition routing
    buildOrder("2026-04-22T19:00:00Z", CUSTOMER_A, STORE_1, "delivered", [["Mango Sticky Rice", 1, 900]]),
    buildOrder("2026-05-10T13:20:00Z", CUSTOMER_A, STORE_2, "delivered", [["Latte", 2, 550]]),
    buildOrder("2026-05-14T09:15:00Z", CUSTOMER_B, STORE_1, "out_for_delivery", [["Americano", 1, 450]])
  ];
}

async function main() {
  const client = new Client({ connectionString: databaseUrl });
  await client.connect();

  try {
    await client.query("TRUNCATE orders, order_items, order_events");
    for (const order of sampleOrders()) {
      const orderId = await insertOrder(client, order);
      console.log(`seeded ${order.userId} ${order.createdAt.toISOString()} -> ${orderId}`);
    }
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
