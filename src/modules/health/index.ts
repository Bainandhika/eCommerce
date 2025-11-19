import { FastifyPluginAsync } from "fastify";

const healthModule: FastifyPluginAsync = async (fastify, options) => {
  // GET /api/health - Health check endpoint
  fastify.get(
    "/",
    {
      schema: {
        description: "Health check endpoint",
        tags: ["Health"],
        response: {
          200: {
            type: "object",
            properties: {
              status: { type: "string" },
              timestamp: { type: "string" },
              uptime: { type: "number" },
              database: { type: "string" },
            },
          },
          503: {
            type: "object",
            properties: {
              status: { type: "string" },
              timestamp: { type: "string" },
              uptime: { type: "number" },
              database: { type: "string" },
            },
          },
        },
      },
    },
    async (_request, reply) => {
      try {
        // Test database connection
        const [rows] = await fastify.mysql.query("SELECT 1 as result");
        const dbStatus = rows ? "connected" : "disconnected";

        return reply.send({
          status: "ok",
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
          database: dbStatus,
        });
      } catch (error: any) {
        fastify.log.error(error);
        return reply.status(503).send({
          status: "error",
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
          database: "disconnected",
        });
      }
    }
  );
};

export default healthModule;
