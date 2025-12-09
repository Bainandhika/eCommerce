import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import {
  CreateDeliveryInput,
  Delivery,
  UpdateDeliveryInput,
} from "../../core/types/delivery.type.js";

export class DeliveryRepo {
  constructor(private readonly pool: Pool) {}

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

  async findDeliveryById(id: string): Promise<Delivery | null> {
    const [rows] = await this.pool.execute<RowDataPacket[]>(
      "SELECT * FROM delivery WHERE delivery_id = ?",
      [id]
    );

    return rows.length > 0 ? (rows[0] as Delivery) : null;
  }

  async getAllDeliveries(skip = 0, take = 10): Promise<Delivery[]> {
    const [rows] = await this.pool.execute<RowDataPacket[]>(
      "SELECT * FROM delivery ORDER BY created_at DESC LIMIT ? OFFSET ?",
      [take, skip]
    );

    return rows as Delivery[];
  }

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
    values.push(new Date().toISOString(), id);

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
}
