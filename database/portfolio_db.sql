-- ============================================
-- Portfolio Database Schema
-- ============================================

CREATE DATABASE IF NOT EXISTS portfolio_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE portfolio_db;

-- Admin Users
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects
DROP TABLE IF EXISTS projects;
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
    key_metrics VARCHAR(255) DEFAULT NULL,
    problem TEXT DEFAULT NULL,
    strategy TEXT DEFAULT NULL,
    results TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Skills
CREATE TABLE IF NOT EXISTS skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(80) NOT NULL,
    category VARCHAR(60) NOT NULL DEFAULT 'Frontend',
    proficiency INT NOT NULL DEFAULT 80 CHECK (proficiency BETWEEN 0 AND 100),
    icon_class VARCHAR(80) DEFAULT 'fas fa-code'
);

-- Contact Messages
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    is_read TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Seed Data
-- ============================================

-- Default admin (username: admin, password: admin123)
INSERT IGNORE INTO admin_users (username, password_hash) VALUES
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Sample Projects (Digital Marketing Campaigns with Rich Case Studies)
TRUNCATE TABLE projects;
INSERT INTO projects (title, description, tech_stack, live_url, github_url, image, category, featured, key_metrics, problem, strategy, results) VALUES
(
    'E-Commerce SEO Overhaul', 
    'Revamped complete SEO strategy for a premium fashion brand — boosting organic traffic by 312% and adding $180K in monthly organic revenue.', 
    'Semrush, Google Search Console, Schema Markup, Content Clusters', 
    '#', 
    '', 
    'assets/images/seo-case-study.jpg', 
    'SEO', 
    1,
    '312% Organic Traffic, +$180K Monthly Revenue, 14.5% Conversion Rate',
    'The client, a premium fashion e-commerce brand, suffered from stagnant organic search visibility and a heavy reliance on paid acquisition. Their search presence was hindered by technical debt, slow page loads, duplicate product description content, and a lack of organized topical hubs.',
    'We executed a three-pronged SEO strategy: 1) Technical remediation, resolving indexation issues and implementing JSON-LD schema markup. 2) Topical authority building, clustering content around high-intent keywords. 3) Scalable digital PR campaigns to secure high-authority backlinks from major style and retail publications.',
    'Within 6 months, organic page-one keyword rankings increased by 420%. Organic traffic grew by 312%, translating directly into an additional $180,000 in monthly organic revenue. Technical optimizations also reduced bounce rates by 18%.'
),
(
    'SaaS Meta Ads Scaling', 
    'Scaled B2B SaaS paid acquisition from $5,000 to $80,000/month in ad spend while maintaining a 4.2x ROAS through visual A/B testing and CAPI setup.', 
    'Meta Ads Manager, CAPI (Conversion API), Smartly.io, VWO', 
    '#', 
    '', 
    'assets/images/ppc-case-study.jpg', 
    'PPC', 
    1,
    '4.2x ROAS, 16x Paid Traffic Growth, -45% Customer Acquisition Cost',
    'A B2B SaaS provider was struggling to scale their monthly paid acquisition spend beyond $5,000 while maintaining efficiency. Their Meta ad creatives were fatiguing rapidly, conversion tracking was dropping up to 25% of events due to browser restrictions, and targeting was too broad.',
    'We implemented the Meta Conversions API (CAPI) via server-side tagging to bypass cookie restrictions. We set up Smartly.io for automated creative asset variations and established a continuous A/B testing framework (VWO) on customized landing pages. We built narrow lookalike audiences based on high-LTV customers.',
    'Successfully scaled B2B SaaS paid acquisition from $5,000 to $80,000/month in ad spend. The campaign maintained an average 4.2x ROAS (Return on Ad Spend) and dropped customer acquisition cost (CAC) by 45%.'
),
(
    'Instagram Growth Campaign', 
    'Designed organic social & influencer campaigns for a wellness brand, expanding reach from 3K to 95K followers with high engagement Reels.', 
    'Instagram Reels, GRIN (Influencer Tool), Canva, Metricool', 
    '#', 
    '', 
    'assets/images/social-case-study.jpg', 
    'Social', 
    0,
    '92K New Followers, +620% Engagement Rate, 34% DM-to-Sale Conversion',
    'A boutique wellness brand had a high-quality product line but virtually zero social presence (stuck at 3K followers). Their content lacked cohesive aesthetic appeal, had low engagement, and failed to drive sales conversions.',
    'We developed a Reels-first content strategy focused on educational micro-videos and lifestyle aesthetics. Using GRIN, we identified and onboarded 25 micro-influencers for authentic product reviews. We also implemented automated Instagram DM funnel flows to instantly nurture post comments into purchase discounts.',
    'Expanded organic reach from 3K to 95K followers within 8 months. Reels generated over 4.2 million total views. Crucially, the automated DM funnel drove a 34% DM-to-sale conversion rate, representing a major new direct revenue stream.'
),
(
    'Email Automation Funnel', 
    'Created high-converting automated welcome and cart-abandonment flows, generating $15K/month on autopilot with 42% open rate.', 
    'Klaviyo, Shopify Integration, Copywriting, Figma', 
    '#', 
    '', 
    'assets/images/email-case-study.jpg', 
    'Email', 
    1,
    '+$15K Monthly Autopilot Revenue, 42% Open Rate, 18% Click-Through Rate',
    'An online coaching business had a list of 12,000 subscribers but was only sending sporadic broadcast newsletters. They had no automated nurture sequences or cart recovery systems, leaving substantial revenue on the table.',
    'We designed a highly segmented email lifecycle strategy using Klaviyo. We built a 7-stage welcome series, dynamic abandoned cart flows, and post-purchase cross-sell sequences. We also performed deep subscriber cleanups and implemented dedicated domain sending to maximize inbox deliverability.',
    'The automated welcome and cart-abandonment flows generated $15,000/month in recurring revenue on autopilot. The campaigns averaged a 42% open rate and a high-performing 18% click-through rate.'
),
(
    'Fintech Thought Leadership Hub', 
    'Developed an industry blog, LinkedIn newsletter, and podcast ecosystem that drove 85% of inbound SaaS marketing leads.', 
    'Content Strategy, Buzzsprout, LinkedIn Publishing, Medium', 
    '#', 
    '', 
    'assets/images/content-case-study.jpg', 
    'Content', 
    0,
    '85% Inbound Lead Share, 1.2M Annual Pageviews, +240% Demo Bookings',
    'A fintech startup was offering a complex B2B payment solution but had low brand credibility and difficulty explaining their value proposition to C-suite decision makers.',
    'We established a high-authority content hub centered on technical finance blogs, a LinkedIn newsletter, and a monthly industry podcast. We utilized content syndication on Medium and secured thought leadership guest columns for company executives in prominent financial news portals.',
    'The content ecosystem grew to drive 85% of all inbound marketing leads. Demo bookings increased by 240% year-over-year, and website pageviews crossed 1.2 million annually.'
),
(
    'Google Ads Lead Gen Engine', 
    'Structured search and local service ads for a multi-location real estate franchise, achieving a 65% reduction in cost-per-lead.', 
    'Google Ads Editor, Unbounce (Landing Pages), Zapier, Salesforce', 
    '#', 
    '', 
    'assets/images/leadgen-case-study.jpg', 
    'PPC', 
    0,
    '-65% Cost-Per-Lead, +180% Lead Volume, 94% Quality Match Score',
    'A multi-location real estate franchise was running Google Ads but suffered from high cost-per-lead ($80+), poor lead quality (junk forms), and inefficient budget allocation across regions.',
    'We rebuilt the Google Ads account from scratch with a single-theme ad group structure, added negative keyword lists, and restructured local service campaigns. We created custom landing pages integrated with Salesforce CRM to feed offline conversion data back to Google\'s bidding algorithm.',
    'Reduced the average cost-per-lead from $80 to $28 (a 65% reduction) while increasing overall lead volume by 180%. Lead quality match score rose to 94%, significantly improving sales team efficiency.'
);

