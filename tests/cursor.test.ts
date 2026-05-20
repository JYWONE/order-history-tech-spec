import { describe, expect, it } from "vitest";

import { decodeCursor, encodeCursor } from "../src/cursor.js";
import { orderIdV7 } from "./fixtures.js";

describe("order cursor encoding", () => {
  it("round-trips a keyset cursor", () => {
    const cursor = {
      createdAt: "2026-05-19T00:00:00.000Z",
      orderId: orderIdV7
    };

    expect(decodeCursor(encodeCursor(cursor))).toEqual(cursor);
  });

  it("rejects invalid cursors", () => {
    expect(() => decodeCursor("not-a-cursor")).toThrow("cursor is invalid");
  });
});
