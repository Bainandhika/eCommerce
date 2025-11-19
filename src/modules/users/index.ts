import { FastifyPluginAsync } from "fastify";
import { DatabaseService } from "../../core/database.service.js";
import {
  UserSchema,
  CreateUserSchema,
  UpdateUserSchema,
  ErrorResponseSchema,
  DeleteResponseSchema,
  IdParamSchema,
} from "../../schemas/index.js";

const usersModule: FastifyPluginAsync = async (fastify, options) => {
  const dbService = new DatabaseService(fastify.mysql);

  // GET /api/users - Get all users
  fastify.get(
    "/users",
    {
      schema: {
        description: "Get all users",
        tags: ["users"],
        response: {
          200: {
            description: "Successful response",
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              data: {
                type: "array",
                items: UserSchema,
              },
            },
          },
          500: ErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const users = await dbService.getAllUsers();
        return reply.send({
          success: true,
          data: users,
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({
          success: false,
          error: "Failed to fetch users",
        });
      }
    }
  );

  // GET /api/users/:id - Get user by ID
  fastify.get<{ Params: { id: string } }>(
    "/users/:id",
    {
      schema: {
        description: "Get a single user by ID",
        tags: ["users"],
        params: IdParamSchema,
        response: {
          200: {
            description: "Successful response",
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              data: UserSchema,
            },
          },
          404: {
            description: "User not found",
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              error: { type: "string", example: "User not found" },
            },
          },
          500: ErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const id = parseInt(request.params.id);
        const user = await dbService.findUserById(id);

        if (!user) {
          return reply.status(404).send({
            success: false,
            error: "User not found",
          });
        }

        return reply.send({
          success: true,
          data: user,
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({
          success: false,
          error: "Failed to fetch user",
        });
      }
    }
  );

  // POST /api/users - Create new user
  fastify.post<{
    Body: {
      email: string;
      name?: string;
      password: string;
    };
  }>(
    "/users",
    {
      schema: {
        description: "Create a new user",
        tags: ["users"],
        body: CreateUserSchema,
        response: {
          201: {
            description: "User created successfully",
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              data: UserSchema,
            },
          },
          409: {
            description: "Email already exists",
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              error: { type: "string", example: "Email already exists" },
            },
          },
          500: ErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const user = await dbService.createUser(request.body);
        return reply.status(201).send({
          success: true,
          data: user,
        });
      } catch (error: any) {
        fastify.log.error(error);

        // Handle unique constraint violation (MySQL error code ER_DUP_ENTRY)
        if (error.code === "ER_DUP_ENTRY") {
          return reply.status(409).send({
            success: false,
            error: "Email already exists",
          });
        }

        return reply.status(500).send({
          success: false,
          error: "Failed to create user",
        });
      }
    }
  );

  // PUT /api/users/:id - Update user
  fastify.put<{
    Params: { id: string };
    Body: {
      email?: string;
      name?: string;
      password?: string;
    };
  }>(
    "/users/:id",
    {
      schema: {
        description: "Update an existing user",
        tags: ["users"],
        params: IdParamSchema,
        body: UpdateUserSchema,
        response: {
          200: {
            description: "User updated successfully",
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              data: UserSchema,
            },
          },
          404: {
            description: "User not found",
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              error: { type: "string", example: "User not found" },
            },
          },
          500: ErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const id = parseInt(request.params.id);
        const user = await dbService.updateUser(id, request.body);

        return reply.send({
          success: true,
          data: user,
        });
      } catch (error: any) {
        fastify.log.error(error);

        if (error.code === "P2025") {
          return reply.status(404).send({
            success: false,
            error: "User not found",
          });
        }

        return reply.status(500).send({
          success: false,
          error: "Failed to update user",
        });
      }
    }
  );

  // DELETE /api/users/:id - Delete user
  fastify.delete<{ Params: { id: string } }>(
    "/users/:id",
    {
      schema: {
        description: "Delete a user",
        tags: ["users"],
        params: IdParamSchema,
        response: {
          200: DeleteResponseSchema,
          404: {
            description: "User not found",
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              error: { type: "string", example: "User not found" },
            },
          },
          500: ErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const id = parseInt(request.params.id);
        await dbService.deleteUser(id);

        return reply.send({
          success: true,
          message: "User deleted successfully",
        });
      } catch (error: any) {
        fastify.log.error(error);

        // Handle not found error
        if (error.message === "User not found") {
          return reply.status(404).send({
            success: false,
            error: "User not found",
          });
        }

        return reply.status(500).send({
          success: false,
          error: "Failed to delete user",
        });
      }
    }
  );
};

export default usersModule;
