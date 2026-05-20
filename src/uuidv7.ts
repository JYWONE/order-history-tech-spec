import { randomBytes } from "node:crypto";

import { badRequest } from "./errors.js";

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export interface TimeRange {
  from: Date;
  to: Date;
}

export function timestampFromUuidV7(orderId: string): Date {
  if (!uuidPattern.test(orderId)) {
    throw badRequest("order_id must be a UUID");
  }

  const hex = orderId.replaceAll("-", "").toLowerCase();
  if (hex[12] !== "7") {
    throw badRequest("order_id must be UUIDv7");
  }

  const timestampMs = Number.parseInt(hex.slice(0, 12), 16);
  return new Date(timestampMs);
}

export function monthRangeFromUuidV7(orderId: string): TimeRange {
  const timestamp = timestampFromUuidV7(orderId);
  const from = new Date(
    Date.UTC(timestamp.getUTCFullYear(), timestamp.getUTCMonth(), 1)
  );
  const to = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth() + 1, 1));

  return { from, to };
}

// generate a UUIDv7 whose first 48 bits encode timestampMs, so the id alone routes to its month partition
export function uuidV7(timestampMs: number = Date.now()): string {
  const bytes = randomBytes(16);
  const ts = BigInt(Math.trunc(timestampMs));

  bytes[0] = Number((ts >> 40n) & 0xffn);
  bytes[1] = Number((ts >> 32n) & 0xffn);
  bytes[2] = Number((ts >> 24n) & 0xffn);
  bytes[3] = Number((ts >> 16n) & 0xffn);
  bytes[4] = Number((ts >> 8n) & 0xffn);
  bytes[5] = Number(ts & 0xffn);
  bytes[6] = (bytes[6] & 0x0f) | 0x70; // version 7
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant 10

  const hex = bytes.toString("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
