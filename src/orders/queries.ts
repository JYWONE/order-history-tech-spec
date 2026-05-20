import { z } from "zod";

import type { Principal } from "../auth.js";
import { assertStoreInScope } from "../auth.js";
import type { AppConfig } from "../config.js";
import type { OrderCursor } from "../cursor.js";
import { decodeCursor } from "../cursor.js";
import { badRequest, forbidden, notImplemented } from "../errors.js";
import type { OrderStatus } from "../types.js";
import { orderStatuses } from "../types.js";
import type { TimeRange } from "../uuidv7.js";
import { monthRangeFromUuidV7 } from "../uuidv7.js";

const rawListQuerySchema = z
  .object({
    from: z.string().datetime().optional(),
    to: z.string().datetime().optional(),
    store_id: z.string().uuid().optional(),
    user_id: z.string().uuid().optional(),
    status: z.enum(orderStatuses).optional(),
    item_id: z.string().uuid().optional(),
    limit: z.coerce.number().int().min(1).max(100).default(50),
    cursor: z.string().optional()
  })
  .strict();

export interface NormalizedListOrdersQuery {
  principal: Principal;
  dateWindow: TimeRange;
  storeId?: string;
  userId?: string;
  status?: OrderStatus;
  limit: number;
  cursor?: OrderCursor;
}

export interface SqlQuery {
  text: string;
  values: unknown[];
}

export function normalizeListOrdersQuery(
  rawQuery: unknown,
  principal: Principal,
  appConfig: Pick<AppConfig, "QUERY_WINDOW_MAX_DAYS" | "LATEST_LOOKBACK_DAYS">,
  now = new Date()
): NormalizedListOrdersQuery {
  const result = rawListQuerySchema.safeParse(rawQuery);
  if (!result.success) {
    throw badRequest("Invalid query parameters", result.error.flatten());
  }

  const query = result.data;

  if (query.item_id) {
    throw notImplemented("item_id filtering is deferred for MVP");
  }

  const hasFrom = Boolean(query.from);
  const hasTo = Boolean(query.to);
  if (hasFrom !== hasTo) {
    throw badRequest("from and to must be provided together");
  }

  const dateWindow = hasFrom
    ? { from: new Date(query.from!), to: new Date(query.to!) }
    : latestWindow(now, appConfig.LATEST_LOOKBACK_DAYS);

  validateDateWindow(dateWindow, appConfig.QUERY_WINDOW_MAX_DAYS);

  if (principal.actor === "customer") {
    if (query.user_id) {
      throw badRequest("user_id is taken from auth for customer queries");
    }

    return {
      principal,
      dateWindow,
      userId: principal.userId,
      storeId: query.store_id,
      status: query.status,
      limit: query.limit,
      cursor: query.cursor ? decodeCursor(query.cursor) : undefined
    };
  }

  if (principal.actor === "store") {
    const storeId = query.store_id ?? inferOnlyStore(principal.storeIds);
    assertStoreInScope(principal, storeId);

    return {
      principal,
      dateWindow,
      userId: query.user_id,
      storeId,
      status: query.status,
      limit: query.limit,
      cursor: query.cursor ? decodeCursor(query.cursor) : undefined
    };
  }

  throw forbidden("support/admin reads are not enabled in the MVP API");
}

export function buildListOrdersQuery(input: NormalizedListOrdersQuery): SqlQuery {
  const values: unknown[] = [];
  const addParam = (value: unknown) => {
    values.push(value);
    return `$${values.length}`;
  };

  const conditions: string[] = [
    `created_at >= ${addParam(input.dateWindow.from)}`,
    `created_at < ${addParam(input.dateWindow.to)}`
  ];

  if (input.userId) {
    conditions.push(`user_id = ${addParam(input.userId)}`);
  }

  if (input.storeId) {
    conditions.push(`store_id = ${addParam(input.storeId)}`);
  }

  if (input.status) {
    conditions.push(`status = ${addParam(input.status)}::order_status`);
  }

  if (input.cursor) {
    conditions.push(
      `(created_at, order_id) < (${addParam(
        new Date(input.cursor.createdAt)
      )}, ${addParam(input.cursor.orderId)}::uuid)`
    );
  }

  const limitParam = addParam(input.limit + 1);

  return {
    text: `
      SELECT
        order_id,
        created_at,
        user_id,
        store_id,
        delivery_person_id,
        status,
        total_cents,
        currency
      FROM orders
      WHERE ${conditions.join("\n        AND ")}
      ORDER BY created_at DESC, order_id DESC
      LIMIT ${limitParam}
    `,
    values
  };
}

export function buildGetOrderQuery(
  principal: Principal,
  orderId: string,
  orderMonth: TimeRange = monthRangeFromUuidV7(orderId)
): SqlQuery {
  const values: unknown[] = [orderId, orderMonth.from, orderMonth.to];
  const conditions = [
    "order_id = $1::uuid",
    "created_at >= $2",
    "created_at < $3"
  ];

  if (principal.actor === "customer") {
    values.push(principal.userId);
    conditions.push(`user_id = $${values.length}`);
  } else if (principal.actor === "store") {
    values.push(principal.storeIds);
    conditions.push(`store_id = ANY($${values.length}::uuid[])`);
  } else {
    throw forbidden("support/admin reads are not enabled in the MVP API");
  }

  return {
    text: `
      SELECT
        order_id,
        created_at,
        user_id,
        store_id,
        delivery_person_id,
        status,
        total_cents,
        currency,
        ship_address_ref,
        payment_token_ref
      FROM orders
      WHERE ${conditions.join("\n        AND ")}
      LIMIT 1
    `,
    values
  };
}

export function buildGetOrderItemsQuery(
  orderId: string,
  orderMonth: TimeRange = monthRangeFromUuidV7(orderId)
): SqlQuery {
  return {
    text: `
      SELECT
        line_no,
        item_id,
        name_snapshot,
        quantity,
        price_cents,
        currency
      FROM order_items
      WHERE order_id = $1::uuid
        AND created_at >= $2
        AND created_at < $3
      ORDER BY line_no ASC
    `,
    values: [orderId, orderMonth.from, orderMonth.to]
  };
}

function inferOnlyStore(storeIds: string[]): string {
  if (storeIds.length !== 1) {
    throw badRequest("store_id is required when the principal has multiple stores");
  }

  return storeIds[0]!;
}

function latestWindow(now: Date, lookbackDays: number): TimeRange {
  return {
    from: new Date(now.getTime() - lookbackDays * 24 * 60 * 60 * 1000),
    to: now
  };
}

function validateDateWindow(window: TimeRange, maxDays: number) {
  if (window.from >= window.to) {
    throw badRequest("from must be before to");
  }

  const windowMs = window.to.getTime() - window.from.getTime();
  const maxMs = maxDays * 24 * 60 * 60 * 1000;
  if (windowMs > maxMs) {
    throw badRequest(`date window cannot exceed ${maxDays} days`);
  }
}
