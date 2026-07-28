<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../db_config.php';
session_start();
if (!isset($_SESSION[ADMIN_SESSION_KEY]) || $_SESSION[ADMIN_SESSION_KEY] !== true) {
    header('Location: login.php'); exit;
}

$db = getDB();
$done = false;
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['confirm'] ?? '') === 'yes') {
    try {
        $db->exec('TRUNCATE TABLE skills');

        $skills = [
            ['Google Ads (Search/Shopping/Display)', 'Paid Acquisition (PPC)', 98, 'fab fa-google'],
            ['Meta Ads Manager (FB & IG)',           'Paid Acquisition (PPC)', 95, 'fab fa-facebook-f'],
            ['LinkedIn Campaign Manager',            'Paid Acquisition (PPC)', 82, 'fab fa-linkedin-in'],
            ['TikTok Ads & Spark Ads',               'Paid Acquisition (PPC)', 78, 'fab fa-tiktok'],
            ['YouTube Ads & Video Campaigns',        'Paid Acquisition (PPC)', 80, 'fab fa-youtube'],
            ['Technical SEO & Core Web Vitals',     'Search Engine Optimization', 96, 'fas fa-search-plus'],
            ['On-Page & Content Optimization',      'Search Engine Optimization', 94, 'fas fa-file-alt'],
            ['Keyword Research & Competitive Gap',  'Search Engine Optimization', 95, 'fas fa-key'],
            ['Link Building & Digital PR',          'Search Engine Optimization', 83, 'fas fa-link'],
            ['Local SEO & Google Business',         'Search Engine Optimization', 88, 'fas fa-map-marker-alt'],
            ['GA4 & Google Tag Manager (GTM)',      'Marketing Tech & Analytics', 94, 'fas fa-chart-bar'],
            ['HubSpot CRM & Marketing Hub',         'Marketing Tech & Analytics', 86, 'fab fa-hubspot'],
            ['A/B Testing & CRO (VWO / Hotjar)',    'Marketing Tech & Analytics', 89, 'fas fa-flask'],
            ['Looker Studio Dashboards',             'Marketing Tech & Analytics', 81, 'fas fa-chart-pie'],
            ['Salesforce & CRM Integrations',       'Marketing Tech & Analytics', 75, 'fas fa-database'],
            ['Klaviyo Email Automation',            'Retention & Email', 92, 'fas fa-envelope-open-text'],
            ['Mailchimp Campaigns & Flows',         'Retention & Email', 88, 'fas fa-mail-bulk'],
            ['Customer Journey Mapping',            'Retention & Email', 87, 'fas fa-map-signs'],
            ['Lead Magnet & Funnel Strategy',       'Retention & Email', 93, 'fas fa-filter'],
            ['SMS & Push Notification Campaigns',   'Retention & Email', 76, 'fas fa-mobile-alt'],
            ['ChatGPT & Prompt Engineering',        'AI & Automations', 96, 'fas fa-robot'],
            ['Claude & Advanced LLMs',              'AI & Automations', 91, 'fas fa-brain'],
            ['Midjourney / AI Visual Creation',     'AI & Automations', 88, 'fas fa-image'],
            ['Zapier & Make.com Workflows',         'AI & Automations', 93, 'fas fa-bolt'],
            ['AI Content Strategy & SEO Scaling',  'AI & Automations', 90, 'fas fa-magic'],
            ['Content Strategy & Editorial Cal.',   'Content & Social Media', 91, 'fas fa-calendar-alt'],
            ['Instagram & Reels Growth',            'Content & Social Media', 87, 'fab fa-instagram'],
            ['LinkedIn Thought Leadership',         'Content & Social Media', 84, 'fab fa-linkedin'],
            ['Short-Form Video (TikTok / Reels)',   'Content & Social Media', 82, 'fas fa-video'],
            ['Brand Voice & Copywriting',           'Content & Social Media', 89, 'fas fa-pen-nib'],
            ['Canva Pro Design & Social Graphics',  'Design & Creative', 95, 'fas fa-paint-brush'],
            ['Adobe Creative Suite (Ps, Ai, Pr)',   'Design & Creative', 88, 'fas fa-palette'],
            ['UI/UX Design Basics (Figma)',         'Design & Creative', 85, 'fas fa-vector-square'],
            ['Video Editing & Motion Graphics',     'Design & Creative', 82, 'fas fa-film'],
            ['Brand Identity & Visual Storytelling','Design & Creative', 90, 'fas fa-image'],
            ['HTML5, CSS3, JavaScript',             'Web Development', 92, 'fab fa-html5'],
            ['React.js & Next.js',                  'Web Development', 88, 'fab fa-react'],
            ['Node.js & API Development',           'Web Development', 85, 'fab fa-node-js'],
            ['Tailwind CSS & Bootstrap',            'Web Development', 90, 'fab fa-css3-alt'],
            ['PHP & MySQL Database Management',     'Web Development', 87, 'fas fa-database'],
        ];

        $stmt = $db->prepare('INSERT INTO skills (name, category, proficiency, icon_class) VALUES (:name, :category, :proficiency, :icon_class)');
        foreach ($skills as [$name, $cat, $prof, $icon]) {
            $stmt->execute([':name' => $name, ':category' => $cat, ':proficiency' => $prof, ':icon_class' => $icon]);
        }
        $done = true;
    } catch (Exception $e) {
        $error = $e->getMessage();
    }
}

