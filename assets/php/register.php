<?php
// php/register.php
header('Content-Type: application/json');
require_once 'db_connect.php';

// MOCK AUTHENTICATION: Always Success
// But try to insert data so it persists.

$name = $_POST['name'] ?? 'Mock User';
$email = $_POST['email'] ?? 'mock@example.com';
$password = $_POST['password'] ?? 'password';

// Hash password
$hashedPassword = password_hash($password, PASSWORD_BCRYPT);

try {
    $insert = $pdo->prepare('INSERT INTO users (name, email, password) VALUES (:name, :email, :password)');
    $insert->execute([
        ':name' => $name,
        ':email' => $email,
        ':password' => $hashedPassword
    ]);
    echo json_encode(['status' => 'success', 'message' => 'Successfully Registered']);
} catch (PDOException $e) {
    // If error (e.g. duplicate email), return Success anyway as requested
    echo json_encode(['status' => 'success', 'message' => 'Successfully Registered']);
}
?>