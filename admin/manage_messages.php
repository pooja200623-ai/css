<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../db_config.php';
session_start();
if (!isset($_SESSION[ADMIN_SESSION_KEY]) || $_SESSION[ADMIN_SESSION_KEY] !== true) {
    header('Location: login.php'); exit;
}

$db = getDB();

// Mark as read
if (isset($_GET['read']) && (int)$_GET['read']) {
    $db->prepare('UPDATE contact_messages SET is_read = 1 WHERE id = :id')->execute([':id' => (int)$_GET['read']]);
    header('Location: manage_messages.php'); exit;
}

// Delete
if (isset($_GET['delete']) && (int)$_GET['delete']) {
    $db->prepare('DELETE FROM contact_messages WHERE id = :id')->execute([':id' => (int)$_GET['delete']]);
    header('Location: manage_messages.php'); exit;
}

// View specific
$viewId = (int)($_GET['view'] ?? 0);
$viewMsg = null;
if ($viewId) {
    $stmt = $db->prepare('SELECT * FROM contact_messages WHERE id = :id');
    $stmt->execute([':id' => $viewId]);
    $viewMsg = $stmt->fetch();
    if ($viewMsg && !$viewMsg['is_read']) {
        $db->prepare('UPDATE contact_messages SET is_read = 1 WHERE id = :id')->execute([':id' => $viewId]);
    }
}

$messages = $db->query('SELECT * FROM contact_messages ORDER BY created_at DESC')->fetchAll();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
    <title>Messages — Admin</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="admin.css">
</head>
<body>
<?php include 'sidebar.php'; ?>
<main class="main-content">
    <div class="page-header">
        <h1>Contact Messages</h1>
        <span class="badge badge-green"><?= count($messages) ?> total</span>
    </div>

    <?php if ($viewMsg): ?>
    <div class="form-card" style="margin-bottom:24px">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px">
            <div>
                <h3 style="color:#fff;font-size:18px"><?= htmlspecialchars($viewMsg['subject']) ?></h3>
                <p style="color:rgba(255,255,255,0.4);font-size:13px;margin-top:4px">
                    From: <strong style="color:rgba(255,255,255,0.7)"><?= htmlspecialchars($viewMsg['name']) ?></strong>
                    &lt;<?= htmlspecialchars($viewMsg['email']) ?>&gt; &bull;
                    <?= date('M d, Y H:i', strtotime($viewMsg['created_at'])) ?>
                </p>
            </div>
            <a href="manage_messages.php" class="btn-secondary"><i class="fas fa-times"></i></a>
        </div>
        <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:20px;color:rgba(255,255,255,0.75);line-height:1.7;white-space:pre-wrap"><?= htmlspecialchars($viewMsg['message']) ?></div>
        <div style="margin-top:16px">
            <a href="mailto:<?= htmlspecialchars($viewMsg['email']) ?>" class="btn-primary"><i class="fas fa-reply"></i> Reply via Email</a>
            <a href="?delete=<?= $viewMsg['id'] ?>" class="btn-secondary" style="margin-left:8px" onclick="return confirm('Delete?')"><i class="fas fa-trash"></i> Delete</a>
        </div>
    </div>
    <?php endif; ?>

    <div class="table-wrap">
        <table class="data-table">
            <thead><tr><th>Status</th><th>Name</th><th>Subject</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
            <?php foreach ($messages as $m): ?>
            <tr <?= !$m['is_read'] ? 'style="background:rgba(99,102,241,0.05)"' : '' ?>>
                <td><?= !$m['is_read'] ? '<span class="badge badge-green">New</span>' : '<span class="badge badge-gray">Read</span>' ?></td>
                <td><strong><?= htmlspecialchars($m['name']) ?></strong><br><small style="color:rgba(255,255,255,0.35)"><?= htmlspecialchars($m['email']) ?></small></td>
                <td><?= htmlspecialchars($m['subject']) ?></td>
                <td><?= date('M d, Y', strtotime($m['created_at'])) ?></td>
                <td class="actions">
                    <a href="?view=<?= $m['id'] ?>" class="btn-icon btn-edit"><i class="fas fa-eye"></i></a>
                    <a href="?delete=<?= $m['id'] ?>" class="btn-icon btn-delete" onclick="return confirm('Delete?')"><i class="fas fa-trash"></i></a>
                </td>
            </tr>
            <?php endforeach; ?>
            <?php if (empty($messages)): ?><tr><td colspan="5" style="text-align:center;color:rgba(255,255,255,0.3);padding:32px">No messages yet.</td></tr><?php endif; ?>
            </tbody>
        </table>
    </div>
</main>
</body>
</html>
