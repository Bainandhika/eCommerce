import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { fastifyAwilixPlugin } from "@fastify/awilix";
import { asClass, asValue, Lifetime } from "awilix";
import { PrismaClient } from "@prisma/client";
import { DatabaseService } from "../core/database.service.js";

/**
 * Extend the Awilix Cradle to include our custom dependencies
 * This provides type safety for all registered services
 */
declare module "@fastify/awilix" {
  interface Cradle {
    // Core dependencies
    prisma: PrismaClient;

    // Services
    databaseService: DatabaseService;

    // Add more services here as your application grows
    // Example:
    // userService: UserService;
    // productService: ProductService;
    // authService: AuthService;
  }
}

/**
 * Dependency Injection Plugin
 *
 * Configures Awilix container with all application dependencies.
 * Provides type-safe dependency injection throughout the application.
 *
 * Lifetime options:
 * - SINGLETON: One instance for the entire application lifecycle
 * - SCOPED: One instance per request (recommended for most services)
 * - TRANSIENT: New instance every time it's resolved
 */
const diPlugin: FastifyPluginAsync = async (fastify, options) => {
  // Register the Awilix plugin
  await fastify.register(fastifyAwilixPlugin, {
    disposeOnClose: true, // Automatically dispose resources when server closes
    disposeOnResponse: true, // Automatically dispose scoped resources after response
    strictBooleanEnforced: true, // Enforce strict boolean values
  });

  // Register core dependencies
  fastify.diContainer.register({
    // Prisma Client - Singleton (one instance for entire app)
    // We use the existing prisma instance from the database plugin
    prisma: asValue(fastify.prisma),
  });

  // Register services
  fastify.diContainer.register({
    // Database Service - Scoped (new instance per request)
    // This ensures proper isolation between requests
    databaseService: asClass(DatabaseService, {
      lifetime: Lifetime.SCOPED,
      dispose: async (service) => {
        // Cleanup logic if needed
        fastify.log.debug("Disposing DatabaseService instance");
      },
    }),
  });

  // Example: Register additional services as your app grows
  // fastify.diContainer.register({
  //   userService: asClass(UserService, {
  //     lifetime: Lifetime.SCOPED,
  //   }),
  //   productService: asClass(ProductService, {
  //     lifetime: Lifetime.SCOPED,
  //   }),
  //   authService: asClass(AuthService, {
  //     lifetime: Lifetime.SINGLETON,
  //   }),
  // });

  // Add hook to create scoped container for each request
  fastify.addHook("onRequest", async (request, reply) => {
    // Create a scoped container for this request
    request.diScope = fastify.diContainer.createScope();
  });

  // Add hook to dispose scoped container after response
  fastify.addHook("onResponse", async (request, reply) => {
    // Dispose the scoped container
    if (request.diScope) {
      await request.diScope.dispose();
    }
  });

  fastify.log.info("✅ Dependency Injection container configured");
};

/**
 * Export as Fastify plugin with proper encapsulation
 *
 * Note: We use fastify-plugin to ensure the DI container is available
 * to all routes and plugins, not just within this plugin's scope
 */
export default fp(diPlugin, {
  name: "di",
  dependencies: ["database"], // Ensure database plugin is loaded first
});
