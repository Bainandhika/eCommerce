import Fastify from "fastify";
import autoload from "@fastify/autoload";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function buildApp() {
  const app = Fastify({
    logger: true,
  });

  app.register(autoload, { dir: join(__dirname, "plugins") });

  app.register(autoload, {
    dir: join(__dirname, "modules"),
    options: { prefix: "/api" },
  });

  return app;
}
