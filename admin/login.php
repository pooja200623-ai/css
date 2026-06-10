<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../db_config.php';

session_start();

// Already logged in
if (isset($_SESSION[ADMIN_SESSION_KEY]) && $_SESSION[ADMIN_SESSION_KEY] === true) {
    header('Location: dashboard.php');
    exit;
}

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';

    if ($username && $password) {
        $db = getDB();
        $stmt = $db->prepare('SELECT * FROM admin_users WHERE username = :username LIMIT 1');
        $stmt->execute([':username' => $username]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password_hash'])) {
            $_SESSION[ADMIN_SESSION_KEY] = true;
            $_SESSION['admin_username'] = $user['username'];
            header('Location: dashboard.php');
            exit;
        } else {
            $error = 'Invalid username or password.';
        }
    } else {
        $error = 'Please fill in all fields.';
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login — Portfolio</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #0a0a0f 0%, #0d1117 50%, #090d14 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }
        body::before {
            content: '';
            position: fixed;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(ellipse at 30% 30%, rgba(99,102,241,0.08) 0%, transparent 60%),
                        radial-gradient(ellipse at 70% 70%, rgba(168,85,247,0.06) 0%, transparent 60%);
            pointer-events: none;
        }
        .login-card {
            background: rgba(255,255,255,0.03);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 24px;
            padding: 48px 40px;
            width: 100%;
            max-width: 420px;
            box-shadow: 0 25px 50px rgba(0,0,0,0.5);
        }
        .login-logo { text-align: center; margin-bottom: 32px; }
        .login-logo .icon {
            width: 64px; height: 64px;
            background: linear-gradient(135deg, #6366f1, #a855f7);
            border-radius: 16px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            color: white;
            margin-bottom: 16px;
            box-shadow: 0 8px 24px rgba(99,102,241,0.4);
        }
        .login-logo h1 { font-size: 22px; font-weight: 700; color: #fff; }
        .login-logo p { font-size: 13px; color: rgba(255,255,255,0.4); margin-top: 4px; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.6); margin-bottom: 8px; }
        .form-group .input-wrap { position: relative; }
        .form-group .input-wrap i { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: rgba(255,255,255,0.25); font-size: 14px; }
        .form-group input {
            width: 100%;
            background: rgba(255,255,255,0.04);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 10px;
            padding: 12px 14px 12px 40px;
            color: #fff;
            font-size: 14px;
            font-family: inherit;
            outline: none;
            transition: border-color 0.2s;
        }
        .form-group input:focus { border-color: #6366f1; }
        .btn-login {
            width: 100%;
            padding: 14px;
            background: linear-gradient(135deg, #6366f1, #a855f7);
            border: none;
            border-radius: 10px;
            color: #fff;
            font-size: 15px;
            font-weight: 600;
            font-family: inherit;
            cursor: pointer;
            margin-top: 8px;
            transition: opacity 0.2s, transform 0.2s;
        }
        .btn-login:hover { opacity: 0.9; transform: translateY(-1px); }
        .error-msg {
            background: rgba(239,68,68,0.1);
            border: 1px solid rgba(239,68,68,0.3);
            color: #f87171;
            border-radius: 8px;
            padding: 10px 14px;
            font-size: 13px;
            margin-bottom: 20px;
        }
        .back-link { display: block; text-align: center; margin-top: 20px; font-size: 13px; color: rgba(255,255,255,0.3); text-decoration: none; transition: color 0.2s; }
        .back-link:hover { color: #6366f1; }
    </style>
</head>
<body>
    <div class="login-card">
        <div class="login-logo">
            <div class="icon"><i class="fas fa-user-shield"></i></div>
            <h1>Admin Portal</h1>
            <p>Sign in to manage your portfolio</p>
        </div>
        <?php if ($error): ?>
        <div class="error-msg"><i class="fas fa-exclamation-circle"></i> <?= htmlspecialchars($error) ?></div>
        <?php endif; ?>
        <form method="POST">
            <div class="form-group">
                <label>Username</label>
                <div class="input-wrap">
                    <i class="fas fa-user"></i>
                    <input type="text" name="username" placeholder="Enter username" autocomplete="username" required>
                </div>
            </div>
            <div class="form-group">
                <label>Password</label>
                <div class="input-wrap">
                    <i class="fas fa-lock"></i>
                    <input type="password" name="password" placeholder="Enter password" autocomplete="current-password" required>
                </div>
            </div>
            <button type="submit" class="btn-login">Sign In <i class="fas fa-arrow-right" style="margin-left:8px"></i></button>
        </form>
        <a href="../index.html" class="back-link"><i class="fas fa-arrow-left"></i> Back to Portfolio</a>
    </div>
</body>
</html>
