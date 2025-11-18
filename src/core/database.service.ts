import type { PrismaClient, User, Product, Prisma } from "@prisma/client";

/**
 * Database Service
 * Provides reusable database operations with proper TypeScript typing
 */
export class DatabaseService {
  constructor(private readonly prisma: PrismaClient) {}

  // ==================== USER OPERATIONS ====================

  /**
   * Create a new user
   */
  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  /**
   * Find user by ID
   */
  async findUserById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * Find user by email
   */
  async findUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Get all users with pagination
   */
  async getAllUsers(skip = 0, take = 10): Promise<User[]> {
    return this.prisma.user.findMany({
      skip,
      take,
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Update user
   */
  async updateUser(id: number, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete user
   */
  async deleteUser(id: number): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  // ==================== PRODUCT OPERATIONS ====================

  /**
   * Create a new product
   */
  async createProduct(data: Prisma.ProductCreateInput): Promise<Product> {
    return this.prisma.product.create({ data });
  }

  /**
   * Find product by ID
   */
  async findProductById(id: number): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  /**
   * Get all products with pagination and optional search
   */
  async getAllProducts(
    skip = 0,
    take = 10,
    search?: string
  ): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search } },
              { description: { contains: search } },
            ],
          }
        : undefined,
      skip,
      take,
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Update product
   */
  async updateProduct(
    id: number,
    data: Prisma.ProductUpdateInput
  ): Promise<Product> {
    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete product
   */
  async deleteProduct(id: number): Promise<Product> {
    return this.prisma.product.delete({
      where: { id },
    });
  }

  /**
   * Update product stock
   */
  async updateProductStock(id: number, quantity: number): Promise<Product> {
    return this.prisma.product.update({
      where: { id },
      data: {
        stock: {
          increment: quantity,
        },
      },
    });
  }

  // ==================== RAW QUERIES (Advanced) ====================

  /**
   * Execute raw SQL query (use with caution)
   * Example: Complex queries that Prisma doesn't support well
   */
  async executeRawQuery<T = any>(query: string, ...params: any[]): Promise<T> {
    return this.prisma.$queryRawUnsafe<T>(query, ...params);
  }

  /**
   * Execute raw SQL with Prisma template tag (safer)
   */
  async executeRawQuerySafe<T = any>(
    query: TemplateStringsArray,
    ...params: any[]
  ): Promise<T> {
    return this.prisma.$queryRaw<T>(query, ...params);
  }
}
