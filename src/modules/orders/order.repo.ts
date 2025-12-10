import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import {
  CreateOrderInput,
  Order,
  UpdateOrderInput,
} from "./order.schema.js";

export class OrderRepo {
  constructor(private readonly pool: Pool) {}

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

  async findOrderById(id: string): Promise<Order | null> {
    const [rows] = await this.pool.execute<RowDataPacket[]>(
      "SELECT * FROM oder WHERE order_id = ?",
      [id]
    );

    return rows.length > 0 ? (rows[0] as Order) : null;
  }

  async getAllOrders(skip = 0, take = 10): Promise<Order[]> {
    const [rows] = await this.pool.execute<RowDataPacket[]>(
      "SELECT * FROM oder ORDER BY created_at DESC LIMIT ? OFFSET ?",
      [take, skip]
    );

    return rows as Order[];
  }

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
    values.push(new Date().toISOString(), id);

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
}
