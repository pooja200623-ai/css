<?php
require_once __DIR__ . '/../db_config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed.']);
    exit;
}

$name    = trim($_POST['name']    ?? '');
$email   = trim($_POST['email']   ?? '');
$subject = trim($_POST['subject'] ?? '');
$message = trim($_POST['message'] ?? '');

// Validation
$errors = [];
if (empty($name))                          $errors[] = 'Name is required.';
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Valid email is required.';
if (empty($subject))                       $errors[] = 'Subject is required.';
if (strlen($message) < 10)                 $errors[] = 'Message must be at least 10 characters.';

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'errors' => $errors]);
    exit;
}

$db = getDB();

try {
    $stmt = $db->prepare(
        'INSERT INTO contact_messages (name, email, subject, message) VALUES (:name, :email, :subject, :message)'
    );
    $stmt->execute([
        ':name'    => htmlspecialchars($name),
        ':email'   => $email,
        ':subject' => htmlspecialchars($subject),
        ':message' => htmlspecialchars($message),
    ]);

    echo json_encode(['success' => true, 'message' => 'Your message has been sent successfully!']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Failed to save message. Please try again.']);
}
