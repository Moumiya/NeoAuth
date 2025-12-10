-- schema.sql
-- Table Structure for 'users'
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table Structure for 'user_profiles' (MongoDB replacement if using MySQL for everything, or SQL fallback)
CREATE TABLE IF NOT EXISTS user_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    age INT,
    dob DATE,
    contact VARCHAR(20),
    FOREIGN KEY (email) REFERENCES users(email) ON DELETE CASCADE
);

-- Table Structure for 'sessions' (Redis replacement or fallback)
CREATE TABLE IF NOT EXISTS sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL,
    expiry DATETIME NOT NULL
);
