import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { CreateProductInput, Product, UpdateProductInput } from "./product.schema.js";

export class ProductRepo {
  constructor(private readonly pool: Pool) {}

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

  async findProductById(id: string): Promise<Product | null> {
    const [rows] = await this.pool.execute<RowDataPacket[]>(
      "SELECT * FROM product WHERE product_id = ?",
      [id]
    );

    return rows.length > 0 ? (rows[0] as Product) : null;
  }

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
    values.push(new Date().toISOString(), id);

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
}
