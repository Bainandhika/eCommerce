/**
 * Database entity types
 * Define TypeScript interfaces for database tables
 */

export interface User {
  user_id: string;
  email: string | null;
  password: string | null;
  address: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Product {
  product_id: string;
  name: string | null;
  price: string | null;
  quantity: number | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Courier {
  courier_id: string;
  name: string | null;
  is_available: number | null;
}

export interface Order {
  order_id: string;
  user_id: string | null;
  product_id: string | null;
  order_quantity: number | null;
  status: "PAID" | "IN TRANSIT" | "DELIVERED" | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Delivery {
  delivery_id: string;
  order_id: string | null;
  courier_id: string | null;
  pick_up_date: string | null;
  delivered_date: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface CreateUserInput {
  email: string;
  password: string;
  address?: string | null;
}

export interface UpdateUserInput {
  email?: string;
  password?: string;
  address?: string | null;
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

export interface CreateCourierInput {
  courier_id: string;
  name?: string | null;
  is_available?: number | null;
}

export interface UpdateCourierInput {
  name?: string | null;
  is_available?: number | null;
}

export interface CreateOrderInput {
  order_id: string;
  user_id?: string | null;
  product_id?: string | null;
  order_quantity?: number | null;
  status?: "PAID" | "IN TRANSIT" | "DELIVERED" | null;
}

export interface UpdateOrderInput {
  user_id?: string | null;
  product_id?: string | null;
  order_quantity?: number | null;
  status?: "PAID" | "IN TRANSIT" | "DELIVERED" | null;
}

export interface CreateDeliveryInput {
  delivery_id: string;
  order_id?: string | null;
  courier_id?: string | null;
  pick_up_date?: string | null;
  delivered_date?: string | null;
}

export interface UpdateDeliveryInput {
  order_id?: string | null;
  courier_id?: string | null;
  pick_up_date?: string | null;
  delivered_date?: string | null;
}
