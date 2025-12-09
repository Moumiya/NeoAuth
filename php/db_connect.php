<?php
// php/db_connect.php

// Disable default error display to prevent HTML breaking JSON responses
ini_set('display_errors', 0);
error_reporting(E_ALL);

// Custom error handler to return JSON and stop execution
set_error_handler(function ($errno, $errstr) {
    echo json_encode(['status' => 'error', 'message' => "Server Error: $errstr"]);
    exit;
});

// Optional: Composer Autoload
$autoloadPath = __DIR__ . '/../vendor/autoload.php';
if (file_exists($autoloadPath)) {
    require_once $autoloadPath;
}

// SQLite connection setup (lightweight replacement for MySQL)
if (!extension_loaded('sqlite3')) {
    echo json_encode(['status' => 'error', 'message' => 'SQLite3 extension is not enabled']);
    exit;
}

$databaseDir = __DIR__ . '/../data';
$databasePath = $databaseDir . '/app.db';

if (!is_dir($databaseDir)) {
    mkdir($databaseDir, 0755, true);
}

try {
    $pdo = new PDO('sqlite:' . $databasePath);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->exec('PRAGMA foreign_keys = ON');
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed']);
    exit;
}

// Create schema if it does not exist
$pdo->exec('CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    reg_date DATETIME DEFAULT CURRENT_TIMESTAMP
)');

$pdo->exec('CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    expiry DATETIME NOT NULL,
    FOREIGN KEY (email) REFERENCES users(email) ON DELETE CASCADE
)');

$pdo->exec('CREATE TABLE IF NOT EXISTS user_profiles (
    email TEXT PRIMARY KEY,
    age INTEGER,
    dob TEXT,
    contact TEXT,
    FOREIGN KEY (email) REFERENCES users(email) ON DELETE CASCADE
)');
?>