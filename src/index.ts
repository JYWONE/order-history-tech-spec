import { config } from "./config.js";
import { buildServer } from "./server.js";

const app = await buildServer();

await app.listen({
  host: "0.0.0.0",
  port: config.PORT
});
