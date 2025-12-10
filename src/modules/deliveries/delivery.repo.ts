import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import {
  CreateDeliveryInput,
  Delivery,
  UpdateDeliveryInput,
} from "./delivery.schema.js";
import { v4 as uuidv4 } from "uuid";

export class DeliveryRepo {
  constructor(private readonly pool: Pool) {}

  async createDelivery(data: CreateDeliveryInput): Promise<Delivery> {
    const now = new Date().toISOString();
    const delivery = {
      delivery_id: uuidv4(),
      order_id: data.order_id,
      courier_id: data.courier_id,
      pick_up_date: data.pick_up_date || null,
      delivered_date: data.delivered_date || null,
      created_at: now,
      updated_at: now,
    };

    await this.pool.execute<ResultSetHeader>(
      "INSERT INTO delivery (delivery_id, order_id, courier_id, pick_up_date, delivered_date, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        delivery.delivery_id,
        delivery.order_id,
        delivery.courier_id,
        delivery.pick_up_date,
        delivery.delivered_date,
        delivery.created_at,
        delivery.updated_at,
      ]
    );

    const [rows] = await this.pool.execute<RowDataPacket[]>(
      "SELECT * FROM delivery WHERE delivery_id = ?",
      [delivery.delivery_id]
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
