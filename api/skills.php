<?php
require_once __DIR__ . '/../db_config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$db = getDB();

try {
    $stmt = $db->query('SELECT * FROM skills ORDER BY category, proficiency DESC');
    $skills = $stmt->fetchAll();

    // Group by category
    $grouped = [];
    foreach ($skills as $skill) {
        $grouped[$skill['category']][] = $skill;
    }

    echo json_encode(['success' => true, 'data' => $grouped]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Failed to fetch skills.']);
}
