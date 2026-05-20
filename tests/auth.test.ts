import { describe, expect, it } from "vitest";

import { parsePrincipalFromHeaders } from "../src/auth.js";
import { customerId, otherStoreId, storeId } from "./fixtures.js";

describe("development auth header parsing", () => {
  it("parses customer auth scope", () => {
    expect(
      parsePrincipalFromHeaders({
        "x-actor-type": "customer",
        "x-user-id": customerId
      })
    ).toEqual({
      actor: "customer",
      userId: customerId
    });
  });

  it("parses store auth scope", () => {
    expect(
      parsePrincipalFromHeaders({
        "x-actor-type": "store",
        "x-store-ids": `${storeId},${otherStoreId}`
      })
    ).toEqual({
      actor: "store",
      storeIds: [storeId, otherStoreId]
    });
  });

  it("requires an actor type", () => {
    expect(() => parsePrincipalFromHeaders({})).toThrow(
      "x-actor-type must be customer, store, or support"
    );
  });
});
