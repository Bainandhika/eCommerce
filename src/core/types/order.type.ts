export type OrderStatus = "PAID" | "IN TRANSIT" | "DELIVERED" | null;

export interface Order {
  order_id: string;
  user_id: string | null;
  product_id: string | null;
  order_quantity: number | null;
  status: OrderStatus;
  created_at: string | null;
  updated_at: string | null;
}

export interface CreateOrderInput {
  order_id: string;
  user_id?: string | null;
  product_id?: string | null;
  order_quantity?: number | null;
  status?: OrderStatus;
}

export interface UpdateOrderInput {
  user_id?: string | null;
  product_id?: string | null;
  order_quantity?: number | null;
  status?: OrderStatus;
}