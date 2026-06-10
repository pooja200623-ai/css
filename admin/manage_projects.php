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
$project = ['id'=>'','title'=>'','description'=>'','tech_stack'=>'','live_url'=>'','github_url'=>'','image'=>'','category'=>'Web','featured'=>0];

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = [
        ':title'       => trim($_POST['title'] ?? ''),
        ':description' => trim($_POST['description'] ?? ''),
        ':tech_stack'  => trim($_POST['tech_stack'] ?? ''),
        ':live_url'    => trim($_POST['live_url'] ?? ''),
        ':github_url'  => trim($_POST['github_url'] ?? ''),
        ':image'       => trim($_POST['image'] ?? 'assets/images/project-placeholder.jpg'),
        ':category'    => trim($_POST['category'] ?? 'Web'),
        ':featured'    => isset($_POST['featured']) ? 1 : 0,
    ];
    $pid = (int)($_POST['project_id'] ?? 0);

    if (empty($data[':title']) || empty($data[':description'])) {
        $err = 'Title and description are required.';
        $action = $pid ? 'edit' : 'add';
        $project = array_merge($project, array_combine(array_map(fn($k) => ltrim($k,':'), array_keys($data)), $data));
        $project['id'] = $pid;
    } elseif ($_POST['form_action'] === 'delete') {
        $db->prepare('DELETE FROM projects WHERE id = :id')->execute([':id' => $pid]);
        $message = 'Project deleted successfully.';
        $action = 'list';
    } elseif ($pid) {
        $data[':id'] = $pid;
        $db->prepare('UPDATE projects SET title=:title,description=:description,tech_stack=:tech_stack,live_url=:live_url,github_url=:github_url,image=:image,category=:category,featured=:featured WHERE id=:id')->execute($data);
        $message = 'Project updated successfully.';
        $action = 'list';
    } else {
        $db->prepare('INSERT INTO projects (title,description,tech_stack,live_url,github_url,image,category,featured) VALUES (:title,:description,:tech_stack,:live_url,:github_url,:image,:category,:featured)')->execute($data);
        $message = 'Project added successfully.';
        $action = 'list';
    }
}

if ($action === 'edit' && $editId) {
    $stmt = $db->prepare('SELECT * FROM projects WHERE id = :id');
    $stmt->execute([':id' => $editId]);
    $project = $stmt->fetch() ?: $project;
}

$projects = $action === 'list' ? $db->query('SELECT * FROM projects ORDER BY created_at DESC')->fetchAll() : [];
$categories = ['Web','App','API','Mobile','Design'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
    <title>Manage Projects — Admin</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="admin.css">
</head>
<body>
<?php include 'sidebar.php'; ?>
<main class="main-content">
    <div class="page-header">
        <h1><?= $action === 'list' ? 'Manage Projects' : ($action === 'add' ? 'Add Project' : 'Edit Project') ?></h1>
        <?php if ($action === 'list'): ?>
        <a href="?action=add" class="btn-primary"><i class="fas fa-plus"></i> Add Project</a>
        <?php else: ?>
        <a href="manage_projects.php" class="btn-secondary"><i class="fas fa-arrow-left"></i> Back</a>
        <?php endif; ?>
    </div>

    <?php if ($message): ?><div class="alert alert-success"><i class="fas fa-check-circle"></i> <?= htmlspecialchars($message) ?></div><?php endif; ?>
    <?php if ($err): ?><div class="alert alert-error"><i class="fas fa-exclamation-circle"></i> <?= htmlspecialchars($err) ?></div><?php endif; ?>

    <?php if ($action === 'list'): ?>
    <div class="table-wrap">
        <table class="data-table">
            <thead><tr><th>#</th><th>Title</th><th>Category</th><th>Featured</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
            <?php foreach ($projects as $p): ?>
            <tr>
                <td><?= $p['id'] ?></td>
                <td><strong><?= htmlspecialchars($p['title']) ?></strong></td>
                <td><span class="badge"><?= htmlspecialchars($p['category']) ?></span></td>
                <td><?= $p['featured'] ? '<span class="badge badge-green">Yes</span>' : '<span class="badge badge-gray">No</span>' ?></td>
                <td><?= date('M d, Y', strtotime($p['created_at'])) ?></td>
                <td class="actions">
                    <a href="?action=edit&id=<?= $p['id'] ?>" class="btn-icon btn-edit"><i class="fas fa-edit"></i></a>
                    <form method="POST" style="display:inline" onsubmit="return confirm('Delete this project?')">
                        <input type="hidden" name="project_id" value="<?= $p['id'] ?>">
                        <input type="hidden" name="form_action" value="delete">
                        <input type="hidden" name="title" value="x"><input type="hidden" name="description" value="x">
                        <button type="submit" class="btn-icon btn-delete"><i class="fas fa-trash"></i></button>
                    </form>
                </td>
            </tr>
            <?php endforeach; ?>
            <?php if (empty($projects)): ?><tr><td colspan="6" style="text-align:center;color:rgba(255,255,255,0.3);padding:32px">No projects found.</td></tr><?php endif; ?>
            </tbody>
        </table>
    </div>
    <?php else: ?>
    <div class="form-card">
        <form method="POST">
            <input type="hidden" name="project_id" value="<?= $project['id'] ?>">
            <input type="hidden" name="form_action" value="save">
            <div class="form-row">
                <div class="form-group">
                    <label>Title *</label>
                    <input type="text" name="title" value="<?= htmlspecialchars($project['title']) ?>" required>
                </div>
                <div class="form-group">
                    <label>Category</label>
                    <select name="category">
                        <?php foreach ($categories as $cat): ?>
                        <option value="<?= $cat ?>" <?= $project['category'] === $cat ? 'selected' : '' ?>><?= $cat ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label>Description *</label>
                <textarea name="description" rows="4"><?= htmlspecialchars($project['description']) ?></textarea>
            </div>
            <div class="form-group">
                <label>Tech Stack <small>(comma separated)</small></label>
                <input type="text" name="tech_stack" value="<?= htmlspecialchars($project['tech_stack']) ?>" placeholder="PHP, MySQL, JavaScript">
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Live URL</label>
                    <input type="url" name="live_url" value="<?= htmlspecialchars($project['live_url']) ?>">
                </div>
                <div class="form-group">
                    <label>GitHub URL</label>
                    <input type="url" name="github_url" value="<?= htmlspecialchars($project['github_url']) ?>">
                </div>
            </div>
            <div class="form-group">
                <label>Image Path/URL</label>
                <input type="text" name="image" value="<?= htmlspecialchars($project['image']) ?>" placeholder="assets/images/project.jpg">
            </div>
            <div class="form-group form-check">
                <label class="check-label">
                    <input type="checkbox" name="featured" value="1" <?= $project['featured'] ? 'checked' : '' ?>>
                    <span>Mark as Featured</span>
                </label>
            </div>
            <div class="form-actions">
                <button type="submit" class="btn-primary"><i class="fas fa-save"></i> Save Project</button>
                <a href="manage_projects.php" class="btn-secondary">Cancel</a>
            </div>
        </form>
    </div>
    <?php endif; ?>
</main>
</body>
</html>
