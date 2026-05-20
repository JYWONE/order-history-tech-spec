import type { FastifyRequest } from "fastify";
import { z } from "zod";

import { badRequest, forbidden, unauthorized } from "./errors.js";

const uuidSchema = z.string().uuid();

export type Principal =
  | {
      actor: "customer";
      userId: string;
    }
  | {
      actor: "store";
      storeIds: string[];
    }
  | {
      actor: "support";
      actorId: string;
    };

declare module "fastify" {
  interface FastifyRequest {
    principal: Principal;
  }
}

function firstHeader(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function csv(value: string | undefined): string[] {
  return (
    value
      ?.split(",")
      .map((part) => part.trim())
      .filter(Boolean) ?? []
  );
}

function parseUuid(value: string | undefined, field: string): string {
  const parsed = uuidSchema.safeParse(value);
  if (!parsed.success) {
    throw badRequest(`${field} must be a UUID`);
  }

  return parsed.data;
}

function parseUuidList(value: string | undefined, field: string): string[] {
  const values = csv(value);
  if (!values.length) {
    throw unauthorized(`${field} is required`);
  }

  return values.map((entry) => parseUuid(entry, field));
}

export function parsePrincipalFromHeaders(
  headers: FastifyRequest["headers"]
): Principal {
  const actor = firstHeader(headers["x-actor-type"]);

  if (actor === "customer") {
    return {
      actor,
      userId: parseUuid(firstHeader(headers["x-user-id"]), "x-user-id")
    };
  }

  if (actor === "store") {
    return {
      actor,
      storeIds: parseUuidList(
        firstHeader(headers["x-store-ids"]) ?? firstHeader(headers["x-store-id"]),
        "x-store-ids"
      )
    };
  }

  if (actor === "support") {
    return {
      actor,
      actorId: parseUuid(firstHeader(headers["x-actor-id"]), "x-actor-id")
    };
  }

  throw unauthorized("x-actor-type must be customer, store, or support");
}

export async function requirePrincipal(request: FastifyRequest) {
  request.principal = parsePrincipalFromHeaders(request.headers);
}

export function assertStoreInScope(principal: Principal, storeId: string) {
  if (principal.actor !== "store") {
    throw forbidden("Store scope is required");
  }

  if (!principal.storeIds.includes(storeId)) {
    throw forbidden("store_id is outside the authenticated store scope");
  }
}
