import { z } from "zod";

import { badRequest } from "./errors.js";

const cursorSchema = z
  .object({
    createdAt: z.string().datetime(),
    orderId: z.string().uuid()
  })
  .strict();

export type OrderCursor = z.infer<typeof cursorSchema>;

export function encodeCursor(cursor: OrderCursor): string {
  return Buffer.from(JSON.stringify(cursor), "utf8").toString("base64url");
}

export function decodeCursor(value: string): OrderCursor {
  try {
    const decoded = Buffer.from(value, "base64url").toString("utf8");
    const parsed = cursorSchema.safeParse(JSON.parse(decoded));
    if (!parsed.success) {
      throw parsed.error;
    }

    return parsed.data;
  } catch {
    throw badRequest("cursor is invalid");
  }
}
