import type { Queryable } from "../db.js";
import { encodeCursor } from "../cursor.js";
import type { OrderStatus } from "../types.js";
import type { TimeRange } from "../uuidv7.js";
import { monthRangeFromUuidV7 } from "../uuidv7.js";
import {
  buildGetOrderItemsQuery,
  buildGetOrderQuery,
  buildListOrdersQuery,
  type NormalizedListOrdersQuery
} from "./queries.js";

interface OrderRow {
  order_id: string;
  created_at: Date;
  user_id: string;
  store_id: string;
  delivery_person_id: string | null;
  status: OrderStatus;
  total_cents: string | number;
  currency: string;
  ship_address_ref?: string | null;
  payment_token_ref?: string | null;
}

interface OrderItemRow {
  line_no: number;
  item_id: string;
  name_snapshot: string;
  quantity: number;
  price_cents: string | number;
  currency: string;
}

export interface OrderSummary {
  orderId: string;
  createdAt: string;
  userId: string;
  storeId: string;
  deliveryPersonId: string | null;
  status: OrderStatus;
  totalCents: number;
  currency: string;
}

export interface OrderDetail extends OrderSummary {
  shipAddressRef: string | null;
  paymentTokenRef: string | null;
  items: OrderItem[];
}

export interface OrderItem {
  lineNo: number;
  itemId: string;
  nameSnapshot: string;
  quantity: number;
  priceCents: number;
  currency: string;
}

export async function listOrders(db: Queryable, input: NormalizedListOrdersQuery) {
  const query = buildListOrdersQuery(input);
  const startedAt = performance.now();
  const result = await db.query<OrderRow>(query.text, query.values);
  const lookupMs = Math.round((performance.now() - startedAt) * 100) / 100;

  const rows = result.rows;
  const visibleRows = rows.slice(0, input.limit);
  const hasMore = rows.length > input.limit;
  const lastRow = visibleRows.at(-1);

  return {
    data: visibleRows.map(toOrderSummary),
    page: {
      limit: input.limit,
      nextCursor:
        hasMore && lastRow
          ? encodeCursor({
              createdAt: lastRow.created_at.toISOString(),
              orderId: lastRow.order_id
            })
          : null
    },
    meta: {
      lookupMs,
      partitionWindow: partitionWindow(input)
    }
  };
}

// demo affordance: run the caller's own scoped query under EXPLAIN to show partition pruning + index use
export async function explainListOrders(db: Queryable, input: NormalizedListOrdersQuery) {
  const query = buildListOrdersQuery(input);
  const result = await db.query<{ "QUERY PLAN": unknown }>(
    `EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) ${query.text}`,
    query.values
  );

  return {
    explain: result.rows[0]?.["QUERY PLAN"] ?? null,
    partitionWindow: partitionWindow(input)
  };
}

function partitionWindow(input: NormalizedListOrdersQuery) {
  return {
    from: input.dateWindow.from.toISOString(),
    to: input.dateWindow.to.toISOString(),
    monthsSpanned: monthsSpanned(input.dateWindow.from, input.dateWindow.to)
  };
}

// how many monthly partitions the [from, to) window touches
function monthsSpanned(from: Date, to: Date): number {
  const lastInclusive = new Date(to.getTime() - 1);
  return (
    (lastInclusive.getUTCFullYear() - from.getUTCFullYear()) * 12 +
    (lastInclusive.getUTCMonth() - from.getUTCMonth()) +
    1
  );
}

export async function getOrderById(
  db: Queryable,
  principal: NormalizedListOrdersQuery["principal"],
  orderId: string,
  orderMonth: TimeRange = monthRangeFromUuidV7(orderId)
): Promise<OrderDetail | null> {
  const orderQuery = buildGetOrderQuery(principal, orderId, orderMonth);
  const orderResult = await db.query<OrderRow>(orderQuery.text, orderQuery.values);
  const order = orderResult.rows[0];

  if (!order) {
    return null;
  }

  const items = await getOrderItems(db, orderId, orderMonth);

  return {
    ...toOrderSummary(order),
    shipAddressRef: order.ship_address_ref ?? null,
    paymentTokenRef: order.payment_token_ref ?? null,
    items
  };
}

async function getOrderItems(
  db: Queryable,
  orderId: string,
  orderMonth: TimeRange
): Promise<OrderItem[]> {
  const query = buildGetOrderItemsQuery(orderId, orderMonth);
  const result = await db.query<OrderItemRow>(query.text, query.values);
  return result.rows.map((row) => ({
    lineNo: row.line_no,
    itemId: row.item_id,
    nameSnapshot: row.name_snapshot,
    quantity: row.quantity,
    priceCents: Number(row.price_cents),
    currency: row.currency
  }));
}

function toOrderSummary(row: OrderRow): OrderSummary {
  return {
    orderId: row.order_id,
    createdAt: row.created_at.toISOString(),
    userId: row.user_id,
    storeId: row.store_id,
    deliveryPersonId: row.delivery_person_id,
    status: row.status,
    totalCents: Number(row.total_cents),
    currency: row.currency
  };
}
