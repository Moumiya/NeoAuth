<?php
// php/login.php
header('Content-Type: application/json');
require_once 'db_connect.php';

// MOCK AUTHENTICATION: Always Success for ANY credentials
// But we must create a session so profile.php works.

$email = trim($_POST['email'] ?? '');

// If email is empty, just make one up or fail? User said "any email".
if ($email === '')
    $email = 'mock_user@example.com';

try {
    $token = bin2hex(random_bytes(32));
    $expiry = (new DateTime('+1 hour'))->format('Y-m-d H:i:s');

    // Insert session (Ignoring if user exists or not, just session)
    // Note: Foreign key on sessions.email might fail if user doesn't exist in 'users' table.
    // So we should try to ensure user exists or ignore FK. 
    // db_connect.php has 'PRAGMA foreign_keys = ON'.
    // So we must Insert user if missing? Too complex?
    // Let's just Insert Session. If it fails due to FK, we catch and return success anyway (Mock).
    // Actually, to make it nice, let's try to auto-create user if missing.

    $check = $pdo->prepare("SELECT 1 FROM users WHERE email = ?");
    $check->execute([$email]);
    if (!$check->fetch()) {
        $u = $pdo->prepare("INSERT INTO users (name, email, password) VALUES ('Mock User', ?, 'mockpass')");
        $u->execute([$email]);
    }

    $insert = $pdo->prepare('INSERT INTO sessions (token, email, expiry) VALUES (:token, :email, :expiry)');
    $insert->execute([
        ':token' => $token,
        ':email' => $email,
        ':expiry' => $expiry
    ]);

    echo json_encode(['status' => 'success', 'token' => $token, 'message' => 'Successfully Logged In']);
} catch (Exception $e) {
    // Even if DB fails, return success as requested by "Mock" requirement
    // But provide a fake token so JS doesn't crash immediately
    echo json_encode(['status' => 'success', 'token' => 'mock_token_' . time(), 'message' => 'Successfully Logged In (DB Error Ignored)']);
}
?>