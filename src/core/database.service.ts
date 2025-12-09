import type { Pool, RowDataPacket} from "mysql2/promise";

export class DatabaseService {
  constructor(private readonly pool: Pool) {}

  async executeRawQuery<T = any>(
    query: string,
    params: any[] = []
  ): Promise<T> {
    const [rows] = await this.pool.execute<RowDataPacket[]>(query, params);
    return rows as T;
  }
}
