import Fastify from "fastify";
import type pg from "pg";

import type { AppConfig } from "./config.js";
import { config } from "./config.js";
import { createPool, type Queryable } from "./db.js";
import { demoPageHtml } from "./demo.js";
import { HttpError } from "./errors.js";
import { registerOrderRoutes } from "./orders/routes.js";

interface ServerOptions {
  appConfig?: AppConfig;
  db?: Queryable;
}

export async function buildServer(options: ServerOptions = {}) {
  const appConfig = options.appConfig ?? config;
  const ownsDb = !options.db;
  const db = options.db ?? createPool(appConfig);

  const app = Fastify({
    logger: appConfig.NODE_ENV !== "test"
  });

  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof HttpError) {
      reply.status(error.statusCode).send({
        error: error.message,
        details: error.details ?? undefined
      });
      return;
    }

    app.log.error(error);
    reply.status(500).send({ error: "Internal server error" });
  });

  app.get("/health", async () => ({
    ok: true
  }));

  app.get("/", async (_request, reply) =>
    reply.type("text/html; charset=utf-8").send(demoPageHtml())
  );

  await registerOrderRoutes(app, { config: appConfig, db });

  app.addHook("onClose", async () => {
    if (ownsDb) {
      await (db as pg.Pool).end();
    }
  });

  return app;
}
