<?php
// php/logout.php
require_once 'db_connect.php';

$token = $_POST['token'] ?? '';

if ($token !== '') {
    $stmt = $pdo->prepare('DELETE FROM sessions WHERE token = :token');
    $stmt->execute([':token' => $token]);
}

echo json_encode(['status' => 'success']);
?>