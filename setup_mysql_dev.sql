-- Create database if not exists
CREATE DATABASE IF NOT EXISTS wallet_db;

-- Create user if not exists
CREATE USER IF NOT EXISTS 'wallet'@'localhost' IDENTIFIED BY '12345aA@';

-- Grant privileges
GRANT ALL PRIVILEGES ON wallet_db.* TO 'wallet'@'localhost';

-- Apply changes immediately
FLUSH PRIVILEGES;

