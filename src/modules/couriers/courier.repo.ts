import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import {
  Courier,
  CreateCourierInput,
  UpdateCourierInput,
} from "./courier.schema.js";
import { v4 as uuidv4 } from "uuid";

export class CourierRepo {
  constructor(private readonly pool: Pool) {}

  async createCourier(data: CreateCourierInput): Promise<Courier> {
    const now = new Date().toISOString();
    const courier = {
      courier_id: uuidv4(),
      name: data.name,
      is_available: data.is_available,
      created_at: now,
      updated_at: now,
    };

    await this.pool.execute<ResultSetHeader>(
      "INSERT INTO courier (courier_id, name, is_available, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
      [courier.courier_id, courier.name, courier.is_available, courier.created_at, courier.updated_at]
    );

    const [rows] = await this.pool.execute<RowDataPacket[]>(
      "SELECT * FROM courier WHERE courier_id = ?",
      [courier.courier_id]
    );

    return rows[0] as Courier;
  }

  async findCourierById(id: string): Promise<Courier | null> {
    const [rows] = await this.pool.execute<RowDataPacket[]>(
      "SELECT * FROM courier WHERE courier_id = ?",
      [id]
    );

    return rows.length > 0 ? (rows[0] as Courier) : null;
  }

  async getAllCouriers(skip = 0, take = 10): Promise<Courier[]> {
    const [rows] = await this.pool.execute<RowDataPacket[]>(
      "SELECT * FROM courier LIMIT ? OFFSET ?",
      [take, skip]
    );

    return rows as Courier[];
  }

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

    updates.push("updated_at = ?");
    values.push(new Date().toISOString(), id);

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
}
