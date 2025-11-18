import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { PrismaClient } from "@prisma/client";
import { config } from "../core/config.js";

// Extend Fastify instance type to include prisma
declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

const databasePlugin: FastifyPluginAsync = async (fastify, options) => {
  // Create Prisma Client instance
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: config.database.url,
      },
    },
    log:
      config.nodeEnv === "development"
        ? ["query", "info", "warn", "error"]
        : ["error"],
  });

  // Test database connection
  try {
    await prisma.$connect();
    fastify.log.info("✅ Database connected successfully");
  } catch (error) {
    fastify.log.error({ err: error }, "❌ Database connection failed");
    throw error;
  }

  // Decorate Fastify instance with prisma client
  fastify.decorate("prisma", prisma);

  // Add hook to close database connection when app closes
  fastify.addHook("onClose", async (instance) => {
    instance.log.info("Disconnecting from database...");
    await instance.prisma.$disconnect();
    instance.log.info("✅ Database disconnected");
  });
};

// Export as Fastify plugin
export default fp(databasePlugin, {
  name: "database",
});