-- Sample Skills (Digital Marketing Toolkit)
TRUNCATE TABLE skills;
INSERT INTO skills (name, category, proficiency, icon_class) VALUES
-- PPC
('Google Ads (Search/Display)', 'Paid Acquisition (PPC)', 98, 'fab fa-google'),
('Meta Ads Manager', 'Paid Acquisition (PPC)', 95, 'fab fa-facebook-f'),
('LinkedIn Campaign Manager', 'Paid Acquisition (PPC)', 80, 'fab fa-linkedin-in'),
('TikTok Ads', 'Paid Acquisition (PPC)', 75, 'fab fa-tiktok'),
-- SEO
('Technical SEO & Audits', 'Search Engine Optimization', 96, 'fas fa-search-plus'),
('On-Page & Content Optimization', 'Search Engine Optimization', 94, 'fas fa-file-alt'),
('Keyword Research & Strategy', 'Search Engine Optimization', 95, 'fas fa-key'),
('Link Building & Outreach', 'Search Engine Optimization', 82, 'fas fa-link'),
-- Analytics
('GA4 & Tag Manager (GTM)', 'Marketing Tech & Analytics', 94, 'fas fa-chart-bar'),
('HubSpot CRM Marketing', 'Marketing Tech & Analytics', 85, 'fab fa-hubspot'),
('A/B Testing & CRO (VWO/Hotjar)', 'Marketing Tech & Analytics', 88, 'fas fa-flask'),
('Looker Studio Dashboards', 'Marketing Tech & Analytics', 80, 'fas fa-chart-pie'),
-- Retention
('Klaviyo / Mailchimp Automation', 'Retention & Email', 90, 'fas fa-envelope-open-text'),
('Customer Journey Mapping', 'Retention & Email', 88, 'fas fa-map-signs'),
('Lead Magnet & Funnel Strategy', 'Retention & Email', 92, 'fas fa-filter'),
-- AI & Automations
('ChatGPT & Prompt Engineering', 'AI & Automations', 95, 'fas fa-robot'),
('Midjourney / AI Visuals', 'AI & Automations', 88, 'fas fa-image'),
('Claude & Advanced LLMs', 'AI & Automations', 90, 'fas fa-brain'),
('Zapier / Make.com Workflows', 'AI & Automations', 92, 'fas fa-bolt');
