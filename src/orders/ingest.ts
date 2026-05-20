import type { Queryable } from "../db.js";
import type { OrderStatus } from "../types.js";
import { uuidV7 } from "../uuidv7.js";

export interface NewOrderItem {
  itemId: string;
  nameSnapshot: string;
  quantity: number;
  priceCents: number;
}

export interface NewOrder {
  createdAt: Date;
  userId: string;
  storeId: string;
  deliveryPersonId?: string | null;
  status: OrderStatus;
  totalCents: number;
  currency: string;
  items: NewOrderItem[];
}

// minimal write path for seeding and integration tests; order_id encodes createdAt so it lands in the matching partition
export async function insertOrder(db: Queryable, order: NewOrder): Promise<string> {
  const orderId = uuidV7(order.createdAt.getTime());
  const deliveryPersonId = order.deliveryPersonId ?? null;

  await db.query(
    `INSERT INTO orders
       (order_id, created_at, user_id, store_id, delivery_person_id, status, total_cents, currency)
     VALUES ($1, $2, $3, $4, $5, $6::order_status, $7, $8)`,
    [
      orderId,
      order.createdAt,
      order.userId,
      order.storeId,
      deliveryPersonId,
      order.status,
      order.totalCents,
      order.currency
    ]
  );

  for (const [index, item] of order.items.entries()) {
    await db.query(
      `INSERT INTO order_items
         (order_id, created_at, line_no, user_id, store_id, item_id, name_snapshot, quantity, price_cents, currency)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        orderId,
        order.createdAt,
        index + 1,
        order.userId,
        order.storeId,
        item.itemId,
        item.nameSnapshot,
        item.quantity,
        item.priceCents,
        order.currency
      ]
    );
  }

  await db.query(
    `INSERT INTO order_events (order_id, created_at, seq, event_type, actor_id, payload)
     VALUES ($1, $2, 1, $3, $4, $5::jsonb)`,
    [orderId, order.createdAt, "placed", order.userId, JSON.stringify({ status: order.status })]
  );

  return orderId;
}
