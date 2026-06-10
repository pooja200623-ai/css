<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../db_config.php';
session_start();
if (!isset($_SESSION[ADMIN_SESSION_KEY]) || $_SESSION[ADMIN_SESSION_KEY] !== true) {
    header('Location: login.php'); exit;
}

$db = getDB();
$action  = $_GET['action'] ?? 'list';
$editId  = (int)($_GET['id'] ?? 0);
$message = '';
$err     = '';
$skill   = ['id'=>'','name'=>'','category'=>'Frontend','proficiency'=>80,'icon_class'=>'fas fa-code'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = [
        ':name'        => trim($_POST['name'] ?? ''),
        ':category'    => trim($_POST['category'] ?? 'Frontend'),
        ':proficiency' => (int)($_POST['proficiency'] ?? 80),
        ':icon_class'  => trim($_POST['icon_class'] ?? 'fas fa-code'),
    ];
    $sid = (int)($_POST['skill_id'] ?? 0);

    if ($_POST['form_action'] === 'delete') {
        $db->prepare('DELETE FROM skills WHERE id = :id')->execute([':id' => $sid]);
        $message = 'Skill deleted.';
        $action = 'list';
    } elseif (empty($data[':name'])) {
        $err = 'Name is required.';
        $action = $sid ? 'edit' : 'add';
    } elseif ($sid) {
        $data[':id'] = $sid;
        $db->prepare('UPDATE skills SET name=:name,category=:category,proficiency=:proficiency,icon_class=:icon_class WHERE id=:id')->execute($data);
        $message = 'Skill updated.';
        $action = 'list';
    } else {
        $db->prepare('INSERT INTO skills (name,category,proficiency,icon_class) VALUES (:name,:category,:proficiency,:icon_class)')->execute($data);
        $message = 'Skill added.';
        $action = 'list';
    }
}

if ($action === 'edit' && $editId) {
    $stmt = $db->prepare('SELECT * FROM skills WHERE id = :id');
    $stmt->execute([':id' => $editId]);
    $skill = $stmt->fetch() ?: $skill;
}

$skills = $action === 'list' ? $db->query('SELECT * FROM skills ORDER BY category, name')->fetchAll() : [];
$categories = ['Frontend','Backend','Database','Tools','Mobile','Other'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
    <title>Manage Skills — Admin</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="admin.css">
</head>
<body>
<?php include 'sidebar.php'; ?>
<main class="main-content">
    <div class="page-header">
        <h1><?= $action === 'list' ? 'Manage Skills' : ($action === 'add' ? 'Add Skill' : 'Edit Skill') ?></h1>
        <?php if ($action === 'list'): ?>
        <a href="?action=add" class="btn-primary"><i class="fas fa-plus"></i> Add Skill</a>
        <?php else: ?>
        <a href="manage_skills.php" class="btn-secondary"><i class="fas fa-arrow-left"></i> Back</a>
        <?php endif; ?>
    </div>

    <?php if ($message): ?><div class="alert alert-success"><i class="fas fa-check-circle"></i> <?= htmlspecialchars($message) ?></div><?php endif; ?>
    <?php if ($err): ?><div class="alert alert-error"><i class="fas fa-exclamation-circle"></i> <?= htmlspecialchars($err) ?></div><?php endif; ?>

    <?php if ($action === 'list'): ?>
    <div class="table-wrap">
        <table class="data-table">
            <thead><tr><th>#</th><th>Name</th><th>Category</th><th>Proficiency</th><th>Icon</th><th>Actions</th></tr></thead>
            <tbody>
            <?php foreach ($skills as $s): ?>
            <tr>
                <td><?= $s['id'] ?></td>
                <td><i class="<?= htmlspecialchars($s['icon_class']) ?>" style="margin-right:8px;color:#6366f1"></i><strong><?= htmlspecialchars($s['name']) ?></strong></td>
                <td><span class="badge"><?= htmlspecialchars($s['category']) ?></span></td>
                <td>
                    <div class="progress-bar-mini">
                        <div class="progress-fill-mini" style="width:<?= $s['proficiency'] ?>%"></div>
                    </div>
                    <span style="font-size:12px;color:rgba(255,255,255,0.4)"><?= $s['proficiency'] ?>%</span>
                </td>
                <td style="font-size:12px;color:rgba(255,255,255,0.4)"><?= htmlspecialchars($s['icon_class']) ?></td>
                <td class="actions">
                    <a href="?action=edit&id=<?= $s['id'] ?>" class="btn-icon btn-edit"><i class="fas fa-edit"></i></a>
                    <form method="POST" style="display:inline" onsubmit="return confirm('Delete this skill?')">
                        <input type="hidden" name="skill_id" value="<?= $s['id'] ?>">
                        <input type="hidden" name="form_action" value="delete">
                        <input type="hidden" name="name" value="x">
                        <button type="submit" class="btn-icon btn-delete"><i class="fas fa-trash"></i></button>
                    </form>
                </td>
            </tr>
            <?php endforeach; ?>
            </tbody>
        </table>
    </div>
    <?php else: ?>
    <div class="form-card">
        <form method="POST">
            <input type="hidden" name="skill_id" value="<?= $skill['id'] ?>">
            <input type="hidden" name="form_action" value="save">
            <div class="form-row">
                <div class="form-group">
                    <label>Skill Name *</label>
                    <input type="text" name="name" value="<?= htmlspecialchars($skill['name']) ?>" required>
                </div>
                <div class="form-group">
                    <label>Category</label>
                    <select name="category">
                        <?php foreach ($categories as $cat): ?>
                        <option value="<?= $cat ?>" <?= $skill['category'] === $cat ? 'selected' : '' ?>><?= $cat ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Proficiency (0-100)</label>
                    <input type="number" name="proficiency" min="0" max="100" value="<?= $skill['proficiency'] ?>">
                </div>
                <div class="form-group">
                    <label>Icon Class <small>(Font Awesome)</small></label>
                    <input type="text" name="icon_class" value="<?= htmlspecialchars($skill['icon_class']) ?>" placeholder="fab fa-html5">
                </div>
            </div>
            <div class="form-actions">
                <button type="submit" class="btn-primary"><i class="fas fa-save"></i> Save Skill</button>
                <a href="manage_skills.php" class="btn-secondary">Cancel</a>
            </div>
        </form>
    </div>
    <?php endif; ?>
</main>
</body>
</html>
