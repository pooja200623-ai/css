<?php
require_once __DIR__ . '/../config.php';
session_start();
if (!isset($_SESSION[ADMIN_SESSION_KEY]) || $_SESSION[ADMIN_SESSION_KEY] !== true) {
    header('Location: login.php'); exit;
}
session_destroy();
header('Location: login.php');
exit;
