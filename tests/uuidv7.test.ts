import { describe, expect, it } from "vitest";

import { monthRangeFromUuidV7, timestampFromUuidV7 } from "../src/uuidv7.js";
import { orderIdV7 } from "./fixtures.js";

describe("UUIDv7 partition helpers", () => {
  it("extracts the embedded timestamp", () => {
    expect(timestampFromUuidV7(orderIdV7).toISOString()).toBe(
      "2026-05-19T00:00:00.000Z"
    );
  });

  it("derives monthly partition bounds from the embedded timestamp", () => {
    expect(monthRangeFromUuidV7(orderIdV7)).toEqual({
      from: new Date("2026-05-01T00:00:00.000Z"),
      to: new Date("2026-06-01T00:00:00.000Z")
    });
  });

  it("rejects non-v7 UUIDs", () => {
    expect(() =>
      timestampFromUuidV7("11111111-1111-4111-8111-111111111111")
    ).toThrow("order_id must be UUIDv7");
  });
});
