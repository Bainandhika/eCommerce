import { FastifyPluginAsync } from "fastify";
import { DatabaseService } from "../../core/database.service.js";
import {
  ProductSchema,
  CreateProductSchema,
  UpdateProductSchema,
  ErrorResponseSchema,
  DeleteResponseSchema,
  IdParamSchema,
  ProductSearchQuerySchema,
} from "../../schemas/index.js";

const productsModule: FastifyPluginAsync = async (fastify, options) => {
  const dbService = new DatabaseService(fastify.mysql);

  // GET /api/products - Get all products
  fastify.get<{
    Querystring: {
      page?: string;
      limit?: string;
      search?: string;
    };
  }>(
    "/products",
    {
      schema: {
        description: "Get all products with pagination and optional search",
        tags: ["products"],
        querystring: ProductSearchQuerySchema,
        response: {
          200: {
            description: "Successful response",
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              data: {
                type: "array",
                items: ProductSchema,
              },
              pagination: {
                type: "object",
                properties: {
                  page: { type: "integer", example: 1 },
                  limit: { type: "integer", example: 10 },
                },
              },
            },
          },
          500: ErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
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
    }
  );

  // GET /api/products/:id - Get product by ID
  fastify.get<{ Params: { id: string } }>(
    "/products/:id",
    {
      schema: {
        description: "Get a single product by ID",
        tags: ["products"],
        params: IdParamSchema,
        response: {
          200: {
            description: "Successful response",
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              data: ProductSchema,
            },
          },
          404: {
            description: "Product not found",
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              error: { type: "string", example: "Product not found" },
            },
          },
          500: ErrorResponseSchema,
        },
      },
    },
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
        description: "Create a new product",
        tags: ["products"],
        body: CreateProductSchema,
        response: {
          201: {
            description: "Product created successfully",
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              data: ProductSchema,
            },
          },
          500: ErrorResponseSchema,
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
  }>(
    "/products/:id",
    {
      schema: {
        description: "Update an existing product",
        tags: ["products"],
        params: IdParamSchema,
        body: UpdateProductSchema,
        response: {
          200: {
            description: "Product updated successfully",
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              data: ProductSchema,
            },
          },
          404: {
            description: "Product not found",
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              error: { type: "string", example: "Product not found" },
            },
          },
          500: ErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const id = parseInt(request.params.id);
        const product = await dbService.updateProduct(id, request.body);

        return reply.send({
          success: true,
          data: product,
        });
      } catch (error: any) {
        fastify.log.error(error);

        // Handle not found error
        if (error.message === "Product not found") {
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
    }
  );

  // DELETE /api/products/:id - Delete product
  fastify.delete<{ Params: { id: string } }>(
    "/products/:id",
    {
      schema: {
        description: "Delete a product",
        tags: ["products"],
        params: IdParamSchema,
        response: {
          200: DeleteResponseSchema,
          404: {
            description: "Product not found",
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              error: { type: "string", example: "Product not found" },
            },
          },
          500: ErrorResponseSchema,
        },
      },
    },
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

        // Handle not found error
        if (error.message === "Product not found") {
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
