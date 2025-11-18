import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear existing data (optional - comment out if you want to keep existing data)
  console.log("🗑️  Clearing existing data...");
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // Seed Users
  console.log("👥 Seeding users...");
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: "john.doe@example.com",
        name: "John Doe",
        password: "hashed_password_1", // In production, use bcrypt to hash passwords
      },
    }),
    prisma.user.create({
      data: {
        email: "jane.smith@example.com",
        name: "Jane Smith",
        password: "hashed_password_2",
      },
    }),
    prisma.user.create({
      data: {
        email: "bob.wilson@example.com",
        name: "Bob Wilson",
        password: "hashed_password_3",
      },
    }),
  ]);
  console.log(`✅ Created ${users.length} users`);

  // Seed Products
  console.log("📦 Seeding products...");
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: "Laptop Pro 15",
        description: "High-performance laptop with 15-inch display",
        price: 1299.99,
        stock: 25,
      },
    }),
    prisma.product.create({
      data: {
        name: "Wireless Mouse",
        description: "Ergonomic wireless mouse with precision tracking",
        price: 29.99,
        stock: 150,
      },
    }),
    prisma.product.create({
      data: {
        name: "Mechanical Keyboard",
        description: "RGB mechanical keyboard with blue switches",
        price: 89.99,
        stock: 75,
      },
    }),
    prisma.product.create({
      data: {
        name: "USB-C Hub",
        description: "7-in-1 USB-C hub with HDMI and card reader",
        price: 49.99,
        stock: 100,
      },
    }),
    prisma.product.create({
      data: {
        name: "Webcam HD",
        description: "1080p HD webcam with built-in microphone",
        price: 79.99,
        stock: 50,
      },
    }),
    prisma.product.create({
      data: {
        name: "Monitor 27 inch",
        description: "4K UHD monitor with HDR support",
        price: 399.99,
        stock: 30,
      },
    }),
    prisma.product.create({
      data: {
        name: "Desk Lamp LED",
        description: "Adjustable LED desk lamp with touch control",
        price: 34.99,
        stock: 80,
      },
    }),
    prisma.product.create({
      data: {
        name: "Headphones Wireless",
        description: "Noise-cancelling wireless headphones",
        price: 199.99,
        stock: 60,
      },
    }),
    prisma.product.create({
      data: {
        name: "External SSD 1TB",
        description: "Portable SSD with USB 3.2 Gen 2",
        price: 129.99,
        stock: 45,
      },
    }),
    prisma.product.create({
      data: {
        name: "Laptop Stand",
        description: "Aluminum laptop stand with adjustable height",
        price: 39.99,
        stock: 120,
      },
    }),
  ]);
  console.log(`✅ Created ${products.length} products`);

  console.log("🎉 Database seeding completed successfully!");
  console.log(`
📊 Summary:
  - Users: ${users.length}
  - Products: ${products.length}
  `);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

