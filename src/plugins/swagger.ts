import fp from "fastify-plugin";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import { FastifyPluginAsync } from "fastify";

const swaggerPlugin: FastifyPluginAsync = async (fastify, options) => {
  // Register Swagger
  await fastify.register(swagger, {
    openapi: {
      openapi: "3.0.0",
      info: {
        title: "eCommerce API",
        description:
          "A comprehensive eCommerce API built with Fastify, Prisma, and TypeScript. This API provides endpoints for managing users, products, and other eCommerce operations.",
        version: "1.0.0",
        contact: {
          name: "API Support",
          email: "support@ecommerce.com",
        },
        license: {
          name: "ISC",
        },
      },
      servers: [
        {
          url: "http://localhost:3000",
          description: "Development server",
        },
        {
          url: "https://api.ecommerce.com",
          description: "Production server",
        },
      ],
      tags: [
        {
          name: "users",
          description: "User management endpoints",
        },
        {
          name: "products",
          description: "Product management endpoints",
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
            description: "Enter your JWT token",
          },
        },
      },
    },
  });

  // Register Swagger UI
  await fastify.register(swaggerUI, {
    routePrefix: "/documentation",
    uiConfig: {
      docExpansion: "list",
      deepLinking: true,
      displayRequestDuration: true,
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
      syntaxHighlight: {
        activate: true,
        theme: "monokai",
      },
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject, request, reply) => {
      return swaggerObject;
    },
    transformSpecificationClone: true,
  });

  fastify.log.info("📚 Swagger documentation available at /documentation");
};

export default fp(swaggerPlugin, {
  name: "swagger",
});

