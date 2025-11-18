# MySQL Database Setup Guide

This guide explains how to set up and use the MySQL database connection in this TypeScript/Fastify project using Prisma ORM.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Database Configuration](#database-configuration)
4. [Running Migrations](#running-migrations)
5. [Using the Database](#using-the-database)
6. [Query Examples](#query-examples)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

- MySQL 5.7+ or MySQL 8.0+ installed and running
- Node.js 18+ installed
- Database created (e.g., `ecommerce`)

## Initial Setup

### 1. Install Dependencies (Already Done)

The following packages are already installed:

- `@prisma/client` - Prisma Client for database queries
- `prisma` - Prisma CLI for migrations and schema management

### 2. Create Environment File

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

### 3. Configure Database URL

Edit `.env` and update the `DATABASE_URL`:

```env
DATABASE_URL="mysql://username:password@localhost:3306/database_name"
```

**Format:** `mysql://USER:PASSWORD@HOST:PORT/DATABASE`

**Example:**

```env
DATABASE_URL="mysql://root:mypassword@localhost:3306/ecommerce"
```

## Database Configuration

### Environment Variables

| Variable       | Description                          | Example                                        |
| -------------- | ------------------------------------ | ---------------------------------------------- |
| `DATABASE_URL` | Full MySQL connection string         | `mysql://root:secret@localhost:3306/ecommerce` |
| `NODE_ENV`     | Environment (development/production) | `development`                                  |

### Prisma Schema

The database schema is defined in `prisma/schema.prisma`. Current models:

- **User** - User accounts
- **Product** - Product catalog

## Running Migrations

### 1. Generate Prisma Client

After modifying `schema.prisma`, generate the Prisma Client:

```bash
npx prisma generate
```

### 2. Create and Run Migrations

Create a new migration:

```bash
npx prisma migrate dev --name init
```

This will:

- Create migration files in `prisma/migrations/`
- Apply the migration to your database
- Generate Prisma Client

### 3. Apply Migrations in Production

```bash
npx prisma migrate deploy
```

### 4. Reset Database (Development Only)

⚠️ **Warning:** This will delete all data!

```bash
npx prisma migrate reset
```

## Using the Database

### Accessing Prisma Client in Routes

The Prisma client is available on the Fastify instance:

```typescript
import { FastifyPluginAsync } from "fastify";

const myRoute: FastifyPluginAsync = async (fastify, options) => {
  // Access Prisma client
  const users = await fastify.prisma.user.findMany();

  fastify.get("/example", async (request, reply) => {
    const data = await fastify.prisma.product.findMany();
    return { data };
  });
};

export default myRoute;
```

### Using Database Service

For complex operations, use the `DatabaseService`:

```typescript
import { DatabaseService } from "../../core/database.service.js";

const myRoute: FastifyPluginAsync = async (fastify, options) => {
  const dbService = new DatabaseService(fastify.prisma);

  fastify.get("/users", async (request, reply) => {
    const users = await dbService.getAllUsers();
    return { users };
  });
};
```

## Query Examples

### 1. SELECT - Find Records

````typescript
// Find all users

### 5. Raw SQL Queries (Advanced)

For complex queries not supported by Prisma:

```typescript
// Using template tag (safer - prevents SQL injection)
const result = await fastify.prisma.$queryRaw`
  SELECT * FROM users WHERE email LIKE ${`%@example.com`}
`;

// Using raw string (use with caution)
const products = await fastify.prisma.$queryRawUnsafe(
  "SELECT * FROM products WHERE price > ?",
  100
);
````

### 6. Transactions

```typescript
// Execute multiple operations atomically
const result = await fastify.prisma.$transaction(async (tx) => {
  const user = await tx.user.create({
    data: { email: "test@example.com", password: "hash" },
  });

  const product = await tx.product.create({
    data: { name: "Test Product", price: 99.99 },
  });

  return { user, product };
});
```

### 7. TypeScript Types

Prisma auto-generates TypeScript types:

```typescript
import { User, Product, Prisma } from "@prisma/client";

// Use generated types
const createUser = async (data: Prisma.UserCreateInput): Promise<User> => {
  return fastify.prisma.user.create({ data });
};

// Partial types
type UserUpdate = Prisma.UserUpdateInput;
type ProductWhere = Prisma.ProductWhereInput;
```

## Best Practices

### 1. Connection Management

✅ **DO:**

- Use the Fastify plugin (already configured)
- Let Prisma manage connection pooling
- Use graceful shutdown (already implemented)

❌ **DON'T:**

- Create multiple Prisma Client instances
- Manually manage connections
- Forget to close connections on shutdown

### 2. Error Handling

```typescript
try {
  const user = await fastify.prisma.user.create({ data });
} catch (error: any) {
  // Handle Prisma errors
  if (error.code === "P2002") {
    // Unique constraint violation
    return reply.status(409).send({ error: "Email already exists" });
  }

  if (error.code === "P2025") {
    // Record not found
    return reply.status(404).send({ error: "User not found" });
  }

  // Generic error
  fastify.log.error(error);
  return reply.status(500).send({ error: "Database error" });
}
```

### 3. Query Optimization

```typescript
// ✅ Select only needed fields
const users = await fastify.prisma.user.findMany({
  select: {
    id: true,
    email: true,
    name: true,
    // Don't select password
  },
});

// ✅ Use pagination
const products = await fastify.prisma.product.findMany({
  skip: (page - 1) * limit,
  take: limit,
});

// ✅ Use indexes (define in schema.prisma)
// @@index([email])
```

### 4. Security

```typescript
// ✅ Never expose passwords
const user = await fastify.prisma.user.findUnique({
  where: { id },
  select: {
    id: true,
    email: true,
    name: true,
    // password: false (excluded by default when using select)
  },
});

// ✅ Use parameterized queries (Prisma does this automatically)
const users = await fastify.prisma.user.findMany({
  where: { email: userInput }, // Safe from SQL injection
});
```

## Troubleshooting

### Connection Issues

**Problem:** `Can't reach database server`

**Solutions:**

1. Check MySQL is running: `mysql -u root -p`
2. Verify DATABASE_URL in `.env`
3. Check firewall settings
4. Ensure database exists: `CREATE DATABASE ecommerce;`

### Migration Issues

**Problem:** `Migration failed`

**Solutions:**

```bash
# Check migration status
npx prisma migrate status

# Reset database (development only)
npx prisma migrate reset

# Apply pending migrations
npx prisma migrate deploy
```

### Type Generation Issues

**Problem:** `Cannot find module '@prisma/client'`

**Solution:**

```bash
# Regenerate Prisma Client
npx prisma generate
```

### Performance Issues

**Problem:** Slow queries

**Solutions:**

1. Add indexes in `schema.prisma`:

   ```prisma
   model User {
     @@index([email])
   }
   ```

2. Use `select` to limit fields
3. Enable query logging:
   ```typescript
   const prisma = new PrismaClient({
     log: ["query", "info", "warn", "error"],
   });
   ```

## Useful Commands

```bash
# Generate Prisma Client
npx prisma generate

# Create migration
npx prisma migrate dev --name migration_name

# Apply migrations (production)
npx prisma migrate deploy

# Open Prisma Studio (GUI)
npx prisma studio

# Format schema file
npx prisma format

# Validate schema
npx prisma validate

# Reset database (dev only)
npx prisma migrate reset

# Check migration status
npx prisma migrate status
```

## API Endpoints (Examples)

The following endpoints are available for testing:

### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Products

- `GET /api/products` - Get all products (supports pagination & search)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

## Next Steps

1. **Create your database:**

   ```sql
   CREATE DATABASE ecommerce CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

2. **Run migrations:**

   ```bash
   npx prisma migrate dev --name init
   ```

3. **Start the server:**

   ```bash
   npm run dev
   ```

4. **Test the API:**

   ```bash
   curl http://localhost:3000/api/users
   ```

5. **Open Prisma Studio:**
   ```bash
   npx prisma studio
   ```

## Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Fastify Documentation](https://www.fastify.io/)
- [MySQL Documentation](https://dev.mysql.com/doc/)

const users = await fastify.prisma.user.findMany();

// Find user by ID
const user = await fastify.prisma.user.findUnique({
where: { id: 1 }
});

// Find with conditions
const activeUsers = await fastify.prisma.user.findMany({
where: {
email: { contains: "@example.com" }
}
});

// Pagination
const products = await fastify.prisma.product.findMany({
skip: 0,
take: 10,
orderBy: { createdAt: "desc" }
});

````

### 2. INSERT - Create Records

```typescript
// Create single user
const newUser = await fastify.prisma.user.create({
  data: {
    email: "john@example.com",
    name: "John Doe",
    password: "hashedpassword"
  }
});

// Create multiple products
const products = await fastify.prisma.product.createMany({
  data: [
    { name: "Product 1", price: 99.99, stock: 10 },
    { name: "Product 2", price: 149.99, stock: 5 }
  ]
});
````

### 3. UPDATE - Modify Records

```typescript
// Update user
const updatedUser = await fastify.prisma.user.update({
  where: { id: 1 },
  data: {
    name: "Jane Doe",
  },
});

// Increment stock
const product = await fastify.prisma.product.update({
  where: { id: 1 },
  data: {
    stock: { increment: 5 },
  },
});
```

### 4. DELETE - Remove Records

```typescript
// Delete user
await fastify.prisma.user.delete({
  where: { id: 1 },
});

// Delete many
await fastify.prisma.product.deleteMany({
  where: {
    stock: 0,
  },
});
```
