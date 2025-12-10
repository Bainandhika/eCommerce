import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import {
  CreateUserInput,
  UpdateUserInput,
  User,
} from "./user.schema.js";

export class UserRepo {
  constructor(private readonly pool: Pool) {}

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

  async findUserById(id: string): Promise<User | null> {
    const [rows] = await this.pool.execute<RowDataPacket[]>(
      "SELECT * FROM user WHERE user_id = ?",
      [id]
    );

    return rows.length > 0 ? (rows[0] as User) : null;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const [rows] = await this.pool.execute<RowDataPacket[]>(
      "SELECT * FROM user WHERE email = ?",
      [email]
    );

    return rows.length > 0 ? (rows[0] as User) : null;
  }

  async getAllUsers(skip = 0, take = 10): Promise<User[]> {
    const [rows] = await this.pool.execute<RowDataPacket[]>(
      "SELECT * FROM user ORDER BY created_at DESC LIMIT ? OFFSET ?",
      [take, skip]
    );

    return rows as User[];
  }

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
    values.push(new Date().toISOString(), id);

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
}
