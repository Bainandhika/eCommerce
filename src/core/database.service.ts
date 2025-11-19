import type { Pool, RowDataPacket, ResultSetHeader } from "mysql2/promise";
import type {
  User,
  Product,
  CreateUserInput,
  UpdateUserInput,
  CreateProductInput,
  UpdateProductInput,
} from "./types.js";

/**
 * Database Service
 * Provides reusable database operations using native SQL with mysql2
 */
export class DatabaseService {
  constructor(private readonly pool: Pool) {}

  // ==================== USER OPERATIONS ====================

  /**
   * Create a new user
   */
  async createUser(data: CreateUserInput): Promise<User> {
    const [result] = await this.pool.execute<ResultSetHeader>(
      "INSERT INTO users (email, name, password, createdAt, updatedAt) VALUES (?, ?, ?, NOW(), NOW())",
      [data.email, data.name || null, data.password]
    );

    const [rows] = await this.pool.execute<RowDataPacket[]>(
      "SELECT * FROM users WHERE id = ?",
      [result.insertId]
    );

    return rows[0] as User;
  }

  /**
   * Find user by ID
   */
  async findUserById(id: number): Promise<User | null> {
    const [rows] = await this.pool.execute<RowDataPacket[]>(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );

    return rows.length > 0 ? (rows[0] as User) : null;
  }

  /**
   * Find user by email
   */
  async findUserByEmail(email: string): Promise<User | null> {
    const [rows] = await this.pool.execute<RowDataPacket[]>(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    return rows.length > 0 ? (rows[0] as User) : null;
  }

  /**
   * Get all users with pagination
   */
  async getAllUsers(skip = 0, take = 10): Promise<User[]> {
    const [rows] = await this.pool.execute<RowDataPacket[]>(
      "SELECT * FROM users ORDER BY createdAt DESC LIMIT ? OFFSET ?",
      [take, skip]
    );

    return rows as User[];
  }

  /**
   * Update user
   */
  async updateUser(id: number, data: UpdateUserInput): Promise<User> {
    const updates: string[] = [];
    const values: any[] = [];

    if (data.email !== undefined) {
      updates.push("email = ?");
      values.push(data.email);
    }
    if (data.name !== undefined) {
      updates.push("name = ?");
      values.push(data.name);
    }
    if (data.password !== undefined) {
      updates.push("password = ?");
      values.push(data.password);
    }

    updates.push("updatedAt = NOW()");
    values.push(id);

    await this.pool.execute(
      `UPDATE users SET ${updates.join(", ")} WHERE id = ?`,
      values
    );

    const [rows] = await this.pool.execute<RowDataPacket[]>(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );

    return rows[0] as User;
  }

  /**
   * Delete user
   */
  async deleteUser(id: number): Promise<User> {
    const [rows] = await this.pool.execute<RowDataPacket[]>(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      throw new Error("User not found");
    }

    const user = rows[0] as User;

    await this.pool.execute("DELETE FROM users WHERE id = ?", [id]);

    return user;
  }

  // ==================== PRODUCT OPERATIONS ====================

  /**
   * Create a new product
   */
  async createProduct(data: CreateProductInput): Promise<Product> {
    const [result] = await this.pool.execute<ResultSetHeader>(
      "INSERT INTO products (name, description, price, stock, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(), NOW())",
      [data.name, data.description || null, data.price, data.stock || 0]
    );

    const [rows] = await this.pool.execute<RowDataPacket[]>(
      "SELECT * FROM products WHERE id = ?",
      [result.insertId]
    );

    return rows[0] as Product;
  }

  /**
   * Find product by ID
   */
  async findProductById(id: number): Promise<Product | null> {
    const [rows] = await this.pool.execute<RowDataPacket[]>(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );

    return rows.length > 0 ? (rows[0] as Product) : null;
  }

  /**
   * Get all products with pagination and optional search
   */
  async getAllProducts(
    skip = 0,
    take = 10,
    search?: string
  ): Promise<Product[]> {
    let query = "SELECT * FROM products";
    const params: any[] = [];

    if (search) {
      query += " WHERE name LIKE ? OR description LIKE ?";
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern);
    }

    query += " ORDER BY createdAt DESC LIMIT ? OFFSET ?";
    params.push(take, skip);

    const [rows] = await this.pool.execute<RowDataPacket[]>(query, params);

    return rows as Product[];
  }

  /**
   * Update product
   */
  async updateProduct(id: number, data: UpdateProductInput): Promise<Product> {
    const updates: string[] = [];
    const values: any[] = [];

    if (data.name !== undefined) {
      updates.push("name = ?");
      values.push(data.name);
    }
    if (data.description !== undefined) {
      updates.push("description = ?");
      values.push(data.description);
    }
    if (data.price !== undefined) {
      updates.push("price = ?");
      values.push(data.price);
    }
    if (data.stock !== undefined) {
      updates.push("stock = ?");
      values.push(data.stock);
    }

    updates.push("updatedAt = NOW()");
    values.push(id);

    await this.pool.execute(
      `UPDATE products SET ${updates.join(", ")} WHERE id = ?`,
      values
    );

    const [rows] = await this.pool.execute<RowDataPacket[]>(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );

    return rows[0] as Product;
  }

  /**
   * Delete product
   */
  async deleteProduct(id: number): Promise<Product> {
    const [rows] = await this.pool.execute<RowDataPacket[]>(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      throw new Error("Product not found");
    }

    const product = rows[0] as Product;

    await this.pool.execute("DELETE FROM products WHERE id = ?", [id]);

    return product;
  }

  /**
   * Update product stock
   */
  async updateProductStock(id: number, quantity: number): Promise<Product> {
    await this.pool.execute(
      "UPDATE products SET stock = stock + ?, updatedAt = NOW() WHERE id = ?",
      [quantity, id]
    );

    const [rows] = await this.pool.execute<RowDataPacket[]>(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );

    return rows[0] as Product;
  }

  // ==================== RAW QUERIES (Advanced) ====================

  /**
   * Execute raw SQL query (use with caution)
   * Example: Complex queries that mysql2 doesn't support well
   */
  async executeRawQuery<T = any>(
    query: string,
    params: any[] = []
  ): Promise<T> {
    const [rows] = await this.pool.execute<RowDataPacket[]>(query, params);
    return rows as T;
  }
}
