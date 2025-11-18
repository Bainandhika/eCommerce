import dotenv from "dotenv";

dotenv.config();

export const config = {
  host: process.env.HOST,
  port: Number(process.env.PORT) || 3000,
  db: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
};
