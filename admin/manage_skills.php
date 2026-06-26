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
$skill   = ['id'=>'','name'=>'','category'=>'Paid Acquisition (PPC)','proficiency'=>80,'icon_class'=>'fas fa-star'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = [
        ':name'        => trim($_POST['name'] ?? ''),
        ':category'    => trim($_POST['category'] ?? 'Paid Acquisition (PPC)'),
        ':proficiency' => max(0, min(100, (int)($_POST['proficiency'] ?? 80))),
        ':icon_class'  => trim($_POST['icon_class'] ?? 'fas fa-star'),
    ];
    $sid = (int)($_POST['skill_id'] ?? 0);

    if ($_POST['form_action'] === 'delete') {
        $db->prepare('DELETE FROM skills WHERE id = :id')->execute([':id' => $sid]);
        $message = 'Skill deleted successfully.';
        $action = 'list';
    } elseif (empty($data[':name'])) {
        $err = 'Skill name is required.';
        $action = $sid ? 'edit' : 'add';
        if ($sid) $skill = array_merge($skill, array_combine([
            'id','name','category','proficiency','icon_class'
        ], [$sid, $data[':name'], $data[':category'], $data[':proficiency'], $data[':icon_class']]));
    } elseif ($sid) {
        $data[':id'] = $sid;
        $db->prepare('UPDATE skills SET name=:name, category=:category, proficiency=:proficiency, icon_class=:icon_class WHERE id=:id')->execute($data);
        $message = '✓ Skill updated successfully.';
        $action = 'list';
    } else {
        $db->prepare('INSERT INTO skills (name, category, proficiency, icon_class) VALUES (:name, :category, :proficiency, :icon_class)')->execute($data);
        $message = '✓ New skill added successfully.';
        $action = 'list';
    }
}

if ($action === 'edit' && $editId) {
    $stmt = $db->prepare('SELECT * FROM skills WHERE id = :id');
    $stmt->execute([':id' => $editId]);
    $skill = $stmt->fetch() ?: $skill;
}

$skills     = $action === 'list' ? $db->query('SELECT * FROM skills ORDER BY category, name')->fetchAll() : [];
$categories = [
    'Paid Acquisition (PPC)',
    'Search Engine Optimization',
    'Marketing Tech & Analytics',
    'Retention & Email',
    'AI & Automations',
    'Content & Social Media'
];

