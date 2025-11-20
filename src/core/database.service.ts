import type { Pool, RowDataPacket, ResultSetHeader } from "mysql2/promise";
import type {
  User,
  Product,
  Courier,
  Order,
  Delivery,
  CreateUserInput,
  UpdateUserInput,
  CreateProductInput,
  UpdateProductInput,
  CreateCourierInput,
  UpdateCourierInput,
  CreateOrderInput,
  UpdateOrderInput,
  CreateDeliveryInput,
  UpdateDeliveryInput,
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
    const userId = `USER_${Date.now()}`;
    const now = new Date().toISOString();

    await this.pool.execute<ResultSetHeader>(
      "INSERT INTO user (user_id, email, password, address, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
      [userId, data.email, data.password, data.address || null, now, now]
    );

    const [rows] = await this.pool.execute<RowDataPacket[]>(
      "SELECT * FROM user WHERE user_id = ?",
      [userId]
    );

    return rows[0] as User;
  }

  /**
   * Find user by ID
   */
  async findUserById(id: string): Promise<User | null> {
    const [rows] = await this.pool.execute<RowDataPacket[]>(
      "SELECT * FROM user WHERE user_id = ?",
      [id]
    );

    return rows.length > 0 ? (rows[0] as User) : null;
  }

  /**
   * Find user by email
   */
  async findUserByEmail(email: string): Promise<User | null> {
    const [rows] = await this.pool.execute<RowDataPacket[]>(
      "SELECT * FROM user WHERE email = ?",
      [email]
    );

    return rows.length > 0 ? (rows[0] as User) : null;
  }

  /**
   * Get all users with pagination
   */
  async getAllUsers(skip = 0, take = 10): Promise<User[]> {
    const [rows] = await this.pool.execute<RowDataPacket[]>(
      "SELECT * FROM user ORDER BY created_at DESC LIMIT ? OFFSET ?",
      [take, skip]
    );

    return rows as User[];
  }

  /**
   * Update user
   */
  async updateUser(id: string, data: UpdateUserInput): Promise<User> {
    const updates: string[] = [];
    const values: any[] = [];

    if (data.email !== undefined) {
      updates.push("email = ?");
      values.push(data.email);
    }
    if (data.password !== undefined) {
      updates.push("password = ?");
      values.push(data.password);
    }
    if (data.address !== undefined) {
      updates.push("address = ?");
      values.push(data.address);
    }

    updates.push("updated_at = ?");
    values.push(new Date().toISOString());
    values.push(id);

    await this.pool.execute(
      `UPDATE user SET ${updates.join(", ")} WHERE user_id = ?`,
      values
    );

    const [rows] = await this.pool.execute<RowDataPacket[]>(
      "SELECT * FROM user WHERE user_id = ?",
      [id]
    );

    return rows[0] as User;
  }

  /**
   * Delete user
   */
  async deleteUser(id: string): Promise<User> {
    const [rows] = await this.pool.execute<RowDataPacket[]>(
      "SELECT * FROM user WHERE user_id = ?",
      [id]
    );

    if (rows.length === 0) {
      throw new Error("User not found");
    }

    const user = rows[0] as User;

    await this.pool.execute("DELETE FROM user WHERE user_id = ?", [id]);

    return user;
  }

  // ==================== PRODUCT OPERATIONS ====================

  /**
   * Create a new product
   */
  async createProduct(data: CreateProductInput): Promise<Product> {
    const productId = `PROD_${Date.now()}`;
    const now = new Date().toISOString();

    await this.pool.execute<ResultSetHeader>(
      "INSERT INTO product (product_id, name, price, quantity, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
      [productId, data.name, data.price, data.quantity || 0, now, now]
    );

    const [rows] = await this.pool.execute<RowDataPacket[]>(
      "SELECT * FROM product WHERE product_id = ?",
      [productId]
    );

    return rows[0] as Product;
  }

  /**
   * Find product by ID
   */
  async findProductById(id: string): Promise<Product | null> {
    const [rows] = await this.pool.execute<RowDataPacket[]>(
      "SELECT * FROM product WHERE product_id = ?",
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
    let query = "SELECT * FROM product";
    const params: any[] = [];

    if (search) {
      query += " WHERE name LIKE ?";
      const searchPattern = `%${search}%`;
      params.push(searchPattern);
    }

    query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
    params.push(take, skip);

    const [rows] = await this.pool.execute<RowDataPacket[]>(query, params);

    return rows as Product[];
  }

  /**
   * Update product
   */
  async updateProduct(id: string, data: UpdateProductInput): Promise<Product> {
    const updates: string[] = [];
    const values: any[] = [];

    if (data.name !== undefined) {
      updates.push("name = ?");
      values.push(data.name);
    }
    if (data.price !== undefined) {
      updates.push("price = ?");
      values.push(data.price);
    }
    if (data.quantity !== undefined) {
      updates.push("quantity = ?");
      values.push(data.quantity);
    }

    updates.push("updated_at = ?");
    values.push(new Date().toISOString());
    values.push(id);

    await this.pool.execute(
      `UPDATE product SET ${updates.join(", ")} WHERE product_id = ?`,
      values
    );

    const [rows] = await this.pool.execute<RowDataPacket[]>(
      "SELECT * FROM product WHERE product_id = ?",
      [id]
    );

    return rows[0] as Product;
  }

  /**
   * Delete product
   */
  async deleteProduct(id: string): Promise<Product> {
    const [rows] = await this.pool.execute<RowDataPacket[]>(
      "SELECT * FROM product WHERE product_id = ?",
      [id]
    );

    if (rows.length === 0) {
      throw new Error("Product not found");
    }

    const product = rows[0] as Product;

    await this.pool.execute("DELETE FROM product WHERE product_id = ?", [id]);

    return product;
  }

  /**
   * Update product quantity
   */
  async updateProductQuantity(id: string, quantity: number): Promise<Product> {
    const now = new Date().toISOString();
    await this.pool.execute(
      "UPDATE product SET quantity = quantity + ?, updated_at = ? WHERE product_id = ?",
      [quantity, now, id]
    );

    const [rows] = await this.pool.execute<RowDataPacket[]>(
      "SELECT * FROM product WHERE product_id = ?",
      [id]
    );

    return rows[0] as Product;
  }

  // ==================== COURIER OPERATIONS ====================

  /**
   * Create a new courier
   */
  async createCourier(data: CreateCourierInput): Promise<Courier> {
    await this.pool.execute<ResultSetHeader>(
      "INSERT INTO courier (courier_id, name, is_available) VALUES (?, ?, ?)",
      [data.courier_id, data.name || null, data.is_available || null]
    );

    const [rows] = await this.pool.execute<RowDataPacket[]>(
      "SELECT * FROM courier WHERE courier_id = ?",
      [data.courier_id]
    );

    return rows[0] as Courier;
  }

  /**
   * Find courier by ID
   */
  async findCourierById(id: string): Promise<Courier | null> {
    const [rows] = await this.pool.execute<RowDataPacket[]>(
      "SELECT * FROM courier WHERE courier_id = ?",
      [id]
    );

    return rows.length > 0 ? (rows[0] as Courier) : null;
  }

  /**
   * Get all couriers
   */
  async getAllCouriers(skip = 0, take = 10): Promise<Courier[]> {
    const [rows] = await this.pool.execute<RowDataPacket[]>(
      "SELECT * FROM courier LIMIT ? OFFSET ?",
      [take, skip]
    );

    return rows as Courier[];
  }

  /**
   * Update courier
   */
  async updateCourier(id: string, data: UpdateCourierInput): Promise<Courier> {
    const updates: string[] = [];
    const values: any[] = [];

    if (data.name !== undefined) {
      updates.push("name = ?");
      values.push(data.name);
    }
    if (data.is_available !== undefined) {
      updates.push("is_available = ?");
      values.push(data.is_available);
    }

    values.push(id);

    await this.pool.execute(
      `UPDATE courier SET ${updates.join(", ")} WHERE courier_id = ?`,
      values
    );

    const [rows] = await this.pool.execute<RowDataPacket[]>(
      "SELECT * FROM courier WHERE courier_id = ?",
      [id]
    );

    return rows[0] as Courier;
  }

  /**
   * Delete courier
   */
  async deleteCourier(id: string): Promise<Courier> {
    const [rows] = await this.pool.execute<RowDataPacket[]>(
      "SELECT * FROM courier WHERE courier_id = ?",
      [id]
    );

    if (rows.length === 0) {
      throw new Error("Courier not found");
    }

    const courier = rows[0] as Courier;

    await this.pool.execute("DELETE FROM courier WHERE courier_id = ?", [id]);

    return courier;
  }

  // ==================== ORDER OPERATIONS ====================

  /**
   * Create a new order
   */
  async createOrder(data: CreateOrderInput): Promise<Order> {
    const now = new Date().toISOString();

    await this.pool.execute<ResultSetHeader>(
      "INSERT INTO oder (order_id, user_id, product_id, order_quantity, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        data.order_id,
        data.user_id || null,
        data.product_id || null,
        data.order_quantity || null,
        data.status || null,
        now,
        now,
      ]
    );

    const [rows] = await this.pool.execute<RowDataPacket[]>(
      "SELECT * FROM oder WHERE order_id = ?",
      [data.order_id]
    );

    return rows[0] as Order;
  }

  /**
   * Find order by ID
   */
  async findOrderById(id: string): Promise<Order | null> {
    const [rows] = await this.pool.execute<RowDataPacket[]>(
      "SELECT * FROM oder WHERE order_id = ?",
      [id]
    );

    return rows.length > 0 ? (rows[0] as Order) : null;
  }

  /**
   * Get all orders
   */
  async getAllOrders(skip = 0, take = 10): Promise<Order[]> {
    const [rows] = await this.pool.execute<RowDataPacket[]>(
      "SELECT * FROM oder ORDER BY created_at DESC LIMIT ? OFFSET ?",
      [take, skip]
    );

    return rows as Order[];
  }

  /**
   * Update order
   */
  async updateOrder(id: string, data: UpdateOrderInput): Promise<Order> {
    const updates: string[] = [];
    const values: any[] = [];

    if (data.user_id !== undefined) {
      updates.push("user_id = ?");
      values.push(data.user_id);
    }
    if (data.product_id !== undefined) {
      updates.push("product_id = ?");
      values.push(data.product_id);
    }
    if (data.order_quantity !== undefined) {
      updates.push("order_quantity = ?");
      values.push(data.order_quantity);
    }
    if (data.status !== undefined) {
      updates.push("status = ?");
      values.push(data.status);
    }

    updates.push("updated_at = ?");
    values.push(new Date().toISOString());
    values.push(id);

    await this.pool.execute(
      `UPDATE oder SET ${updates.join(", ")} WHERE order_id = ?`,
      values
    );

    const [rows] = await this.pool.execute<RowDataPacket[]>(
      "SELECT * FROM oder WHERE order_id = ?",
      [id]
    );

    return rows[0] as Order;
  }

  /**
   * Delete order
   */
  async deleteOrder(id: string): Promise<Order> {
    const [rows] = await this.pool.execute<RowDataPacket[]>(
      "SELECT * FROM oder WHERE order_id = ?",
      [id]
    );

    if (rows.length === 0) {
      throw new Error("Order not found");
    }

    const order = rows[0] as Order;

    await this.pool.execute("DELETE FROM oder WHERE order_id = ?", [id]);

    return order;
  }

  // ==================== DELIVERY OPERATIONS ====================

  /**
   * Create a new delivery
   */
  async createDelivery(data: CreateDeliveryInput): Promise<Delivery> {
    const now = new Date().toISOString();

    await this.pool.execute<ResultSetHeader>(
      "INSERT INTO delivery (delivery_id, order_id, courier_id, pick_up_date, delivered_date, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        data.delivery_id,
        data.order_id || null,
        data.courier_id || null,
        data.pick_up_date || null,
        data.delivered_date || null,
        now,
        now,
      ]
    );

    const [rows] = await this.pool.execute<RowDataPacket[]>(
      "SELECT * FROM delivery WHERE delivery_id = ?",
      [data.delivery_id]
    );

    return rows[0] as Delivery;
  }

  /**
   * Find delivery by ID
   */
  async findDeliveryById(id: string): Promise<Delivery | null> {
    const [rows] = await this.pool.execute<RowDataPacket[]>(
      "SELECT * FROM delivery WHERE delivery_id = ?",
      [id]
    );

    return rows.length > 0 ? (rows[0] as Delivery) : null;
  }

  /**
   * Get all deliveries
   */
  async getAllDeliveries(skip = 0, take = 10): Promise<Delivery[]> {
    const [rows] = await this.pool.execute<RowDataPacket[]>(
      "SELECT * FROM delivery ORDER BY created_at DESC LIMIT ? OFFSET ?",
      [take, skip]
    );

    return rows as Delivery[];
  }

  /**
   * Update delivery
   */
  async updateDelivery(
    id: string,
    data: UpdateDeliveryInput
  ): Promise<Delivery> {
    const updates: string[] = [];
    const values: any[] = [];

    if (data.order_id !== undefined) {
      updates.push("order_id = ?");
      values.push(data.order_id);
    }
    if (data.courier_id !== undefined) {
      updates.push("courier_id = ?");
      values.push(data.courier_id);
    }
    if (data.pick_up_date !== undefined) {
      updates.push("pick_up_date = ?");
      values.push(data.pick_up_date);
    }
    if (data.delivered_date !== undefined) {
      updates.push("delivered_date = ?");
      values.push(data.delivered_date);
    }

    updates.push("updated_at = ?");
    values.push(new Date().toISOString());
    values.push(id);

    await this.pool.execute(
      `UPDATE delivery SET ${updates.join(", ")} WHERE delivery_id = ?`,
      values
    );

    const [rows] = await this.pool.execute<RowDataPacket[]>(
      "SELECT * FROM delivery WHERE delivery_id = ?",
      [id]
    );

    return rows[0] as Delivery;
  }

  /**
   * Delete delivery
   */
  async deleteDelivery(id: string): Promise<Delivery> {
    const [rows] = await this.pool.execute<RowDataPacket[]>(
      "SELECT * FROM delivery WHERE delivery_id = ?",
      [id]
    );

    if (rows.length === 0) {
      throw new Error("Delivery not found");
    }

    const delivery = rows[0] as Delivery;

    await this.pool.execute("DELETE FROM delivery WHERE delivery_id = ?", [id]);

    return delivery;
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
