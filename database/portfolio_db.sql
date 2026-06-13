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

-- Sample Projects (Digital Marketing Campaigns)
TRUNCATE TABLE projects;
INSERT INTO projects (title, description, tech_stack, live_url, github_url, image, category, featured) VALUES
('E-Commerce SEO Overhaul', 'Revamped complete SEO strategy for a premium fashion brand — boosting organic traffic by 312% and adding $180K in monthly organic revenue.', 'Semrush, Google Search Console, Schema Markup, Content Clusters', '#', '', 'assets/images/seo-case-study.jpg', 'SEO', 1),
('SaaS Meta Ads Scaling', 'Scaled B2B SaaS paid acquisition from $5,000 to $80,000/month in ad spend while maintaining a 4.2x ROAS through visual A/B testing and CAPI setup.', 'Meta Ads Manager, CAPI (Conversion API), Smartly.io, VWO', '#', '', 'assets/images/ppc-case-study.jpg', 'PPC', 1),
('Instagram Growth Campaign', 'Designed organic social & influencer campaigns for a wellness brand, expanding reach from 3K to 95K followers with high engagement Reels.', 'Instagram Reels, GRIN (Influencer Tool), Canva, Metricool', '#', '', 'assets/images/social-case-study.jpg', 'Social', 0),
('Email Automation Funnel', 'Created high-converting automated welcome and cart-abandonment flows, generating $15K/month on autopilot with 42% open rate.', 'Klaviyo, Shopify Integration, Copywriting, Figma', '#', '', 'assets/images/email-case-study.jpg', 'Email', 1),
('Fintech Thought Leadership Hub', 'Developed an industry blog, LinkedIn newsletter, and podcast ecosystem that drove 85% of inbound SaaS marketing leads.', 'Content Strategy, Buzzsprout, LinkedIn Publishing, Medium', '#', '', 'assets/images/content-case-study.jpg', 'Content', 0),
('Google Ads Lead Gen Engine', 'Structured search and local service ads for a multi-location real estate franchise, achieving a 65% reduction in cost-per-lead.', 'Google Ads Editor, Unbounce (Landing Pages), Zapier, Salesforce', '#', '', 'assets/images/leadgen-case-study.jpg', 'PPC', 0);

-- Sample Skills (Digital Marketing Toolkit)
TRUNCATE TABLE skills;
INSERT INTO skills (name, category, proficiency, icon_class) VALUES
-- PPC
('Google Ads (Search/Display)', 'Paid Acquisition (PPC)', 92, 'fab fa-google'),
('Meta Ads Manager', 'Paid Acquisition (PPC)', 95, 'fab fa-facebook-f'),
('LinkedIn Campaign Manager', 'Paid Acquisition (PPC)', 80, 'fab fa-linkedin-in'),
('TikTok Ads', 'Paid Acquisition (PPC)', 75, 'fab fa-tiktok'),
-- SEO
('Technical SEO & Audits', 'Search Engine Optimization', 90, 'fas fa-search-plus'),
('On-Page & Content Optimization', 'Search Engine Optimization', 94, 'fas fa-file-alt'),
('Keyword Research & Strategy', 'Search Engine Optimization', 95, 'fas fa-key'),
('Link Building & Outreach', 'Search Engine Optimization', 82, 'fas fa-link'),
-- Analytics
('GA4 & Tag Manager (GTM)', 'Marketing Tech & Analytics', 90, 'fas fa-chart-bar'),
('HubSpot CRM Marketing', 'Marketing Tech & Analytics', 85, 'fab fa-hubspot'),
('A/B Testing & CRO (VWO/Hotjar)', 'Marketing Tech & Analytics', 88, 'fas fa-flask'),
('Looker Studio Dashboards', 'Marketing Tech & Analytics', 80, 'fas fa-chart-pie'),
-- Retention
('Klaviyo / Mailchimp Automation', 'Retention & Email', 90, 'fas fa-envelope-open-text'),
('Customer Journey Mapping', 'Retention & Email', 88, 'fas fa-map-signs'),
('Lead Magnet & Funnel Strategy', 'Retention & Email', 92, 'fas fa-filter');

