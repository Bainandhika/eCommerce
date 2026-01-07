import { FastifyPluginAsync } from "fastify";
import { DatabaseService } from "../../core/database.service.js";
import {
  DeliverySchema,
  CreateDeliverySchema,
  UpdateDeliverySchema,
  ErrorResponseSchema,
  DeleteResponseSchema,
  IdParamSchema,
} from "../../schemas/index.js";

const deliveriesModule: FastifyPluginAsync = async (fastify) => {
  const dbService = new DatabaseService(fastify.mysql);

  // GET /api/deliveries - Get all deliveries
  fastify.get(
    "/deliveries",
    {
      schema: {
        description: "Get all deliveries",
        tags: ["deliveries"],
        response: {
          200: {
            description: "Successful response",
            type: "object",
            properties: {
              success: { type: "boolean" },
              data: {
                type: "array",
                items: DeliverySchema,
              },
            },
          },
          500: ErrorResponseSchema,
        },
      },
    },
    async (_request, reply) => {
      try {
        const deliveries = await dbService.getAllDeliveries();
        return reply.send({
          success: true,
          data: deliveries,
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({
          success: false,
          error: "Failed to fetch deliveries",
        });
      }
    }
  );

  // GET /api/deliveries/:id - Get delivery by ID
  fastify.get<{ Params: { id: string } }>(
    "/deliveries/:id",
    {
      schema: {
        description: "Get a single delivery by ID",
        tags: ["deliveries"],
        params: IdParamSchema,
        response: {
          200: {
            description: "Successful response",
            type: "object",
            properties: {
              success: { type: "boolean" },
              data: DeliverySchema,
            },
          },
          404: {
            description: "Delivery not found",
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
        const delivery = await dbService.findDeliveryById(id);

        if (!delivery) {
          return reply.status(404).send({
            success: false,
            error: "Delivery not found",
          });
        }

        return reply.send({
          success: true,
          data: delivery,
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({
          success: false,
          error: "Failed to fetch delivery",
        });
      }
    }
  );

  // POST /api/deliveries - Create new delivery
  fastify.post<{
    Body: {
      order_id?: string;
      courier_id?: string;
      pick_up_date?: string;
      delivered_date?: string;
    };
  }>(
    "/deliveries",
    {
      schema: {
        description: "Create a new delivery",
        tags: ["deliveries"],
        body: CreateDeliverySchema,
        response: {
          201: {
            description: "Delivery created successfully",
            type: "object",
            properties: {
              success: { type: "boolean" },
              data: DeliverySchema,
            },
          },
          500: ErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const delivery = await dbService.createDelivery(request.body);
        return reply.status(201).send({
          success: true,
          data: delivery,
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({
          success: false,
          error: "Failed to create delivery",
        });
      }
    }
  );

  // PUT /api/deliveries/:id - Update delivery
  fastify.put<{
    Params: { id: string };
    Body: {
      order_id?: string;
      courier_id?: string;
      pick_up_date?: string;
      delivered_date?: string;
    };
  }>(
    "/deliveries/:id",
    {
      schema: {
        description: "Update an existing delivery",
        tags: ["deliveries"],
        params: IdParamSchema,
        body: UpdateDeliverySchema,
        response: {
          200: {
            description: "Delivery updated successfully",
            type: "object",
            properties: {
              success: { type: "boolean" },
              data: DeliverySchema,
            },
          },
          404: {
            description: "Delivery not found",
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
        const delivery = await dbService.updateDelivery(id, request.body);

        return reply.send({
          success: true,
          data: delivery,
        });
      } catch (error: any) {
        fastify.log.error(error);

        if (error.message === "Delivery not found") {
          return reply.status(404).send({
            success: false,
            error: "Delivery not found",
          });
        }

        return reply.status(500).send({
          success: false,
          error: "Failed to update delivery",
        });
      }
    }
  );

  // DELETE /api/deliveries/:id - Delete delivery
  fastify.delete<{ Params: { id: string } }>(
    "/deliveries/:id",
    {
      schema: {
        description: "Delete a delivery",
        tags: ["deliveries"],
        params: IdParamSchema,
        response: {
          200: DeleteResponseSchema,
          404: {
            description: "Delivery not found",
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
        await dbService.deleteDelivery(id);

        return reply.send({
          success: true,
          message: "Delivery deleted successfully",
        });
      } catch (error: any) {
        fastify.log.error(error);

        if (error.message === "Delivery not found") {
          return reply.status(404).send({
            success: false,
            error: "Delivery not found",
          });
        }

        return reply.status(500).send({
          success: false,
          error: "Failed to delete delivery",
        });
      }
    }
  );
};

export default deliveriesModule;
