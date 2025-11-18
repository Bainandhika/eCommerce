import dotenv from "dotenv";

dotenv.config();

export const config = {
  host: process.env.HOST || "localhost",
  port: Number(process.env.PORT) || 3000,
  database: {
    url:
      process.env.DATABASE_URL ||
      "mysql://root:secret@localhost:3306/ecommerce",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "supersecretkey",
  },
  nodeEnv: process.env.NODE_ENV || "development",
};
