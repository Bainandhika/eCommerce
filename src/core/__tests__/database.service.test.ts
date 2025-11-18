import { PrismaClient } from "@prisma/client";
import { DatabaseService } from "../database.service.js";

// Mock Prisma Client
const mockPrismaClient = {
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  product: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  $queryRawUnsafe: jest.fn(),
  $queryRaw: jest.fn(),
} as unknown as PrismaClient;

describe("DatabaseService", () => {
  let dbService: DatabaseService;

  beforeEach(() => {
    dbService = new DatabaseService(mockPrismaClient);
    jest.clearAllMocks();
  });

  describe("User Operations", () => {
    describe("createUser", () => {
      it("should create a new user", async () => {
        const userData = {
          email: "test@example.com",
          name: "Test User",
          password: "hashedpassword",
        };

        const expectedUser = {
          id: 1,
          ...userData,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        (mockPrismaClient.user.create as jest.Mock).mockResolvedValue(
          expectedUser
        );

        const result = await dbService.createUser(userData);

        expect(mockPrismaClient.user.create).toHaveBeenCalledWith({
          data: userData,
        });
        expect(result).toEqual(expectedUser);
      });
    });

    describe("findUserById", () => {
      it("should find a user by ID", async () => {
        const userId = 1;
        const expectedUser = {
          id: userId,
          email: "test@example.com",
          name: "Test User",
          password: "hashedpassword",
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        (mockPrismaClient.user.findUnique as jest.Mock).mockResolvedValue(
          expectedUser
        );

        const result = await dbService.findUserById(userId);

        expect(mockPrismaClient.user.findUnique).toHaveBeenCalledWith({
          where: { id: userId },
        });
        expect(result).toEqual(expectedUser);
      });

      it("should return null if user not found", async () => {
        (mockPrismaClient.user.findUnique as jest.Mock).mockResolvedValue(null);

        const result = await dbService.findUserById(999);

        expect(result).toBeNull();
      });
    });

    describe("getAllUsers", () => {
      it("should get all users with default pagination", async () => {
        const expectedUsers = [
          {
            id: 1,
            email: "user1@example.com",
            name: "User 1",
            password: "hash1",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 2,
            email: "user2@example.com",
            name: "User 2",
            password: "hash2",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ];

        (mockPrismaClient.user.findMany as jest.Mock).mockResolvedValue(
          expectedUsers
        );

        const result = await dbService.getAllUsers();

        expect(mockPrismaClient.user.findMany).toHaveBeenCalledWith({
          skip: 0,
          take: 10,
          orderBy: { createdAt: "desc" },
        });
        expect(result).toEqual(expectedUsers);
      });

      it("should support custom pagination", async () => {
        await dbService.getAllUsers(20, 5);

        expect(mockPrismaClient.user.findMany).toHaveBeenCalledWith({
          skip: 20,
          take: 5,
          orderBy: { createdAt: "desc" },
        });
      });
    });
  });

  describe("Product Operations", () => {
    describe("createProduct", () => {
      it("should create a new product", async () => {
        const productData = {
          name: "Test Product",
          description: "A test product",
          price: 99.99,
          stock: 10,
        };

        const expectedProduct = {
          id: 1,
          ...productData,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        (mockPrismaClient.product.create as jest.Mock).mockResolvedValue(
          expectedProduct
        );

        const result = await dbService.createProduct(productData);

        expect(mockPrismaClient.product.create).toHaveBeenCalledWith({
          data: productData,
        });
        expect(result).toEqual(expectedProduct);
      });
    });

    describe("getAllProducts", () => {
      it("should get products with search filter", async () => {
        const searchTerm = "laptop";

        await dbService.getAllProducts(0, 10, searchTerm);

        expect(mockPrismaClient.product.findMany).toHaveBeenCalledWith({
          where: {
            OR: [
              { name: { contains: searchTerm } },
              { description: { contains: searchTerm } },
            ],
          },
          skip: 0,
          take: 10,
          orderBy: { createdAt: "desc" },
        });
      });

      it("should get products without search filter", async () => {
        await dbService.getAllProducts(0, 10);

        expect(mockPrismaClient.product.findMany).toHaveBeenCalledWith({
          where: undefined,
          skip: 0,
          take: 10,
          orderBy: { createdAt: "desc" },
        });
      });
    });
  });
});

