-- Database initialization script
-- This script runs automatically when the MySQL container is first created

-- Ensure the database exists
CREATE DATABASE IF NOT EXISTS ecommerce;

USE ecommerce;

-- Add any initial table creation or seed data here
-- Example:
-- CREATE TABLE IF NOT EXISTS users (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     username VARCHAR(255) NOT NULL,
--     email VARCHAR(255) NOT NULL UNIQUE,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- Grant privileges (optional, as the user is already created by docker-compose)
GRANT ALL PRIVILEGES ON ecommerce.* TO 'ecommerce'@'%';
FLUSH PRIVILEGES;

