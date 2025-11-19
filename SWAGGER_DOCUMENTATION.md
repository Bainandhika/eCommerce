# Swagger/OpenAPI Documentation Guide

## 📚 Overview

This eCommerce API now includes comprehensive Swagger/OpenAPI 3.0 documentation. The interactive API documentation is automatically generated from the route schemas and is accessible through a web interface.

## 🚀 Quick Start

### 1. Start the Server

```bash
npm run dev
```

### 2. Access Swagger UI

Open your browser and navigate to:

```
http://localhost:3000/documentation
```

## 📁 Implementation Structure

### Files Created/Modified

1. **`src/plugins/swagger.ts`** - Swagger plugin configuration
2. **`src/schemas/index.ts`** - Reusable JSON schemas for all models
3. **`src/modules/users/index.ts`** - Updated with Swagger schemas
4. **`src/modules/products/index.ts`** - Updated with Swagger schemas

## 🔧 Configuration Details

### Swagger Plugin (`src/plugins/swagger.ts`)

The Swagger plugin is configured with:

- **OpenAPI Version**: 3.0.0
- **API Information**: Title, description, version, contact, and license
- **Servers**: Development (localhost:3000) and Production URLs
- **Tags**: Organized by resource (users, products)
- **Security Schemes**: JWT Bearer authentication support
- **UI Configuration**: Enhanced with syntax highlighting, filtering, and deep linking

### Schema Definitions (`src/schemas/index.ts`)

Comprehensive schemas for:

#### User Schemas

- `UserSchema` - Complete user object with all fields
- `CreateUserSchema` - Schema for creating new users
- `UpdateUserSchema` - Schema for updating existing users

#### Product Schemas

- `ProductSchema` - Complete product object with all fields
- `CreateProductSchema` - Schema for creating new products
- `UpdateProductSchema` - Schema for updating existing products

#### Response Schemas

- `SuccessResponseSchema` - Standard success response
- `ErrorResponseSchema` - Standard error response
- `DeleteResponseSchema` - Delete operation response
- `PaginationSchema` - Pagination metadata

#### Parameter Schemas

- `IdParamSchema` - ID path parameter
- `PaginationQuerySchema` - Pagination query parameters
- `ProductSearchQuerySchema` - Product search with pagination

## 📖 API Endpoints Documentation

### Users Endpoints

#### GET /api/users

- **Description**: Get all users
- **Tags**: users
- **Response**: Array of user objects
- **Status Codes**: 200 (Success), 500 (Error)

#### GET /api/users/:id

- **Description**: Get a single user by ID
- **Tags**: users
- **Parameters**: id (path parameter)
- **Response**: User object
- **Status Codes**: 200 (Success), 404 (Not Found), 500 (Error)

#### POST /api/users

- **Description**: Create a new user
- **Tags**: users
- **Request Body**: CreateUserSchema (email, name, password)
- **Response**: Created user object
- **Status Codes**: 201 (Created), 409 (Email exists), 500 (Error)

#### PUT /api/users/:id

- **Description**: Update an existing user
- **Tags**: users
- **Parameters**: id (path parameter)
- **Request Body**: UpdateUserSchema (email, name, password - all optional)
- **Response**: Updated user object
- **Status Codes**: 200 (Success), 404 (Not Found), 500 (Error)

#### DELETE /api/users/:id

- **Description**: Delete a user
- **Tags**: users
- **Parameters**: id (path parameter)
- **Response**: Success message
- **Status Codes**: 200 (Success), 404 (Not Found), 500 (Error)

### Products Endpoints

#### GET /api/products

- **Description**: Get all products with pagination and optional search
- **Tags**: products
- **Query Parameters**: page, limit, search
- **Response**: Array of product objects with pagination metadata
- **Status Codes**: 200 (Success), 500 (Error)

#### GET /api/products/:id

- **Description**: Get a single product by ID
- **Tags**: products
- **Parameters**: id (path parameter)
- **Response**: Product object
- **Status Codes**: 200 (Success), 404 (Not Found), 500 (Error)

#### POST /api/products

- **Description**: Create a new product
- **Tags**: products
- **Request Body**: CreateProductSchema (name, description, price, stock)
- **Response**: Created product object
- **Status Codes**: 201 (Created), 500 (Error)

#### PUT /api/products/:id

