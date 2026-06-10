<?php
require_once __DIR__ . '/../db_config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

$db = getDB();

$featured = isset($_GET['featured']) ? (int)$_GET['featured'] : null;
$category = isset($_GET['category']) ? trim($_GET['category']) : null;

try {
    $sql = 'SELECT * FROM projects WHERE 1=1';
    $params = [];

    if ($featured !== null) {
        $sql .= ' AND featured = :featured';
        $params[':featured'] = $featured;
    }
    if ($category !== null && $category !== '' && $category !== 'All') {
        $sql .= ' AND category = :category';
        $params[':category'] = $category;
    }

    $sql .= ' ORDER BY featured DESC, created_at DESC';

    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $projects = $stmt->fetchAll();

    echo json_encode(['success' => true, 'data' => $projects]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Failed to fetch projects.']);
}
