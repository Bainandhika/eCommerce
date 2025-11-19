import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import mysql from "mysql2/promise";
import { config } from "../core/config.js";

// Extend Fastify instance type to include MySQL pool
declare module "fastify" {
  interface FastifyInstance {
    mysql: mysql.Pool;
  }
}

const databasePlugin: FastifyPluginAsync = async (fastify, options) => {
  // Create MySQL connection pool
  const pool = mysql.createPool({
    host: config.database.host,
    port: config.database.port,
    user: config.database.user,
    password: config.database.password,
    database: config.database.database,
    waitForConnections: true,
    connectionLimit: config.database.connectionLimit,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  });

  // Test database connection
  try {
    const connection = await pool.getConnection();
    fastify.log.info("✅ Database connected successfully");
    connection.release();
  } catch (error) {
    fastify.log.error({ err: error }, "❌ Database connection failed");
    throw error;
  }

  // Decorate Fastify instance with MySQL pool
  fastify.decorate("mysql", pool);

  // Add hook to close database connection when app closes
  fastify.addHook("onClose", async (instance) => {
    instance.log.info("Disconnecting from database...");
    await instance.mysql.end();
    instance.log.info("✅ Database disconnected");
  });
};

// Export as Fastify plugin
export default fp(databasePlugin, {
  name: "database",
});
