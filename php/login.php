<?php
// php/login.php
header('Content-Type: application/json');
require_once 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    if ($email === '' || $password === '') {
        echo json_encode(['status' => 'error', 'message' => 'Email and password are required']);
        exit;
    }

    $stmt = $pdo->prepare('SELECT id, password FROM users WHERE email = :email LIMIT 1');
    $stmt->execute([':email' => $email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['password'])) {
        try {
            $token = bin2hex(random_bytes(32));
            $expiry = (new DateTime('+1 hour'))->format('Y-m-d H:i:s');

            $insert = $pdo->prepare('INSERT INTO sessions (token, email, expiry) VALUES (:token, :email, :expiry)');
            $insert->execute([
                ':token' => $token,
                ':email' => $email,
                ':expiry' => $expiry
            ]);

            echo json_encode(['status' => 'success', 'token' => $token, 'message' => 'Successfully Logged In']);
        } catch (Exception $e) {
            echo json_encode(['status' => 'error', 'message' => 'Session creation failed']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid credentials']);
    }
}
?>