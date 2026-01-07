-- Database initialization script
-- This script runs automatically when the MySQL container is first created

-- Ensure the database exists
CREATE DATABASE IF NOT EXISTS ecommerce;

USE ecommerce;

-- ==================== USER TABLE ====================
CREATE TABLE IF NOT EXISTS user (
    user_id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================== PRODUCT TABLE ====================
CREATE TABLE IF NOT EXISTS product (
    product_id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================== ORDER TABLE ====================
CREATE TABLE IF NOT EXISTS `order` (
    order_id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255),
    product_id VARCHAR(255),
    order_quantity INT,
    status ENUM('PAID', 'IN TRANSIT', 'DELIVERED') DEFAULT 'PAID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE SET NULL,
    FOREIGN KEY (product_id) REFERENCES product(product_id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_product_id (product_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================== COURIER TABLE ====================
CREATE TABLE IF NOT EXISTS courier (
    courier_id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255),
    is_available TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_is_available (is_available)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================== DELIVERY TABLE ====================
CREATE TABLE IF NOT EXISTS delivery (
    delivery_id VARCHAR(255) PRIMARY KEY,
    order_id VARCHAR(255),
    courier_id VARCHAR(255),
    pick_up_date TIMESTAMP NULL,
    delivered_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES `order`(order_id) ON DELETE SET NULL,
    FOREIGN KEY (courier_id) REFERENCES courier(courier_id) ON DELETE SET NULL,
    INDEX idx_order_id (order_id),
    INDEX idx_courier_id (courier_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Grant privileges (optional, as the user is already created by docker-compose)
GRANT ALL PRIVILEGES ON ecommerce.* TO 'ecommerce'@'%';
FLUSH PRIVILEGES;

