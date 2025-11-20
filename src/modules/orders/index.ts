import { FastifyPluginAsync } from "fastify";
import { DatabaseService } from "../../core/database.service.js";
import {
  OrderSchema,
  CreateOrderSchema,
  UpdateOrderSchema,
  ErrorResponseSchema,
  DeleteResponseSchema,
  IdParamSchema,
} from "../../schemas/index.js";

const ordersModule: FastifyPluginAsync = async (fastify) => {
  const dbService = new DatabaseService(fastify.mysql);

  // GET /api/orders - Get all orders
  fastify.get(
    "/orders",
    {
      schema: {
        description: "Get all orders",
        tags: ["orders"],
        response: {
          200: {
            description: "Successful response",
            type: "object",
            properties: {
              success: { type: "boolean" },
              data: {
                type: "array",
                items: OrderSchema,
              },
            },
          },
          500: ErrorResponseSchema,
        },
      },
    },
    async (_request, reply) => {
      try {
        const orders = await dbService.getAllOrders();
        return reply.send({
          success: true,
          data: orders,
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({
          success: false,
          error: "Failed to fetch orders",
        });
      }
    }
  );

  // GET /api/orders/:id - Get order by ID
  fastify.get<{ Params: { id: string } }>(
    "/orders/:id",
    {
      schema: {
        description: "Get a single order by ID",
        tags: ["orders"],
        params: IdParamSchema,
        response: {
          200: {
            description: "Successful response",
            type: "object",
            properties: {
              success: { type: "boolean" },
              data: OrderSchema,
            },
          },
          404: {
            description: "Order not found",
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
        const order = await dbService.findOrderById(id);

        if (!order) {
          return reply.status(404).send({
            success: false,
            error: "Order not found",
          });
        }

        return reply.send({
          success: true,
          data: order,
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({
          success: false,
          error: "Failed to fetch order",
        });
      }
    }
  );

  // POST /api/orders - Create new order
  fastify.post<{
    Body: {
      order_id: string;
      user_id?: string;
      product_id?: string;
      order_quantity?: number;
      status?: "PAID" | "IN TRANSIT" | "DELIVERED";
    };
  }>(
    "/orders",
    {
      schema: {
        description: "Create a new order",
        tags: ["orders"],
        body: CreateOrderSchema,
        response: {
          201: {
            description: "Order created successfully",
            type: "object",
            properties: {
              success: { type: "boolean" },
              data: OrderSchema,
            },
          },
          500: ErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const order = await dbService.createOrder(request.body);
        return reply.status(201).send({
          success: true,
          data: order,
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({
          success: false,
          error: "Failed to create order",
        });
      }
    }
  );

  // PUT /api/orders/:id - Update order
  fastify.put<{
    Params: { id: string };
    Body: {
      user_id?: string;
      product_id?: string;
      order_quantity?: number;
      status?: "PAID" | "IN TRANSIT" | "DELIVERED";
    };
  }>(
    "/orders/:id",
    {
      schema: {
        description: "Update an existing order",
        tags: ["orders"],
        params: IdParamSchema,
        body: UpdateOrderSchema,
        response: {
          200: {
            description: "Order updated successfully",
            type: "object",
            properties: {
              success: { type: "boolean" },
              data: OrderSchema,
            },
          },
          404: {
            description: "Order not found",
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
        const order = await dbService.updateOrder(id, request.body);

        return reply.send({
          success: true,
          data: order,
        });
      } catch (error: any) {
        fastify.log.error(error);

        if (error.message === "Order not found") {
          return reply.status(404).send({
            success: false,
            error: "Order not found",
          });
        }

        return reply.status(500).send({
          success: false,
          error: "Failed to update order",
        });
      }
    }
  );

  // DELETE /api/orders/:id - Delete order
  fastify.delete<{ Params: { id: string } }>(
    "/orders/:id",
    {
      schema: {
        description: "Delete an order",
        tags: ["orders"],
        params: IdParamSchema,
        response: {
          200: DeleteResponseSchema,
          404: {
            description: "Order not found",
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
        await dbService.deleteOrder(id);

        return reply.send({
          success: true,
          message: "Order deleted successfully",
        });
      } catch (error: any) {
        fastify.log.error(error);

        if (error.message === "Order not found") {
          return reply.status(404).send({
            success: false,
            error: "Order not found",
          });
        }

        return reply.status(500).send({
          success: false,
          error: "Failed to delete order",
        });
      }
    }
  );
};

export default ordersModule;
