import { FastifyPluginAsync } from "fastify";
import { DatabaseService } from "../../core/database.service.js";
import {
  CourierSchema,
  CreateCourierSchema,
  UpdateCourierSchema,
  ErrorResponseSchema,
  DeleteResponseSchema,
  IdParamSchema,
} from "../../schemas/index.js";

const couriersModule: FastifyPluginAsync = async (fastify) => {
  const dbService = new DatabaseService(fastify.mysql);

  // GET /api/couriers - Get all couriers
  fastify.get(
    "/couriers",
    {
      schema: {
        description: "Get all couriers",
        tags: ["couriers"],
        response: {
          200: {
            description: "Successful response",
            type: "object",
            properties: {
              success: { type: "boolean" },
              data: {
                type: "array",
                items: CourierSchema,
              },
            },
          },
          500: ErrorResponseSchema,
        },
      },
    },
    async (_request, reply) => {
      try {
        const couriers = await dbService.getAllCouriers();
        return reply.send({
          success: true,
          data: couriers,
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({
          success: false,
          error: "Failed to fetch couriers",
        });
      }
    }
  );

  // GET /api/couriers/:id - Get courier by ID
  fastify.get<{ Params: { id: string } }>(
    "/couriers/:id",
    {
      schema: {
        description: "Get a single courier by ID",
        tags: ["couriers"],
        params: IdParamSchema,
        response: {
          200: {
            description: "Successful response",
            type: "object",
            properties: {
              success: { type: "boolean" },
              data: CourierSchema,
            },
          },
          404: {
            description: "Courier not found",
            type: "object",
            properties: {
              success: { type: "boolean" },
              error: { type: "string" },
            },
          },
          500: ErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const id = request.params.id;
        const courier = await dbService.findCourierById(id);

        if (!courier) {
          return reply.status(404).send({
            success: false,
            error: "Courier not found",
          });
        }

        return reply.send({
          success: true,
          data: courier,
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({
          success: false,
          error: "Failed to fetch courier",
        });
      }
    }
  );

  // POST /api/couriers - Create new courier
  fastify.post<{
    Body: {
      name?: string;
      is_available?: number;
    };
  }>(
    "/couriers",
    {
      schema: {
        description: "Create a new courier",
        tags: ["couriers"],
        body: CreateCourierSchema,
        response: {
          201: {
            description: "Courier created successfully",
            type: "object",
            properties: {
              success: { type: "boolean" },
              data: CourierSchema,
            },
          },
          500: ErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const courier = await dbService.createCourier(request.body);
        return reply.status(201).send({
          success: true,
          data: courier,
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({
          success: false,
          error: "Failed to create courier",
        });
      }
    }
  );

  // PUT /api/couriers/:id - Update courier
  fastify.put<{
    Params: { id: string };
    Body: {
      name?: string;
      is_available?: number;
    };
  }>(
    "/couriers/:id",
    {
      schema: {
        description: "Update an existing courier",
        tags: ["couriers"],
        params: IdParamSchema,
        body: UpdateCourierSchema,
        response: {
          200: {
            description: "Courier updated successfully",
            type: "object",
            properties: {
              success: { type: "boolean" },
              data: CourierSchema,
            },
          },
          404: {
            description: "Courier not found",
            type: "object",
            properties: {
              success: { type: "boolean" },
              error: { type: "string" },
            },
          },
          500: ErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const id = request.params.id;
        const courier = await dbService.updateCourier(id, request.body);

        return reply.send({
          success: true,
          data: courier,
        });
      } catch (error: any) {
        fastify.log.error(error);

        if (error.message === "Courier not found") {
          return reply.status(404).send({
            success: false,
            error: "Courier not found",
          });
        }

        return reply.status(500).send({
          success: false,
          error: "Failed to update courier",
        });
      }
    }
  );

  // DELETE /api/couriers/:id - Delete courier
  fastify.delete<{ Params: { id: string } }>(
    "/couriers/:id",
    {
      schema: {
        description: "Delete a courier",
        tags: ["couriers"],
        params: IdParamSchema,
        response: {
          200: DeleteResponseSchema,
          404: {
            description: "Courier not found",
            type: "object",
            properties: {
              success: { type: "boolean" },
              error: { type: "string" },
            },
          },
          500: ErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const id = request.params.id;
        await dbService.deleteCourier(id);

        return reply.send({
          success: true,
          message: "Courier deleted successfully",
        });
      } catch (error: any) {
        fastify.log.error(error);

        if (error.message === "Courier not found") {
          return reply.status(404).send({
            success: false,
            error: "Courier not found",
          });
        }

        return reply.status(500).send({
          success: false,
          error: "Failed to delete courier",
        });
      }
    }
  );
};

export default couriersModule;
