/**
 * Shared JSON Schema definitions for Swagger/OpenAPI documentation
 * These schemas are reusable across different endpoints
 */

// ==================== USER SCHEMAS ====================

export const UserSchema = {
  type: "object",
  properties: {
    user_id: {
      type: "string",
      description: "User ID",
    },
    email: {
      type: "string",
      format: "email",
      description: "User email address",
    },
    password: {
      type: "string",
      description: "User password (hashed)",
    },
    address: {
      type: "string",
      nullable: true,
      description: "User address",
    },
    created_at: {
      type: "string",
      description: "User creation timestamp",
    },
    updated_at: {
      type: "string",
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
    password: {
      type: "string",
      minLength: 6,
      description: "User password (minimum 6 characters)",
    },
    address: {
      type: "string",
      description: "User address",
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
    password: {
      type: "string",
      minLength: 6,
      description: "User password",
    },
    address: {
      type: "string",
      description: "User address",
    },
  },
} as const;

// ==================== PRODUCT SCHEMAS ====================

export const ProductSchema = {
  type: "object",
  properties: {
    product_id: {
      type: "string",
      description: "Product ID",
    },
    name: {
      type: "string",
      description: "Product name",
    },
    price: {
      type: "string",
      description: "Product price",
    },
    quantity: {
      type: "integer",
      description: "Available quantity",
    },
    created_at: {
      type: "string",
      description: "Product creation timestamp",
    },
    updated_at: {
      type: "string",
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
    price: {
      type: "string",
      description: "Product price",
    },
    quantity: {
      type: "integer",
      minimum: 0,
      description: "Initial quantity",
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
    price: {
      type: "string",
      description: "Product price",
    },
    quantity: {
      type: "integer",
      minimum: 0,
      description: "Product quantity",
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
      description: "Search term for product name",
    },
  },
} as const;

// ==================== COURIER SCHEMAS ====================

export const CourierSchema = {
  type: "object",
  properties: {
    courier_id: {
      type: "string",
      description: "Courier ID",
    },
    name: {
      type: "string",
      nullable: true,
      description: "Courier name",
    },
    is_available: {
      type: "integer",
      description: "Courier availability status (0 or 1)",
    },
  },
} as const;

export const CreateCourierSchema = {
  type: "object",
  required: ["courier_id"],
  properties: {
    courier_id: {
      type: "string",
      description: "Courier ID",
    },
    name: {
      type: "string",
      description: "Courier name",
    },
    is_available: {
      type: "integer",
      description: "Courier availability status (0 or 1)",
    },
  },
} as const;

export const UpdateCourierSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      description: "Courier name",
    },
    is_available: {
      type: "integer",
      description: "Courier availability status (0 or 1)",
    },
  },
} as const;

// ==================== ORDER SCHEMAS ====================

export const OrderSchema = {
  type: "object",
  properties: {
    order_id: {
      type: "string",
      description: "Order ID",
    },
    user_id: {
      type: "string",
      nullable: true,
      description: "User ID",
    },
    product_id: {
      type: "string",
      nullable: true,
      description: "Product ID",
    },
    order_quantity: {
      type: "integer",
      nullable: true,
      description: "Order quantity",
    },
    status: {
      type: "string",
      enum: ["PAID", "IN TRANSIT", "DELIVERED"],
      nullable: true,
      description: "Order status",
    },
    created_at: {
      type: "string",
      nullable: true,
      description: "Order creation timestamp",
    },
    updated_at: {
      type: "string",
      nullable: true,
      description: "Order last update timestamp",
    },
  },
} as const;

export const CreateOrderSchema = {
  type: "object",
  required: ["order_id"],
  properties: {
    order_id: {
      type: "string",
      description: "Order ID",
    },
    user_id: {
      type: "string",
      description: "User ID",
    },
    product_id: {
      type: "string",
      description: "Product ID",
    },
    order_quantity: {
      type: "integer",
      description: "Order quantity",
    },
    status: {
      type: "string",
      enum: ["PAID", "IN TRANSIT", "DELIVERED"],
      description: "Order status",
    },
  },
} as const;

export const UpdateOrderSchema = {
  type: "object",
  properties: {
    user_id: {
      type: "string",
      description: "User ID",
    },
    product_id: {
      type: "string",
      description: "Product ID",
    },
    order_quantity: {
      type: "integer",
      description: "Order quantity",
    },
    status: {
      type: "string",
      enum: ["PAID", "IN TRANSIT", "DELIVERED"],
      description: "Order status",
    },
  },
} as const;

// ==================== DELIVERY SCHEMAS ====================

export const DeliverySchema = {
  type: "object",
  properties: {
    delivery_id: {
      type: "string",
      description: "Delivery ID",
    },
    order_id: {
      type: "string",
      nullable: true,
      description: "Order ID",
    },
    courier_id: {
      type: "string",
      nullable: true,
      description: "Courier ID",
    },
    pick_up_date: {
      type: "string",
      nullable: true,
      description: "Pick up date",
    },
    delivered_date: {
      type: "string",
      nullable: true,
      description: "Delivered date",
    },
    created_at: {
      type: "string",
      nullable: true,
      description: "Delivery creation timestamp",
    },
    updated_at: {
      type: "string",
      nullable: true,
      description: "Delivery last update timestamp",
    },
  },
} as const;

export const CreateDeliverySchema = {
  type: "object",
  required: ["delivery_id"],
  properties: {
    delivery_id: {
      type: "string",
      description: "Delivery ID",
    },
    order_id: {
      type: "string",
      description: "Order ID",
    },
    courier_id: {
      type: "string",
      description: "Courier ID",
    },
    pick_up_date: {
      type: "string",
      description: "Pick up date",
    },
    delivered_date: {
      type: "string",
      description: "Delivered date",
    },
  },
} as const;

export const UpdateDeliverySchema = {
  type: "object",
  properties: {
    order_id: {
      type: "string",
      description: "Order ID",
    },
    courier_id: {
      type: "string",
      description: "Courier ID",
    },
    pick_up_date: {
      type: "string",
      description: "Pick up date",
    },
    delivered_date: {
      type: "string",
      description: "Delivered date",
    },
  },
} as const;
