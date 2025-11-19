import { config } from "./core/config.js";
import { buildApp } from "./app.js";

const app = await buildApp();
const host = config.host;
const port = config.port;

// Graceful shutdown handler
const gracefulShutdown = async (signal: string) => {
  app.log.info(`${signal} received, starting graceful shutdown...`);

  try {
    await app.close();
    app.log.info("✅ Server closed successfully");
    process.exit(0);
  } catch (err) {
    app.log.error({ err }, "❌ Error during shutdown");
    process.exit(1);
  }
};

// Register shutdown handlers
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Handle uncaught errors
process.on("uncaughtException", (err) => {
  app.log.error({ err }, "Uncaught Exception");
  gracefulShutdown("uncaughtException");
});

process.on("unhandledRejection", (reason, promise) => {
  app.log.error({ reason, promise }, "Unhandled Rejection");
  gracefulShutdown("unhandledRejection");
});

// Start server
try {
  await app.listen({ port, host });
  app.log.info(`🚀 Server listening at http://${host}:${port}`);
  app.log.info(`📊 Environment: ${config.nodeEnv}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
