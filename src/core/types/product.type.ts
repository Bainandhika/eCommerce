export interface Product {
  product_id: string;
  name: string | null;
  price: string | null;
  quantity: number | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface CreateProductInput {
  name: string;
  price: string;
  quantity?: number;
}

export interface UpdateProductInput {
  name?: string;
  price?: string;
  quantity?: number;
}