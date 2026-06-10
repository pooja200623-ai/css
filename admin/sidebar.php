<?php require_once __DIR__ . '/../config.php'; session_start(); ?>
<aside class="sidebar">
    <div class="sidebar-logo">
        <div class="logo-icon"><i class="fas fa-user-shield"></i></div>
        <span>Portfolio Admin</span>
    </div>
    <nav class="sidebar-nav">
        <a href="dashboard.php" class="nav-item <?= basename($_SERVER['PHP_SELF']) === 'dashboard.php' ? 'active' : '' ?>">
            <i class="fas fa-tachometer-alt"></i> Dashboard
        </a>
        <a href="manage_projects.php" class="nav-item <?= str_contains(basename($_SERVER['PHP_SELF']), 'project') ? 'active' : '' ?>">
            <i class="fas fa-folder-open"></i> Projects
        </a>
        <a href="manage_skills.php" class="nav-item <?= str_contains(basename($_SERVER['PHP_SELF']), 'skill') ? 'active' : '' ?>">
            <i class="fas fa-code"></i> Skills
        </a>
        <a href="manage_messages.php" class="nav-item <?= str_contains(basename($_SERVER['PHP_SELF']), 'message') ? 'active' : '' ?>">
            <i class="fas fa-envelope"></i> Messages
        </a>
        <a href="../index.html" target="_blank" class="nav-item">
            <i class="fas fa-external-link-alt"></i> View Portfolio
        </a>
        <a href="logout.php" class="nav-item nav-logout">
            <i class="fas fa-sign-out-alt"></i> Logout
        </a>
    </nav>
</aside>
