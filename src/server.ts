import { config } from "./core/config.js";
import { buildApp } from "./app.js";

const app = buildApp();
const host = config.host;
const port = config.port;

try {
  await app.listen({ port, host });
  app.log.info(`Server listening at http://${host}:${port}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