- **Description**: Update an existing product
- **Tags**: products
- **Parameters**: id (path parameter)
- **Request Body**: UpdateProductSchema (name, description, price, stock - all optional)
- **Response**: Updated product object
- **Status Codes**: 200 (Success), 404 (Not Found), 500 (Error)

#### DELETE /api/products/:id

- **Description**: Delete a product
- **Tags**: products
- **Parameters**: id (path parameter)
- **Response**: Success message
- **Status Codes**: 200 (Success), 404 (Not Found), 500 (Error)

## 🎨 Swagger UI Features

The Swagger UI includes:

- **Interactive Testing**: Try out API endpoints directly from the browser
- **Request/Response Examples**: See example data for all endpoints
- **Schema Validation**: View required fields and data types
- **Syntax Highlighting**: Monokai theme for better readability
- **Deep Linking**: Share direct links to specific endpoints
- **Filtering**: Search and filter endpoints
- **Request Duration**: See how long each request takes

## 💡 How to Add Documentation to New Endpoints

When creating new endpoints, follow this pattern:

```typescript
import { YourSchema } from "../../schemas/index.js";

fastify.get(
  "/your-route",
  {
    schema: {
      description: "Description of what this endpoint does",
      tags: ["your-tag"],
      querystring: YourQuerySchema, // Optional
      params: YourParamsSchema, // Optional
      body: YourBodySchema, // Optional
      response: {
        200: {
          description: "Success response",
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: YourDataSchema,
          },
        },
        404: ErrorResponseSchema,
        500: ErrorResponseSchema,
      },
    },
  },
  async (request, reply) => {
    // Your handler logic
  }
);
```

## 📝 Schema Definition Example

Add new schemas to `src/schemas/index.ts`:

```typescript
export const YourSchema = {
  type: "object",
  required: ["field1", "field2"],
  properties: {
    field1: {
      type: "string",
      description: "Description of field1",
      example: "example value",
    },
    field2: {
      type: "number",
      minimum: 0,
      description: "Description of field2",
      example: 42,
    },
  },
} as const;
```

## 🔐 Authentication (Future Enhancement)

The Swagger configuration includes JWT Bearer authentication scheme:

```yaml
securitySchemes:
  bearerAuth:
    type: http
    scheme: bearer
    bearerFormat: JWT
```

To protect an endpoint, add to the schema:

```typescript
schema: {
  security: [{ bearerAuth: [] }],
  // ... rest of schema
}
```

## 🌐 Accessing the OpenAPI Specification

### JSON Format

```
http://localhost:3000/documentation/json
```

### YAML Format

```
http://localhost:3000/documentation/yaml
```

You can use these URLs to:

- Import into Postman
- Generate client SDKs
- Share with frontend developers
- Integrate with API testing tools

## 🛠️ Customization

### Changing the Documentation Route

Edit `src/plugins/swagger.ts`:

```typescript
await fastify.register(swaggerUI, {
  routePrefix: "/api-docs", // Change this
  // ... rest of config
});
```

### Updating API Information

Edit the `info` section in `src/plugins/swagger.ts`:

```typescript
info: {
  title: "Your API Title",
  description: "Your API Description",
  version: "2.0.0",
  // ... etc
}
```

### Adding More Servers

Edit the `servers` array in `src/plugins/swagger.ts`:

```typescript
servers: [
  {
    url: "http://localhost:3000",
    description: "Development",
  },
  {
    url: "https://staging.yourapi.com",
    description: "Staging",
  },
  {
    url: "https://api.yourapi.com",
    description: "Production",
  },
];
```

## ✅ Benefits

1. **Auto-generated Documentation**: No need to manually write API docs
2. **Always Up-to-date**: Documentation updates automatically with code changes
3. **Interactive Testing**: Test endpoints without Postman or curl
4. **Type Safety**: Schemas validate requests and responses
5. **Developer Experience**: Easy for frontend developers to understand the API
6. **Client Generation**: Can generate client SDKs from the OpenAPI spec
7. **API Versioning**: Easy to track API changes over time

## 🚨 Important Notes

- All schemas are defined using JSON Schema format
- Fastify automatically validates requests against the schemas
- Invalid requests are rejected with detailed error messages
- The Swagger UI is only for development; consider disabling in production or adding authentication
- Keep schemas in sync with your Prisma models for consistency
