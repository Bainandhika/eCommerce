import dotenv from "dotenv";

dotenv.config();

export const config = {
  host: process.env.HOST || "localhost",
  port: Number(process.env.PORT) || 3000,
  database: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "secret",
    database: process.env.DB_NAME || "ecommerce",
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 10,
  },
  jwt: {
    secret: process.env.JWT_SECRET || "supersecretkey",
  },
  nodeEnv: process.env.NODE_ENV || "development",
};