$count = (int)$db->query('SELECT COUNT(*) FROM skills')->fetchColumn();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
    <title>Reseed Skills — Admin</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="admin.css">
    <style>
        .reseed-card{background:var(--card-bg,#1e2537);border-radius:16px;padding:36px;max-width:620px;margin:0 auto}
        .reseed-card h2{font-size:22px;font-weight:700;margin-bottom:8px}
        .reseed-card p{color:rgba(255,255,255,.55);font-size:14px;line-height:1.7;margin-bottom:20px}
        .skill-preview{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:20px 0}
        .skill-preview span{background:rgba(99,102,241,.1);border:1px solid rgba(99,102,241,.2);border-radius:8px;padding:6px 12px;font-size:12px;color:rgba(255,255,255,.7)}
        .warning-box{background:rgba(245,158,11,.1);border:1px solid rgba(245,158,11,.3);border-radius:12px;padding:16px;margin:16px 0;color:rgba(245,158,11,.9);font-size:13px;display:flex;gap:10px;align-items:flex-start}
        .success-box{background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.3);border-radius:12px;padding:16px;margin:16px 0;color:rgba(34,197,94,.9);font-size:14px;display:flex;gap:10px;align-items:center}
    </style>
</head>
<body>
<?php include 'sidebar.php'; ?>
<main class="main-content">
    <div class="page-header">
        <h1><i class="fas fa-sync-alt"></i> Reseed Toolkit Skills</h1>
        <a href="manage_skills.php" class="btn-secondary"><i class="fas fa-arrow-left"></i> Back to Skills</a>
    </div>
    <div class="reseed-card">
        <?php if ($done): ?>
        <div class="success-box"><i class="fas fa-check-circle fa-lg"></i><div><strong>Done!</strong> Toolkit reseeded with 40 skills across 8 categories.</div></div>
        <a href="manage_skills.php" class="btn-primary"><i class="fas fa-list"></i> View All Skills</a>
        <?php elseif ($error): ?>
        <div class="alert alert-error"><i class="fas fa-exclamation-circle"></i> <?= htmlspecialchars($error) ?></div>
        <?php else: ?>
        <h2><i class="fas fa-layer-group" style="color:#6366f1;margin-right:10px"></i>Update Full Toolkit</h2>
        <p>Replaces all existing skills with <strong>40 updated skills</strong> across 8 categories. Currently <strong><?= $count ?> skills</strong> in database.</p>
        <div class="skill-preview">
            <span><i class="fas fa-bullseye" style="color:#e64d7a;margin-right:6px"></i>Paid Acquisition (5)</span>
            <span><i class="fas fa-search" style="color:#7c5cbf;margin-right:6px"></i>SEO (5)</span>
            <span><i class="fas fa-chart-line" style="color:#d4a57a;margin-right:6px"></i>MarTech & Analytics (5)</span>
            <span><i class="fas fa-envelope" style="color:#5bba8e;margin-right:6px"></i>Retention & Email (5)</span>
            <span><i class="fas fa-robot" style="color:#4db8e8;margin-right:6px"></i>AI & Automations (5) NEW</span>
            <span><i class="fas fa-share-alt" style="color:#f07e3c;margin-right:6px"></i>Content & Social (5) NEW</span>
            <span><i class="fas fa-paint-brush" style="color:#f43f5e;margin-right:6px"></i>Design & Creative (5) NEW</span>
            <span><i class="fas fa-code" style="color:#22d3ee;margin-right:6px"></i>Web Development (5) NEW</span>
        </div>
        <div class="warning-box"><i class="fas fa-exclamation-triangle"></i><span>This will <strong>truncate</strong> the existing skills table. This action cannot be undone.</span></div>
        <form method="POST">
            <input type="hidden" name="confirm" value="yes">
            <button type="submit" class="btn-primary" style="background:linear-gradient(135deg,#e64d7a,#7c5cbf)"><i class="fas fa-sync-alt"></i> Reseed Toolkit Now</button>
            <a href="manage_skills.php" class="btn-secondary" style="margin-left:12px">Cancel</a>
        </form>
        <?php endif; ?>
    </div>
</main>
</body>
</html>
