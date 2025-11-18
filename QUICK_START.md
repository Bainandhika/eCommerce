# Quick Start Guide - MySQL Database Setup

## 🚀 Get Started in 5 Minutes

### Step 1: Create Database

```sql
CREATE DATABASE ecommerce CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Step 2: Configure Environment

Create `.env` file:

```bash
cp .env.example .env
```

Update `DATABASE_URL` in `.env`:

```env
DATABASE_URL="mysql://root:yourpassword@localhost:3306/ecommerce"
```

### Step 3: Generate Prisma Client & Run Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Create and apply migrations
npx prisma migrate dev --name init
```

### Step 4: Start the Server

```bash
npm run dev
```

### Step 5: Test the API

```bash
# Create a user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User","password":"password123"}'

# Get all users
curl http://localhost:3000/api/users

# Create a product
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Sample Product","description":"A great product","price":99.99,"stock":10}'

# Get all products
curl http://localhost:3000/api/products
```

## 📊 Open Prisma Studio (Database GUI)

```bash
npx prisma studio
```

Visit: http://localhost:5555

## 📁 Project Structure

```
eCommerce/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── core/
│   │   ├── config.ts          # Configuration
│   │   └── database.service.ts # Database service layer
│   ├── plugins/
│   │   └── database.ts        # Prisma plugin
│   ├── modules/
│   │   ├── users/
│   │   │   └── index.ts       # User routes
│   │   └── products/
│   │       └── index.ts       # Product routes
│   ├── app.ts                 # Fastify app setup
│   └── server.ts              # Server entry point
├── .env                       # Environment variables
└── DATABASE_SETUP.md          # Full documentation
```

## 🔑 Key Features

✅ **Prisma ORM** - Type-safe database queries  
✅ **Connection Pooling** - Automatic connection management  
✅ **Graceful Shutdown** - Proper cleanup on server stop  
✅ **TypeScript Types** - Auto-generated from schema  
✅ **Migration System** - Version control for database schema  
✅ **Error Handling** - Comprehensive error handling  
✅ **Example Routes** - Users and Products CRUD operations  

## 📖 Usage Examples

### In Your Routes

```typescript
import { FastifyPluginAsync } from "fastify";

const myRoute: FastifyPluginAsync = async (fastify, options) => {
  // Direct Prisma access
  fastify.get("/example", async (request, reply) => {
    const users = await fastify.prisma.user.findMany();
    return { users };
  });
};

export default myRoute;
```

### Using Database Service

```typescript
import { DatabaseService } from "../../core/database.service.js";

const myRoute: FastifyPluginAsync = async (fastify, options) => {
  const db = new DatabaseService(fastify.prisma);
  
  fastify.get("/users", async (request, reply) => {
    const users = await db.getAllUsers();
    return { users };
  });
};
```

## 🛠️ Common Commands

```bash
# Development
npm run dev              # Start dev server with hot reload
npm run build            # Build TypeScript
npm start                # Start production server

# Database
npx prisma generate      # Generate Prisma Client
npx prisma migrate dev   # Create & apply migration
npx prisma studio        # Open database GUI
npx prisma format        # Format schema file

# Testing
npm test                 # Run tests
```

## 🆘 Troubleshooting

**Can't connect to database?**
- Check MySQL is running
- Verify DATABASE_URL in `.env`
- Ensure database exists

**Type errors?**
```bash
npx prisma generate
```

**Migration failed?**
```bash
npx prisma migrate reset  # Dev only - deletes data!
```

## 📚 Full Documentation

See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for complete documentation.

## 🎯 Next Steps

1. Modify `prisma/schema.prisma` to add your models
2. Run `npx prisma migrate dev --name your_migration_name`
3. Create routes in `src/modules/`
4. Use `fastify.prisma` or `DatabaseService` for queries

Happy coding! 🚀

