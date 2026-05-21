import type { FastifyInstance } from "fastify";
import { z } from "zod";

import type { Principal } from "../auth.js";
import { requirePrincipal } from "../auth.js";
import type { AppConfig } from "../config.js";
import type { Queryable } from "../db.js";
import { badRequest, notFound } from "../errors.js";
import { monthRangeFromUuidV7 } from "../uuidv7.js";
import { explainListOrders, getOrderById, listOrders } from "./repository.js";
import { normalizeListOrdersQuery } from "./queries.js";

const orderIdParamsSchema = z
  .object({
    orderId: z.string().uuid()
  })
  .strict();

export interface OrderRouteDeps {
  config: AppConfig;
  db: Queryable;
}

export async function registerOrderRoutes(
  app: FastifyInstance,
  deps: OrderRouteDeps
) {
  await app.register(async (secured) => {
    secured.addHook("preHandler", requirePrincipal);

    secured.get("/v1/orders", async (request, reply) => {
      const startedAt = performance.now();
      const { _explain, ...rawQuery } = (request.query ?? {}) as Record<string, unknown>;
      const query = normalizeListOrdersQuery(rawQuery, request.principal, deps.config);

      if (_explain === "true") {
        return explainListOrders(deps.db, query);
      }

      const result = await listOrders(deps.db, query);
      const appMs = Math.round((performance.now() - startedAt) * 100) / 100;
      return reply
        .header("Server-Timing", `db;dur=${result.meta.lookupMs}, app;dur=${appMs}`)
        .send(result);
    });

    secured.get("/v1/orders/:orderId", async (request, reply) => {
      const startedAt = performance.now();
      const parsedParams = orderIdParamsSchema.safeParse(request.params);
      if (!parsedParams.success) {
        throw badRequest("Invalid order_id", parsedParams.error.flatten());
      }

      const orderMonth = monthRangeFromUuidV7(parsedParams.data.orderId);
      const lookupStartedAt = performance.now();
      const order = await getOrderById(
        deps.db,
        request.principal as Principal,
        parsedParams.data.orderId,
        orderMonth
      );
      const lookupMs = Math.round((performance.now() - lookupStartedAt) * 100) / 100;

      if (!order) {
        throw notFound("Order not found");
      }

      const appMs = Math.round((performance.now() - startedAt) * 100) / 100;
      return reply
        .header("Server-Timing", `db;dur=${lookupMs}, app;dur=${appMs}`)
        .send({
          data: order,
          meta: {
            lookupMs,
            partitionWindow: {
              from: orderMonth.from.toISOString(),
              to: orderMonth.to.toISOString(),
              monthsSpanned: 1
            }
          }
        });
    });
  });
}
