import type { FastifyInstance } from "fastify";
import { z } from "zod";

import type { Principal } from "../auth.js";
import { requirePrincipal } from "../auth.js";
import type { AppConfig } from "../config.js";
import type { Queryable } from "../db.js";
import { badRequest, notFound } from "../errors.js";
import { getOrderById, listOrders } from "./repository.js";
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

    secured.get("/v1/orders", async (request) => {
      const query = normalizeListOrdersQuery(
        request.query,
        request.principal,
        deps.config
      );

      return listOrders(deps.db, query);
    });

    secured.get("/v1/orders/:orderId", async (request) => {
      const parsedParams = orderIdParamsSchema.safeParse(request.params);
      if (!parsedParams.success) {
        throw badRequest("Invalid order_id", parsedParams.error.flatten());
      }

      const order = await getOrderById(
        deps.db,
        request.principal as Principal,
        parsedParams.data.orderId
      );

      if (!order) {
        throw notFound("Order not found");
      }

      return { data: order };
    });
  });
}
