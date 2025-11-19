/**
 * Shared JSON Schema definitions for Swagger/OpenAPI documentation
 * These schemas are reusable across different endpoints
 */

// ==================== USER SCHEMAS ====================

export const UserSchema = {
  type: "object",
  properties: {
    id: {
      type: "integer",
      description: "User ID",
      example: 1,
    },
    email: {
      type: "string",
      format: "email",
      description: "User email address",
      example: "user@example.com",
    },
    name: {
      type: "string",
      nullable: true,
      description: "User full name",
      example: "John Doe",
    },
    password: {
      type: "string",
      description: "User password (hashed)",
      example: "$2b$10$...",
    },
    createdAt: {
      type: "string",
      format: "date-time",
      description: "User creation timestamp",
      example: "2024-01-01T00:00:00.000Z",
    },
    updatedAt: {
      type: "string",
      format: "date-time",
      description: "User last update timestamp",
      example: "2024-01-01T00:00:00.000Z",
    },
  },
} as const;

export const CreateUserSchema = {
  type: "object",
  required: ["email", "password"],
  properties: {
    email: {
      type: "string",
      format: "email",
      description: "User email address",
      example: "newuser@example.com",
    },
    name: {
      type: "string",
      description: "User full name",
      example: "Jane Smith",
    },
    password: {
      type: "string",
      minLength: 6,
      description: "User password (minimum 6 characters)",
      example: "securePassword123",
    },
  },
} as const;

export const UpdateUserSchema = {
  type: "object",
  properties: {
    email: {
      type: "string",
      format: "email",
      description: "User email address",
      example: "updated@example.com",
    },
    name: {
      type: "string",
      description: "User full name",
      example: "John Updated",
    },
    password: {
      type: "string",
      minLength: 6,
      description: "User password",
      example: "newPassword123",
    },
  },
} as const;

// ==================== PRODUCT SCHEMAS ====================

export const ProductSchema = {
  type: "object",
  properties: {
    id: {
      type: "integer",
      description: "Product ID",
      example: 1,
    },
    name: {
      type: "string",
      description: "Product name",
      example: "Laptop",
    },
    description: {
      type: "string",
      nullable: true,
      description: "Product description",
      example: "High-performance laptop with 16GB RAM",
    },
    price: {
      type: "number",
      format: "decimal",
      description: "Product price",
      example: 999.99,
    },
    stock: {
      type: "integer",
      description: "Available stock quantity",
      example: 50,
    },
    createdAt: {
      type: "string",
      format: "date-time",
      description: "Product creation timestamp",
      example: "2024-01-01T00:00:00.000Z",
    },
    updatedAt: {
      type: "string",
      format: "date-time",
      description: "Product last update timestamp",
      example: "2024-01-01T00:00:00.000Z",
    },
  },
} as const;

export const CreateProductSchema = {
  type: "object",
  required: ["name", "price"],
  properties: {
    name: {
      type: "string",
      description: "Product name",
      example: "Wireless Mouse",
    },
    description: {
      type: "string",
      description: "Product description",
      example: "Ergonomic wireless mouse with USB receiver",
    },
    price: {
      type: "number",
      minimum: 0,
      description: "Product price (must be positive)",
      example: 29.99,
    },
    stock: {
      type: "integer",
      minimum: 0,
      description: "Initial stock quantity",
      example: 100,
    },
  },
} as const;

export const UpdateProductSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      description: "Product name",
      example: "Updated Product Name",
    },
    description: {
      type: "string",
      description: "Product description",
      example: "Updated product description",
    },
    price: {
      type: "number",
      minimum: 0,
      description: "Product price",
      example: 39.99,
    },
    stock: {
      type: "integer",
      minimum: 0,
      description: "Stock quantity",
      example: 75,
    },
  },
} as const;

// ==================== RESPONSE SCHEMAS ====================

export const SuccessResponseSchema = {
  type: "object",
  properties: {
    success: {
      type: "boolean",
      example: true,
    },
    data: {
      type: "object",
      description: "Response data",
    },
  },
} as const;

export const ErrorResponseSchema = {
  type: "object",
  properties: {
    success: {
      type: "boolean",
      example: false,
    },
    error: {
      type: "string",
      description: "Error message",
      example: "An error occurred",
    },
  },
} as const;

export const PaginationSchema = {
  type: "object",
  properties: {
    page: {
      type: "integer",
      description: "Current page number",
      example: 1,
    },
    limit: {
      type: "integer",
      description: "Items per page",
      example: 10,
    },
  },
} as const;

export const DeleteResponseSchema = {
  type: "object",
  properties: {
    success: {
      type: "boolean",
      example: true,
    },
    message: {
      type: "string",
      description: "Success message",
      example: "Resource deleted successfully",
    },
  },
} as const;

// ==================== PARAMETER SCHEMAS ====================

export const IdParamSchema = {
  type: "object",
  required: ["id"],
  properties: {
    id: {
      type: "string",
      description: "Resource ID",
      example: "1",
    },
  },
} as const;

export const PaginationQuerySchema = {
  type: "object",
  properties: {
    page: {
      type: "string",
      description: "Page number",
      example: "1",
    },
    limit: {
      type: "string",
      description: "Items per page",
      example: "10",
    },
  },
} as const;

export const ProductSearchQuerySchema = {
  type: "object",
  properties: {
    page: {
      type: "string",
      description: "Page number",
      example: "1",
    },
    limit: {
      type: "string",
      description: "Items per page",
      example: "10",
    },
    search: {
      type: "string",
      description: "Search term for product name or description",
      example: "laptop",
    },
  },
} as const;
