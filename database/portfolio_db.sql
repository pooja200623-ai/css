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
INSERT INTO admin_users (username, password_hash) VALUES
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Sample Projects
INSERT INTO projects (title, description, tech_stack, live_url, github_url, category, featured) VALUES
('E-Commerce Platform', 'A full-featured online shopping platform with cart, checkout, payment gateway integration, and admin panel for product management.', 'PHP, MySQL, JavaScript, Bootstrap', '#', '#', 'Web', 1),
('Task Management App', 'A Kanban-style project management tool with drag-and-drop boards, real-time updates, team collaboration, and deadline tracking.', 'JavaScript, Node.js, MongoDB, Socket.io', '#', '#', 'App', 1),
('Restaurant Booking System', 'Online reservation system for restaurants with table management, email confirmations, and admin dashboard for bookings.', 'PHP, MySQL, jQuery, CSS3', '#', '#', 'Web', 1),
('Portfolio CMS', 'Content management system specifically designed for creative portfolios, with themes, media uploads, and analytics.', 'PHP, MySQL, JavaScript, AJAX', '#', '#', 'Web', 0),
('Weather Dashboard', 'Real-time weather dashboard using OpenWeather API showing forecasts, maps, and historical data with beautiful visualizations.', 'JavaScript, Chart.js, REST API, CSS3', '#', '#', 'API', 0),
('Blog Platform', 'Multi-user blogging platform with rich text editor, categories, tags, comments, and SEO optimization tools.', 'PHP, MySQL, TinyMCE, Bootstrap', '#', '#', 'Web', 0);

-- Sample Skills
INSERT INTO skills (name, category, proficiency, icon_class) VALUES
-- Frontend
('HTML5', 'Frontend', 95, 'fab fa-html5'),
('CSS3 / SCSS', 'Frontend', 90, 'fab fa-css3-alt'),
('JavaScript (ES6+)', 'Frontend', 88, 'fab fa-js-square'),
('React.js', 'Frontend', 78, 'fab fa-react'),
('Bootstrap', 'Frontend', 92, 'fab fa-bootstrap'),
-- Backend
('PHP', 'Backend', 90, 'fab fa-php'),
('Node.js', 'Backend', 72, 'fab fa-node-js'),
('REST APIs', 'Backend', 85, 'fas fa-server'),
('Laravel', 'Backend', 70, 'fab fa-laravel'),
-- Database
('MySQL', 'Database', 88, 'fas fa-database'),
('MongoDB', 'Database', 68, 'fas fa-leaf'),
('Redis', 'Database', 60, 'fas fa-layer-group'),
-- Tools
('Git / GitHub', 'Tools', 90, 'fab fa-github'),
('Docker', 'Tools', 65, 'fab fa-docker'),
('Linux / CLI', 'Tools', 78, 'fab fa-linux');
