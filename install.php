<?php
/**
 * Portfolio Installer
 * Visit: http://localhost/dmportolio/install.php
 * Automatically creates the database, tables, and seed data.
 * DELETE THIS FILE after successful installation.
 */

define('DB_HOST',    'localhost');
define('DB_PORT',    '3306');
define('DB_USER',    'root');
define('DB_PASS',    '');
define('DB_NAME',    'portfolio_db');
define('DB_CHARSET', 'utf8mb4');

$steps = [];
$success = true;

try {
    // 1. Connect WITHOUT a database (to create it)
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";charset=" . DB_CHARSET,
        DB_USER, DB_PASS,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    $steps[] = ['ok', 'Connected to MySQL server'];

    // 2. Create Database
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `" . DB_NAME . "` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    $steps[] = ['ok', 'Database <strong>portfolio_db</strong> created (or already exists)'];

    // 3. Select Database
    $pdo->exec("USE `" . DB_NAME . "`");
    $steps[] = ['ok', 'Switched to portfolio_db'];

    // 4. Create Tables
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS admin_users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    ");
    $steps[] = ['ok', 'Table <strong>admin_users</strong> created'];

    $pdo->exec("
        CREATE TABLE IF NOT EXISTS projects (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(150) NOT NULL,
            description TEXT NOT NULL,
            tech_stack VARCHAR(255) NOT NULL,
            live_url VARCHAR(300) DEFAULT NULL,
            github_url VARCHAR(300) DEFAULT NULL,
            image VARCHAR(300) DEFAULT 'assets/images/project-placeholder.jpg',
            category VARCHAR(60) DEFAULT 'Web',
            featured TINYINT(1) DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    ");
    $steps[] = ['ok', 'Table <strong>projects</strong> created'];

    $pdo->exec("
        CREATE TABLE IF NOT EXISTS skills (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(80) NOT NULL,
            category VARCHAR(60) NOT NULL DEFAULT 'Frontend',
            proficiency INT NOT NULL DEFAULT 80,
            icon_class VARCHAR(80) DEFAULT 'fas fa-code'
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    ");
    $steps[] = ['ok', 'Table <strong>skills</strong> created'];

    $pdo->exec("
        CREATE TABLE IF NOT EXISTS contact_messages (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(150) NOT NULL,
            subject VARCHAR(200) NOT NULL,
            message TEXT NOT NULL,
            is_read TINYINT(1) DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    ");
    $steps[] = ['ok', 'Table <strong>contact_messages</strong> created'];

    // 5. Seed admin (skip if exists)
    $check = $pdo->query("SELECT COUNT(*) FROM admin_users")->fetchColumn();
    if ($check == 0) {
        $hash = password_hash('admin123', PASSWORD_BCRYPT);
        $stmt = $pdo->prepare("INSERT INTO admin_users (username, password_hash) VALUES ('admin', :hash)");
        $stmt->execute([':hash' => $hash]);
        $steps[] = ['ok', 'Admin user seeded (username: <strong>admin</strong>, password: <strong>admin123</strong>)'];
    } else {
        $steps[] = ['skip', 'Admin user already exists — skipped'];
    }

    // 6. Seed projects
    $projectCount = $pdo->query("SELECT COUNT(*) FROM projects")->fetchColumn();
    if ($projectCount == 0) {
        $pdo->exec("INSERT INTO projects (title, description, tech_stack, live_url, github_url, category, featured) VALUES
            ('E-Commerce Platform', 'A full-featured online shopping platform with cart, checkout, payment gateway integration, and admin panel for product management.', 'PHP, MySQL, JavaScript, Bootstrap', '#', '#', 'Web', 1),
            ('Task Management App', 'A Kanban-style project management tool with drag-and-drop boards, real-time updates, team collaboration, and deadline tracking.', 'JavaScript, Node.js, MongoDB, Socket.io', '#', '#', 'App', 1),
            ('Restaurant Booking System', 'Online reservation system for restaurants with table management, email confirmations, and admin dashboard for bookings.', 'PHP, MySQL, jQuery, CSS3', '#', '#', 'Web', 1),
            ('Portfolio CMS', 'Content management system specifically designed for creative portfolios, with themes, media uploads, and analytics.', 'PHP, MySQL, JavaScript, AJAX', '#', '#', 'Web', 0),
            ('Weather Dashboard', 'Real-time weather dashboard using OpenWeather API showing forecasts, maps, and historical data with beautiful visualizations.', 'JavaScript, Chart.js, REST API, CSS3', '#', '#', 'API', 0),
            ('Blog Platform', 'Multi-user blogging platform with rich text editor, categories, tags, comments, and SEO optimization tools.', 'PHP, MySQL, TinyMCE, Bootstrap', '#', '#', 'Web', 0)
        ");
        $steps[] = ['ok', '6 sample projects seeded'];
    } else {
        $steps[] = ['skip', 'Projects already exist — skipped'];
    }

    // 7. Seed skills
    $skillCount = $pdo->query("SELECT COUNT(*) FROM skills")->fetchColumn();
    if ($skillCount == 0) {
        $pdo->exec("INSERT INTO skills (name, category, proficiency, icon_class) VALUES
            ('HTML5', 'Frontend', 95, 'fab fa-html5'),
            ('CSS3 / SCSS', 'Frontend', 90, 'fab fa-css3-alt'),
            ('JavaScript (ES6+)', 'Frontend', 88, 'fab fa-js-square'),
            ('React.js', 'Frontend', 78, 'fab fa-react'),
            ('Bootstrap', 'Frontend', 92, 'fab fa-bootstrap'),
            ('PHP', 'Backend', 90, 'fab fa-php'),
            ('Node.js', 'Backend', 72, 'fab fa-node-js'),
            ('REST APIs', 'Backend', 85, 'fas fa-server'),
            ('Laravel', 'Backend', 70, 'fab fa-laravel'),
            ('MySQL', 'Database', 88, 'fas fa-database'),
            ('MongoDB', 'Database', 68, 'fas fa-leaf'),
            ('Redis', 'Database', 60, 'fas fa-layer-group'),
            ('Git / GitHub', 'Tools', 90, 'fab fa-github'),
            ('Docker', 'Tools', 65, 'fab fa-docker'),
            ('Linux / CLI', 'Tools', 78, 'fab fa-linux')
        ");
        $steps[] = ['ok', '15 skills seeded'];
    } else {
        $steps[] = ['skip', 'Skills already exist — skipped'];
    }

    $steps[] = ['ok', '<strong>Installation complete!</strong>'];

} catch (PDOException $e) {
    $success = false;
    $steps[] = ['error', 'Database error: ' . htmlspecialchars($e->getMessage())];
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio Installer</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        *{margin:0;padding:0;box-sizing:border-box}
        body{font-family:'Inter',sans-serif;background:#0a0a0f;color:#e2e8f0;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}
        .card{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:24px;padding:40px;width:100%;max-width:560px;box-shadow:0 24px 48px rgba(0,0,0,0.5)}
        .header{text-align:center;margin-bottom:32px}
        .icon{width:64px;height:64px;background:linear-gradient(135deg,#6366f1,#a855f7);border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:28px;color:#fff;margin:0 auto 16px;box-shadow:0 8px 24px rgba(99,102,241,0.4)}
        h1{font-size:22px;font-weight:700;color:#fff}
        h1 span{background:linear-gradient(135deg,#6366f1,#a855f7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        p.sub{font-size:14px;color:rgba(255,255,255,0.35);margin-top:6px}
        .steps{display:flex;flex-direction:column;gap:10px;margin-bottom:28px}
        .step{display:flex;align-items:center;gap:12px;padding:12px 16px;border-radius:10px;font-size:14px}
        .step.ok{background:rgba(34,197,94,0.08);border:1px solid rgba(34,197,94,0.15);color:#4ade80}
        .step.skip{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);color:rgba(255,255,255,0.35)}
        .step.error{background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);color:#f87171}
        .step-icon{width:20px;flex-shrink:0;text-align:center}
        .actions{display:flex;flex-direction:column;gap:12px}
        .btn{display:flex;align-items:center;justify-content:center;gap:8px;padding:14px;border-radius:12px;font-size:15px;font-weight:600;text-decoration:none;text-align:center;transition:opacity .2s,transform .2s}
        .btn-primary{background:linear-gradient(135deg,#6366f1,#a855f7);color:#fff;box-shadow:0 8px 24px rgba(99,102,241,0.3)}
        .btn-primary:hover{opacity:.9;transform:translateY(-1px)}
        .btn-secondary{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);color:rgba(255,255,255,0.5)}
        .btn-secondary:hover{color:#fff;border-color:rgba(255,255,255,0.2)}
        .warning{background:rgba(251,191,36,0.08);border:1px solid rgba(251,191,36,0.2);border-radius:10px;padding:12px 16px;font-size:13px;color:#fbbf24;margin-top:16px;display:flex;align-items:flex-start;gap:10px}
        .warning i{margin-top:1px;flex-shrink:0}
    </style>
</head>
<body>
<div class="card">
    <div class="header">
        <div class="icon"><i class="fas fa-database"></i></div>
        <h1>Portfolio <span>Installer</span></h1>
        <p class="sub">Setting up your MySQL database automatically</p>
    </div>

    <div class="steps">
        <?php foreach ($steps as $step): ?>
        <div class="step <?= $step[0] ?>">
            <span class="step-icon">
                <?php if ($step[0] === 'ok'): ?><i class="fas fa-check-circle"></i>
                <?php elseif ($step[0] === 'skip'): ?><i class="fas fa-minus-circle"></i>
                <?php else: ?><i class="fas fa-times-circle"></i>
                <?php endif; ?>
            </span>
            <span><?= $step[1] ?></span>
        </div>
        <?php endforeach; ?>
    </div>

    <?php if ($success): ?>
    <div class="actions">
        <a href="index.html" class="btn btn-primary"><i class="fas fa-home"></i> Go to Portfolio</a>
        <a href="admin/login.php" class="btn btn-secondary"><i class="fas fa-user-shield"></i> Admin Panel (admin / admin123)</a>
    </div>
    <div class="warning">
        <i class="fas fa-exclamation-triangle"></i>
        <span>For security, please <strong>delete this file</strong> (<code>install.php</code>) after setup is complete.</span>
    </div>
    <?php else: ?>
    <div class="warning">
        <i class="fas fa-exclamation-triangle"></i>
        <span>Make sure <strong>XAMPP MySQL service is running</strong> and try refreshing this page.</span>
    </div>
    <?php endif; ?>
</div>
</body>
</html>
