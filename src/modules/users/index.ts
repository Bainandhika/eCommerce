import { FastifyPluginAsync } from "fastify";
import { DatabaseService } from "../../core/database.service.js";

const usersModule: FastifyPluginAsync = async (fastify, options) => {
  const dbService = new DatabaseService(fastify.prisma);

  // GET /api/users - Get all users
  fastify.get("/users", async (request, reply) => {
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
  });

  // GET /api/users/:id - Get user by ID
  fastify.get<{ Params: { id: string } }>(
    "/users/:id",
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
        body: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email" },
            name: { type: "string" },
            password: { type: "string", minLength: 6 },
          },
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

        // Handle unique constraint violation
        if (error.code === "P2002") {
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
  }>("/users/:id", async (request, reply) => {
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
  });

  // DELETE /api/users/:id - Delete user
  fastify.delete<{ Params: { id: string } }>(
    "/users/:id",
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

        if (error.code === "P2025") {
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

