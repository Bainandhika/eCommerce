/**
 * Database entity types
 * Define TypeScript interfaces for database tables
 */

export interface User {
  id: number;
  email: string;
  name: string | null;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: string; // Decimal stored as string
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  email: string;
  name?: string | null;
  password: string;
}

export interface UpdateUserInput {
  email?: string;
  name?: string | null;
  password?: string;
}

export interface CreateProductInput {
  name: string;
  description?: string | null;
  price: number | string;
  stock?: number;
}

export interface UpdateProductInput {
  name?: string;
  description?: string | null;
  price?: number | string;
  stock?: number;
}