// Group skills by category for stats
$grouped = [];
foreach ($skills as $s) {
    $grouped[$s['category']][] = $s;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
    <title><?= $action === 'list' ? 'Manage Skills' : ($action === 'add' ? 'Add Skill' : 'Edit Skill') ?> — Admin</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="admin.css">
    <style>
        /* ── Enhanced form styles ── */
        .form-card { background: var(--card-bg, #1e2537); border-radius: 16px; padding: 32px; max-width: 780px; }

        /* Proficiency slider */
        .proficiency-group { position: relative; }
        .prof-display { display: flex; align-items: center; gap: 14px; margin-bottom: 10px; }
        .prof-badge {
            min-width: 58px; height: 38px; border-radius: 10px;
            background: linear-gradient(135deg, #6366f1, #a855f7);
            color: #fff; font-size: 16px; font-weight: 700;
            display: flex; align-items: center; justify-content: center;
            transition: background .3s;
        }
        .prof-tier-badge {
            font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 20px;
            text-transform: uppercase; letter-spacing: .6px;
        }
        .tier-expert   { background: rgba(251,191,36,.15); color: #fbbf24; border: 1px solid rgba(251,191,36,.35); }
        .tier-advanced { background: rgba(99,102,241,.15); color: #818cf8; border: 1px solid rgba(99,102,241,.35); }
        .tier-proficient{ background: rgba(34,197,94,.12); color: #4ade80; border: 1px solid rgba(34,197,94,.3); }
        .tier-familiar  { background: rgba(148,163,184,.12); color: #94a3b8; border: 1px solid rgba(148,163,184,.3); }

        input[type="range"] {
            -webkit-appearance: none; appearance: none;
            width: 100%; height: 6px; border-radius: 4px;
            background: rgba(255,255,255,.1); outline: none; cursor: pointer;
        }
        input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none; appearance: none;
            width: 20px; height: 20px; border-radius: 50%;
            background: linear-gradient(135deg, #6366f1, #a855f7);
            cursor: pointer; box-shadow: 0 0 0 3px rgba(99,102,241,.3);
            transition: box-shadow .2s;
        }
        input[type="range"]::-webkit-slider-thumb:hover {
            box-shadow: 0 0 0 5px rgba(99,102,241,.4);
        }
        .range-labels { display: flex; justify-content: space-between; font-size: 11px; color: rgba(255,255,255,.3); margin-top: 4px; }

        /* Icon picker */
        .icon-field-wrap { position: relative; }
        .icon-preview-box {
            display: flex; align-items: center; gap: 14px; margin-bottom: 10px;
        }
        .icon-preview {
            width: 46px; height: 46px; border-radius: 12px;
            background: linear-gradient(135deg, #6366f1, #a855f7);
            display: flex; align-items: center; justify-content: center;
            font-size: 20px; color: #fff; flex-shrink: 0;
            box-shadow: 0 6px 16px rgba(99,102,241,.35);
            transition: transform .2s;
        }
        .icon-preview:hover { transform: scale(1.05); }
        .icon-class-input-wrap { flex: 1; }
        .icon-class-input-wrap input { margin-bottom: 0; }
        .quick-icons { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
        .quick-icon-btn {
            background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1);
            border-radius: 8px; padding: 6px 10px; cursor: pointer; color: rgba(255,255,255,.7);
            font-size: 13px; transition: all .2s; display: flex; align-items: center; gap: 6px;
        }
        .quick-icon-btn:hover {
            background: rgba(99,102,241,.2); border-color: rgba(99,102,241,.5); color: #fff;
        }
        .quick-icon-btn.active {
            background: rgba(99,102,241,.3); border-color: #6366f1; color: #fff;
        }
        .quick-icons-label { font-size: 11px; color: rgba(255,255,255,.35); margin-bottom: 6px; }

        /* Stat cards on list page */
        .skills-overview {
            display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
            gap: 14px; margin-bottom: 28px;
        }
        .stat-card {
            background: var(--card-bg, #1e2537); border-radius: 14px;
            padding: 18px 16px; text-align: center;
            border: 1px solid rgba(255,255,255,.07);
        }
        .stat-card-val { font-size: 28px; font-weight: 700; color: #fff; line-height: 1; }
        .stat-card-label { font-size: 11px; color: rgba(255,255,255,.4); margin-top: 4px; }
        .stat-card-val.accent { background: linear-gradient(135deg, #6366f1, #a855f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

        /* Category group in list */
        .cat-group { margin-bottom: 28px; }
        .cat-group-header {
            font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;
            color: rgba(255,255,255,.35); padding: 0 0 8px; border-bottom: 1px solid rgba(255,255,255,.07);
            margin-bottom: 4px;
        }

        /* Better action buttons */
        .btn-edit { background: rgba(99,102,241,.15); color: #818cf8; border: 1px solid rgba(99,102,241,.3); }
        .btn-edit:hover { background: rgba(99,102,241,.35); color: #fff; }
        .btn-delete { background: rgba(239,68,68,.12); color: #f87171; border: 1px solid rgba(239,68,68,.25); }
        .btn-delete:hover { background: rgba(239,68,68,.3); color: #fff; }

        /* Empty category notice */
        .notice { color: rgba(255,255,255,.3); font-size: 13px; font-style: italic; padding: 8px 0; }

        /* Inline proficiency track */
        .prof-track { height: 4px; background: rgba(255,255,255,.08); border-radius: 4px; overflow: hidden; min-width: 80px; }
        .prof-fill  { height: 100%; border-radius: 4px; background: linear-gradient(90deg, #6366f1, #a855f7); }
    </style>
</head>
<body>
<?php include 'sidebar.php'; ?>
<main class="main-content">
    <div class="page-header">
        <h1>
            <?php if ($action === 'list'): ?>
                <i class="fas fa-layer-group" style="color:#6366f1;margin-right:10px"></i>Manage Skills
            <?php elseif ($action === 'add'): ?>
                <i class="fas fa-plus-circle" style="color:#22c55e;margin-right:10px"></i>Add New Skill
            <?php else: ?>
                <i class="fas fa-edit" style="color:#818cf8;margin-right:10px"></i>Edit Skill
            <?php endif; ?>
        </h1>
        <?php if ($action === 'list'): ?>
        <div style="display:flex;gap:10px;align-items:center">
            <a href="reseed_skills.php" class="btn-secondary" title="Reseed all toolkit skills from preset data">
                <i class="fas fa-sync-alt"></i> Reseed Toolkit
            </a>
            <a href="?action=add" class="btn-primary" id="add-skill-btn">
                <i class="fas fa-plus"></i> Add Skill
            </a>
        </div>
        <?php else: ?>
        <a href="manage_skills.php" class="btn-secondary"><i class="fas fa-arrow-left"></i> Back to Skills</a>
        <?php endif; ?>
    </div>

    <?php if ($message): ?>
    <div class="alert alert-success" id="flash-msg">
        <i class="fas fa-check-circle"></i> <?= htmlspecialchars($message) ?>
    </div>
    <?php endif; ?>
    <?php if ($err): ?>
    <div class="alert alert-error">
        <i class="fas fa-exclamation-circle"></i> <?= htmlspecialchars($err) ?>
    </div>
    <?php endif; ?>

    <?php if ($action === 'list'): ?>

    <!-- ── Stat Overview ── -->
    <?php
        $totalSkills = count($skills);
        $avgProf = $totalSkills ? round(array_sum(array_column($skills, 'proficiency')) / $totalSkills) : 0;
        $expertCount = count(array_filter($skills, fn($s) => $s['proficiency'] >= 95));
        $catCount = count($grouped);
    ?>
    <div class="skills-overview">
        <div class="stat-card">
            <div class="stat-card-val accent"><?= $totalSkills ?></div>
            <div class="stat-card-label">Total Skills</div>
        </div>
        <div class="stat-card">
            <div class="stat-card-val accent"><?= $catCount ?></div>
            <div class="stat-card-label">Categories</div>
        </div>
        <div class="stat-card">
            <div class="stat-card-val accent"><?= $avgProf ?>%</div>
            <div class="stat-card-label">Avg. Proficiency</div>
        </div>
        <div class="stat-card">
            <div class="stat-card-val accent"><?= $expertCount ?></div>
            <div class="stat-card-label">Expert-Level</div>
        </div>
    </div>

    <!-- ── Skills Table Grouped by Category ── -->
    <div class="table-wrap">
        <table class="data-table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Skill</th>
                    <th>Category</th>
                    <th>Proficiency</th>
                    <th>Icon Class</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
            <?php if (empty($skills)): ?>
                <tr><td colspan="6" class="notice" style="text-align:center;padding:28px">No skills found. <a href="?action=add" style="color:#6366f1">Add your first skill</a> or <a href="reseed_skills.php" style="color:#6366f1">reseed the toolkit</a>.</td></tr>
            <?php else: ?>
                <?php foreach ($grouped as $cat => $catSkills): ?>
                <tr>
                    <td colspan="6" style="padding: 18px 16px 6px; background: transparent;">
                        <div class="cat-group-header"><?= htmlspecialchars($cat) ?> &nbsp;·&nbsp; <?= count($catSkills) ?> skill<?= count($catSkills) !== 1 ? 's' : '' ?></div>
                    </td>
                </tr>
                <?php foreach ($catSkills as $s):
                    $prof = (int)$s['proficiency'];
                    $tier = $prof >= 95 ? 'Expert' : ($prof >= 85 ? 'Advanced' : ($prof >= 70 ? 'Proficient' : 'Familiar'));
                    $tc   = $prof >= 95 ? 'tier-expert' : ($prof >= 85 ? 'tier-advanced' : ($prof >= 70 ? 'tier-proficient' : 'tier-familiar'));
                ?>
                <tr id="skill-row-<?= $s['id'] ?>">
                    <td style="color:rgba(255,255,255,.3);font-size:12px"><?= $s['id'] ?></td>
                    <td>
                        <div style="display:flex;align-items:center;gap:12px">
                            <div style="width:34px;height:34px;border-radius:9px;background:linear-gradient(135deg,#6366f1,#a855f7);display:flex;align-items:center;justify-content:center;font-size:15px;color:#fff;flex-shrink:0">
                                <i class="<?= htmlspecialchars($s['icon_class']) ?>"></i>
                            </div>
                            <strong><?= htmlspecialchars($s['name']) ?></strong>
                        </div>
                    </td>
                    <td><span class="badge"><?= htmlspecialchars($s['category']) ?></span></td>
                    <td>
                        <div style="display:flex;align-items:center;gap:10px">
                            <div class="prof-track" style="width:70px"><div class="prof-fill" style="width:<?= $prof ?>%"></div></div>
                            <span style="font-size:12px;color:rgba(255,255,255,.5)"><?= $prof ?>%</span>
                            <span class="prof-tier-badge <?= $tc ?>"><?= $tier ?></span>
                        </div>
                    </td>
                    <td style="font-size:11px;color:rgba(255,255,255,.3);font-family:monospace"><?= htmlspecialchars($s['icon_class']) ?></td>
                    <td class="actions">
                        <a href="?action=edit&id=<?= $s['id'] ?>" class="btn-icon btn-edit" title="Edit"><i class="fas fa-edit"></i></a>
                        <form method="POST" style="display:inline" onsubmit="return confirm('Delete «<?= htmlspecialchars(addslashes($s['name'])) ?>»? This cannot be undone.')">
                            <input type="hidden" name="skill_id" value="<?= $s['id'] ?>">
                            <input type="hidden" name="form_action" value="delete">
                            <input type="hidden" name="name" value="x">
                            <button type="submit" class="btn-icon btn-delete" title="Delete"><i class="fas fa-trash"></i></button>
                        </form>
                    </td>
                </tr>
                <?php endforeach; ?>
                <?php endforeach; ?>
            <?php endif; ?>
            </tbody>
        </table>
    </div>

    <?php else: /* ADD or EDIT form */ ?>

    <div class="form-card">
        <form method="POST" id="skill-form" autocomplete="off">
            <input type="hidden" name="skill_id" value="<?= $skill['id'] ?>">
            <input type="hidden" name="form_action" value="save">

            <!-- Row 1: Name + Category -->
            <div class="form-row">
                <div class="form-group">
                    <label for="f-name">Skill Name <span style="color:#f87171">*</span></label>
                    <input type="text" id="f-name" name="name"
                           value="<?= htmlspecialchars($skill['name']) ?>"
                           placeholder="e.g. Google Ads Search" required autofocus>
                </div>
                <div class="form-group">
                    <label for="f-cat">Category</label>
                    <select id="f-cat" name="category">
                        <?php foreach ($categories as $cat): ?>
                        <option value="<?= htmlspecialchars($cat) ?>" <?= $skill['category'] === $cat ? 'selected' : '' ?>>
                            <?= htmlspecialchars($cat) ?>
                        </option>
                        <?php endforeach; ?>
                    </select>
                </div>
            </div>

            <!-- Row 2: Proficiency slider -->
            <div class="form-row">
                <div class="form-group proficiency-group" style="flex:1">
                    <label>Proficiency Level</label>
                    <div class="prof-display">
                        <div class="prof-badge" id="prof-badge"><?= $skill['proficiency'] ?>%</div>
                        <span class="prof-tier-badge <?=
                            $skill['proficiency'] >= 95 ? 'tier-expert' :
                            ($skill['proficiency'] >= 85 ? 'tier-advanced' :
                            ($skill['proficiency'] >= 70 ? 'tier-proficient' : 'tier-familiar'))
                        ?>" id="prof-tier"><?=
                            $skill['proficiency'] >= 95 ? 'Expert' :
                            ($skill['proficiency'] >= 85 ? 'Advanced' :
                            ($skill['proficiency'] >= 70 ? 'Proficient' : 'Familiar'))
                        ?></span>
                        <span style="font-size:11px;color:rgba(255,255,255,.3)" id="prof-hint">≥ 95 = Expert · ≥ 85 = Advanced · ≥ 70 = Proficient</span>
                    </div>
                    <input type="range" id="f-prof-range" min="0" max="100" step="1"
                           value="<?= $skill['proficiency'] ?>"
                           oninput="updateProficiency(this.value)">
                    <input type="hidden" id="f-proficiency" name="proficiency" value="<?= $skill['proficiency'] ?>">
                    <div class="range-labels"><span>0</span><span>25</span><span>50</span><span>75</span><span>100</span></div>
                </div>
            </div>

            <!-- Row 3: Icon Class with preview -->
            <div class="form-row">
                <div class="form-group" style="flex:1">
                    <label>Font Awesome Icon Class</label>
                    <div class="icon-preview-box">
                        <div class="icon-preview" id="icon-preview-box">
                            <i class="<?= htmlspecialchars($skill['icon_class']) ?>" id="icon-preview-i"></i>
                        </div>
                        <div class="icon-class-input-wrap">
                            <input type="text" id="f-icon" name="icon_class"
                                   value="<?= htmlspecialchars($skill['icon_class']) ?>"
                                   placeholder="fab fa-google"
                                   oninput="updateIconPreview(this.value)">
                        </div>
                    </div>
                    <div class="quick-icons-label">Quick-pick common icons:</div>
                    <div class="quick-icons" id="quick-icons">
                        <?php
                        $quickIcons = [
                            ['fab fa-google',       'Google'],
                            ['fab fa-facebook-f',   'Meta'],
                            ['fab fa-linkedin-in',  'LinkedIn'],
                            ['fab fa-tiktok',       'TikTok'],
                            ['fab fa-youtube',      'YouTube'],
                            ['fab fa-instagram',    'Instagram'],
                            ['fas fa-search',       'SEO'],
                            ['fas fa-chart-bar',    'Analytics'],
                            ['fas fa-envelope',     'Email'],
                            ['fas fa-robot',        'AI/Bot'],
                            ['fas fa-bolt',         'Zapier'],
                            ['fas fa-brain',        'LLM'],
                            ['fas fa-image',        'Creative'],
                            ['fas fa-magic',        'Magic'],
                            ['fas fa-bullseye',     'PPC'],
                            ['fas fa-filter',       'Funnel'],
                            ['fas fa-chart-pie',    'Reports'],
                            ['fas fa-mobile-alt',   'Mobile'],
                            ['fas fa-key',          'Keywords'],
                            ['fas fa-link',         'Links'],
                            ['fas fa-map-marker-alt','Local'],
                            ['fas fa-pen-nib',      'Copy'],
                            ['fas fa-video',        'Video'],
                            ['fas fa-flask',        'A/B Test'],
                            ['fab fa-hubspot',      'HubSpot'],
                            ['fas fa-database',     'CRM'],
                        ];
                        foreach ($quickIcons as [$cls, $lbl]):
                        ?>
                        <button type="button" class="quick-icon-btn <?= $skill['icon_class'] === $cls ? 'active' : '' ?>"
                                data-icon="<?= $cls ?>" onclick="pickIcon('<?= $cls ?>', this)">
                            <i class="<?= $cls ?>"></i> <span><?= $lbl ?></span>
                        </button>
                        <?php endforeach; ?>
                    </div>
                </div>
            </div>

            <div class="form-actions" style="margin-top:28px">
                <button type="submit" class="btn-primary" id="submit-btn">
                    <i class="fas fa-<?= $action === 'add' ? 'plus-circle' : 'save' ?>"></i>
                    <?= $action === 'add' ? 'Add Skill' : 'Update Skill' ?>
                </button>
                <a href="manage_skills.php" class="btn-secondary">Cancel</a>
                <?php if ($action === 'edit'): ?>
                <form method="POST" style="display:inline;margin-left:auto"
                      onsubmit="return confirm('Delete this skill permanently?')">
                    <input type="hidden" name="skill_id" value="<?= $skill['id'] ?>">
                    <input type="hidden" name="form_action" value="delete">
                    <input type="hidden" name="name" value="x">
                    <button type="submit" class="btn-secondary" style="color:#f87171;border-color:rgba(239,68,68,.3);margin-left:8px">
                        <i class="fas fa-trash"></i> Delete This Skill
                    </button>
                </form>
                <?php endif; ?>
            </div>
        </form>
    </div>

    <script>
    // Live proficiency slider
    function updateProficiency(val) {
        val = parseInt(val);
        document.getElementById('f-proficiency').value = val;
        document.getElementById('prof-badge').textContent = val + '%';

        let tier, cls;
        if (val >= 95)      { tier = 'Expert';    cls = 'tier-expert'; }
        else if (val >= 85) { tier = 'Advanced';  cls = 'tier-advanced'; }
        else if (val >= 70) { tier = 'Proficient';cls = 'tier-proficient'; }
        else                { tier = 'Familiar';  cls = 'tier-familiar'; }

        const tb = document.getElementById('prof-tier');
        tb.textContent = tier;
        tb.className = 'prof-tier-badge ' + cls;
    }

    // Live icon preview
    function updateIconPreview(val) {
        val = val.trim();
        const el = document.getElementById('icon-preview-i');
        el.className = val || 'fas fa-question';
        // Highlight matching quick-pick
        document.querySelectorAll('.quick-icon-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.icon === val);
        });
    }

    // Pick icon from quick-pick chips
    function pickIcon(cls, btn) {
        document.getElementById('f-icon').value = cls;
        document.getElementById('icon-preview-i').className = cls;
        document.querySelectorAll('.quick-icon-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    }

    // Auto-dismiss flash message
    const flash = document.getElementById('flash-msg');
    if (flash) setTimeout(() => { flash.style.opacity = '0'; flash.style.transition = 'opacity .5s'; setTimeout(()=>flash.remove(), 500); }, 3500);
    </script>

    <?php endif; ?>

</main>
</body>
</html>
