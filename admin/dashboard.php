<?php
require_once __DIR__ . '/../config.php';
session_start();
if (!isset($_SESSION[ADMIN_SESSION_KEY]) || $_SESSION[ADMIN_SESSION_KEY] !== true) {
    header('Location: login.php'); exit;
}
require_once __DIR__ . '/../db_config.php';
$db = getDB();

$projectCount = $db->query('SELECT COUNT(*) FROM projects')->fetchColumn();
$skillCount   = $db->query('SELECT COUNT(*) FROM skills')->fetchColumn();
$msgCount     = $db->query('SELECT COUNT(*) FROM contact_messages')->fetchColumn();
$unreadCount  = $db->query('SELECT COUNT(*) FROM contact_messages WHERE is_read = 0')->fetchColumn();
$adminUser    = $_SESSION['admin_username'] ?? 'Admin';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard — Admin</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="admin.css">
</head>
<body>
    <?php include 'sidebar.php'; ?>
    <main class="main-content">
        <div class="page-header">
            <h1>Dashboard</h1>
            <p>Welcome back, <strong><?= htmlspecialchars($adminUser) ?></strong>!</p>
        </div>
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon" style="background:linear-gradient(135deg,#6366f1,#818cf8)"><i class="fas fa-folder-open"></i></div>
                <div class="stat-info"><span class="stat-num"><?= $projectCount ?></span><span class="stat-label">Projects</span></div>
            </div>
            <div class="stat-card">
                <div class="stat-icon" style="background:linear-gradient(135deg,#a855f7,#c084fc)"><i class="fas fa-code"></i></div>
                <div class="stat-info"><span class="stat-num"><?= $skillCount ?></span><span class="stat-label">Skills</span></div>
            </div>
            <div class="stat-card">
                <div class="stat-icon" style="background:linear-gradient(135deg,#06b6d4,#22d3ee)"><i class="fas fa-envelope"></i></div>
                <div class="stat-info"><span class="stat-num"><?= $msgCount ?></span><span class="stat-label">Messages</span></div>
            </div>
            <div class="stat-card">
                <div class="stat-icon" style="background:linear-gradient(135deg,#f59e0b,#fbbf24)"><i class="fas fa-bell"></i></div>
                <div class="stat-info"><span class="stat-num"><?= $unreadCount ?></span><span class="stat-label">Unread</span></div>
            </div>
        </div>
        <div class="quick-links">
            <h2>Quick Actions</h2>
            <div class="action-grid">
                <a href="manage_projects.php?action=add" class="action-card"><i class="fas fa-plus-circle"></i><span>Add Project</span></a>
                <a href="manage_skills.php?action=add" class="action-card"><i class="fas fa-plus"></i><span>Add Skill</span></a>
                <a href="manage_projects.php" class="action-card"><i class="fas fa-list"></i><span>All Projects</span></a>
                <a href="manage_messages.php" class="action-card"><i class="fas fa-inbox"></i><span>View Messages</span></a>
                <a href="../index.html" target="_blank" class="action-card"><i class="fas fa-external-link-alt"></i><span>View Portfolio</span></a>
            </div>
        </div>
    </main>
</body>
</html>
