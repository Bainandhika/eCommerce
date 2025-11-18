import { FastifyPluginAsync } from "fastify";
import { DatabaseService } from "../../core/database.service.js";

const productsModule: FastifyPluginAsync = async (fastify, options) => {
  const dbService = new DatabaseService(fastify.prisma);

  // GET /api/products - Get all products
  fastify.get<{
    Querystring: {
      page?: string;
      limit?: string;
      search?: string;
    };
  }>("/products", async (request, reply) => {
    try {
      const page = parseInt(request.query.page || "1");
      const limit = parseInt(request.query.limit || "10");
      const skip = (page - 1) * limit;

      const products = await dbService.getAllProducts(
        skip,
        limit,
        request.query.search
      );

      return reply.send({
        success: true,
        data: products,
        pagination: {
          page,
          limit,
        },
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({
        success: false,
        error: "Failed to fetch products",
      });
    }
  });

  // GET /api/products/:id - Get product by ID
  fastify.get<{ Params: { id: string } }>(
    "/products/:id",
    async (request, reply) => {
      try {
        const id = parseInt(request.params.id);
        const product = await dbService.findProductById(id);

        if (!product) {
          return reply.status(404).send({
            success: false,
            error: "Product not found",
          });
        }

        return reply.send({
          success: true,
          data: product,
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({
          success: false,
          error: "Failed to fetch product",
        });
      }
    }
  );

  // POST /api/products - Create new product
  fastify.post<{
    Body: {
      name: string;
      description?: string;
      price: number;
      stock?: number;
    };
  }>(
    "/products",
    {
      schema: {
        body: {
          type: "object",
          required: ["name", "price"],
          properties: {
            name: { type: "string" },
            description: { type: "string" },
            price: { type: "number", minimum: 0 },
            stock: { type: "number", minimum: 0 },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const product = await dbService.createProduct(request.body);
        return reply.status(201).send({
          success: true,
          data: product,
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({
          success: false,
          error: "Failed to create product",
        });
      }
    }
  );

  // PUT /api/products/:id - Update product
  fastify.put<{
    Params: { id: string };
    Body: {
      name?: string;
      description?: string;
      price?: number;
      stock?: number;
    };
  }>("/products/:id", async (request, reply) => {
    try {
      const id = parseInt(request.params.id);
      const product = await dbService.updateProduct(id, request.body);

      return reply.send({
        success: true,
        data: product,
      });
    } catch (error: any) {
      fastify.log.error(error);

      if (error.code === "P2025") {
        return reply.status(404).send({
          success: false,
          error: "Product not found",
        });
      }

      return reply.status(500).send({
        success: false,
        error: "Failed to update product",
      });
    }
  });

  // DELETE /api/products/:id - Delete product
  fastify.delete<{ Params: { id: string } }>(
    "/products/:id",
    async (request, reply) => {
      try {
        const id = parseInt(request.params.id);
        await dbService.deleteProduct(id);

        return reply.send({
          success: true,
          message: "Product deleted successfully",
        });
      } catch (error: any) {
        fastify.log.error(error);

        if (error.code === "P2025") {
          return reply.status(404).send({
            success: false,
            error: "Product not found",
          });
        }

        return reply.status(500).send({
          success: false,
          error: "Failed to delete product",
        });
      }
    }
  );
};

export default productsModule;

