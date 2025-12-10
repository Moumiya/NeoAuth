<?php
// php/profile.php
header('Content-Type: application/json');
require_once 'db_connect.php';

$token = $_POST['token'] ?? '';
$action = $_POST['action'] ?? '';

if ($token === '') {
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
    exit;
}

$sessionStmt = $pdo->prepare('SELECT email FROM sessions WHERE token = :token AND expiry > datetime("now") LIMIT 1');
$sessionStmt->execute([':token' => $token]);
$session = $sessionStmt->fetch(PDO::FETCH_ASSOC);

if (!$session) {
    echo json_encode(['status' => 'error', 'message' => 'Session expired']);
    exit;
}

$email = $session['email'];

if ($action === 'fetch') {
    $profileStmt = $pdo->prepare('SELECT age, dob, contact FROM user_profiles WHERE email = :email LIMIT 1');
    $profileStmt->execute([':email' => $email]);
    $profile = $profileStmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        'status' => 'success',
        'data' => $profile ?: null
    ]);

} elseif ($action === 'update') {
    $age = isset($_POST['age']) && $_POST['age'] !== '' ? (int) $_POST['age'] : null;
    $dob = trim($_POST['dob'] ?? '');
    $dob = $dob !== '' ? $dob : null;
    $contact = trim($_POST['contact'] ?? '');
    $contact = $contact !== '' ? $contact : null;

    try {
        $upsert = $pdo->prepare('INSERT INTO user_profiles (email, age, dob, contact)
            VALUES (:email, :age, :dob, :contact)
            ON CONFLICT(email) DO UPDATE SET
                age = excluded.age,
                dob = excluded.dob,
                contact = excluded.contact');

        $upsert->execute([
            ':email' => $email,
            ':age' => $age,
            ':dob' => $dob,
            ':contact' => $contact
        ]);

        echo json_encode(['status' => 'success', 'message' => 'Profile updated']);
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Update failed']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid action']);
}
?>