import Fastify from "fastify";
import autoload from "@fastify/autoload";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function buildApp() {
  const app = Fastify({
    logger: true,
    pluginTimeout: 30000, // Increase plugin timeout to 30 seconds
  });

  // Register core plugins first (database, DI, etc.)
  // Exclude swagger to load it after routes
  await app.register(autoload, {
    dir: join(__dirname, "plugins"),
    ignorePattern: /swagger\.ts$/,
  });

  // Register all route modules
  await app.register(autoload, {
    dir: join(__dirname, "modules"),
    options: { prefix: "/api" },
  });

  // Register Swagger plugin last, after all routes are loaded
  await app.register(autoload, {
    dir: join(__dirname, "plugins"),
    ignorePattern: /^(?!.*swagger\.ts$).*$/,
  });

  return app;
}
