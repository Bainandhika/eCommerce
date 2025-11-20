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
    },
    email: {
      type: "string",
      format: "email",
      description: "User email address",
    },
    name: {
      type: "string",
      nullable: true,
      description: "User full name",
    },
    password: {
      type: "string",
      description: "User password (hashed)",
    },
    createdAt: {
      type: "string",
      format: "date-time",
      description: "User creation timestamp",
    },
    updatedAt: {
      type: "string",
      format: "date-time",
      description: "User last update timestamp",
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
    },
    name: {
      type: "string",
      description: "User full name",
    },
    password: {
      type: "string",
      minLength: 6,
      description: "User password (minimum 6 characters)",
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
    },
    name: {
      type: "string",
      description: "User full name",
    },
    password: {
      type: "string",
      minLength: 6,
      description: "User password",
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
    },
    name: {
      type: "string",
      description: "Product name",
    },
    description: {
      type: "string",
      nullable: true,
      description: "Product description",
    },
    price: {
      type: "number",
      format: "decimal",
      description: "Product price",
    },
    stock: {
      type: "integer",
      description: "Available stock quantity",
    },
    createdAt: {
      type: "string",
      format: "date-time",
      description: "Product creation timestamp",
    },
    updatedAt: {
      type: "string",
      format: "date-time",
      description: "Product last update timestamp",
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
    },
    description: {
      type: "string",
      description: "Product description",
    },
    price: {
      type: "number",
      minimum: 0,
      description: "Product price (must be positive)",
    },
    stock: {
      type: "integer",
      minimum: 0,
      description: "Initial stock quantity",
    },
  },
} as const;

export const UpdateProductSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      description: "Product name",
    },
    description: {
      type: "string",
      description: "Product description",
    },
    price: {
      type: "number",
      minimum: 0,
      description: "Product price",
    },
    stock: {
      type: "integer",
      minimum: 0,
      description: "Stock quantity",
    },
  },
} as const;

// ==================== RESPONSE SCHEMAS ====================

export const SuccessResponseSchema = {
  type: "object",
  properties: {
    success: {
      type: "boolean",
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
    },
    error: {
      type: "string",
      description: "Error message",
    },
  },
} as const;

export const PaginationSchema = {
  type: "object",
  properties: {
    page: {
      type: "integer",
      description: "Current page number",
    },
    limit: {
      type: "integer",
      description: "Items per page",
    },
  },
} as const;

export const DeleteResponseSchema = {
  type: "object",
  properties: {
    success: {
      type: "boolean",
    },
    message: {
      type: "string",
      description: "Success message",
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
    },
  },
} as const;

export const PaginationQuerySchema = {
  type: "object",
  properties: {
    page: {
      type: "string",
      description: "Page number",
    },
    limit: {
      type: "string",
      description: "Items per page",
    },
  },
} as const;

export const ProductSearchQuerySchema = {
  type: "object",
  properties: {
    page: {
      type: "string",
      description: "Page number",
    },
    limit: {
      type: "string",
      description: "Items per page",
    },
    search: {
      type: "string",
      description: "Search term for product name or description",
    },
  },
} as const;
