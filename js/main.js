/* ============================================
   main.js — Navigation, Particles, Skills, Scroll, Cursor
   Digital Marketing Portfolio Edition
   ============================================ */

// ====== Year ======
document.getElementById('year').textContent = new Date().getFullYear();

// ====== Cursor and Scroll removed for cleaner look ======

// ====== Navbar scroll effect ======
const navbar   = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    let current = '';
    sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 140) current = sec.getAttribute('id');
    });
    navLinks.forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href') === '#' + current) a.classList.add('active');
    });
}, { passive: true });

// ====== Mobile Hamburger ======
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
});
document.querySelectorAll('.mobile-menu a').forEach(a => {
    a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
    });
});

// ====== Scroll Reveal ======
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), i * 60);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => revealObserver.observe(el));

// ====== Toast Notification ======
window.showToast = function (type, iconHtml, message) {
    const toast = document.getElementById('toast');
    const icon  = document.getElementById('toast-icon');
    const msg   = document.getElementById('toast-msg');
    toast.className     = 'toast ' + type;
    icon.innerHTML      = iconHtml;
    msg.textContent     = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4500);
};

// ====== Marketing Skills — Fallback Data ======
const FALLBACK_SKILLS = {
    'Search & Paid': [
        { name: 'SEO / Technical SEO',  icon_class: 'fas fa-search',        proficiency: 95 },
        { name: 'Google Ads (SEM)',      icon_class: 'fab fa-google',         proficiency: 92 },
        { name: 'Meta / Facebook Ads',   icon_class: 'fab fa-facebook',       proficiency: 90 },
        { name: 'LinkedIn Advertising',  icon_class: 'fab fa-linkedin',       proficiency: 82 },
    ],
    'Content & Social': [
        { name: 'Content Strategy',      icon_class: 'fas fa-pen-nib',        proficiency: 93 },
        { name: 'Social Media Growth',   icon_class: 'fas fa-hashtag',        proficiency: 90 },
        { name: 'Email Marketing',       icon_class: 'fas fa-envelope',       proficiency: 88 },
        { name: 'Copywriting',           icon_class: 'fas fa-feather-alt',    proficiency: 85 },
    ],
    'Analytics & Tools': [
        { name: 'Google Analytics 4',    icon_class: 'fas fa-chart-bar',      proficiency: 94 },
        { name: 'HubSpot CRM',           icon_class: 'fas fa-funnel-dollar',  proficiency: 86 },
        { name: 'Canva / Adobe Suite',   icon_class: 'fas fa-palette',        proficiency: 80 },
        { name: 'Marketing Automation',  icon_class: 'fas fa-robot',          proficiency: 83 },
    ],
};

// ====== Skills Loader ======
(async function loadSkills() {
    const container = document.getElementById('skills-container');
    if (!container) return;

    let skillData;

    try {
        const res  = await fetch('api/skills.php');
        const json = await res.json();
        if (json.success && Object.keys(json.data).length > 0) {
            skillData = json.data;
        } else {
            throw new Error('empty');
        }
    } catch (_) {
        skillData = FALLBACK_SKILLS;
    }

    renderSkills(skillData, container);
})();

function renderSkills(grouped, container) {
    let html = '';
    Object.entries(grouped).forEach(([category, skills]) => {
        html += `<div class="skill-category">
            <div class="skill-category-title">${category}</div>
            ${skills.map(s => `
            <div class="skill-item">
                <div class="skill-header">
                    <span class="skill-name"><i class="${s.icon_class || 'fas fa-chart-line'}"></i>${s.name}</span>
                    <span class="skill-pct">${s.proficiency}%</span>
                </div>
                <div class="skill-bar">
                    <div class="skill-fill" data-width="${s.proficiency}"></div>
                </div>
            </div>`).join('')}
        </div>`;
    });
    container.innerHTML = html;

    // Animate bars on scroll
    const fills = container.querySelectorAll('.skill-fill');
    const barObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.width = entry.target.dataset.width + '%';
                barObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    fills.forEach(fill => barObserver.observe(fill));
}

// ====== Particle Canvas Removed ======

// ====== Counter Animation for Result Cards ======
(function initCounters() {
    const counters = document.querySelectorAll('.result-num');
    if (!counters.length) return;

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el  = entry.target;
            const raw = el.textContent.trim();

            // Parse suffix like '+', '%', '$', 'M', 'K'
            const match = raw.match(/^(\$?)(\d+(?:\.\d+)?)([KMB+%]*)$/);
            if (!match) return;

            const prefix = match[1];
            const target = parseFloat(match[2]);
            const suffix = match[3];
            const duration = 1800;
            const start = performance.now();

            function step(now) {
                const progress = Math.min((now - start) / duration, 1);
                const ease     = 1 - Math.pow(1 - progress, 3);
                const current  = Math.floor(ease * target * 10) / 10;
                el.textContent = prefix + (Number.isInteger(target) ? Math.floor(ease * target) : current) + suffix;
                if (progress < 1) requestAnimationFrame(step);
                else el.textContent = raw;
            }

            requestAnimationFrame(step);
            counterObserver.unobserve(el);
        });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));
})();

// ====== 3D Card Tilt ======
(function initTilt() {
    document.addEventListener('mouseover', (e) => {
        const card = e.target.closest('.project-card, .service-card, .result-card');
        if (!card) return;
        card.addEventListener('mousemove', onMove);
        card.addEventListener('mouseleave', onLeave);
    });

    function onMove(e) {
        const rect = this.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width  - 0.5;
        const y = (e.clientY - rect.top)  / rect.height - 0.5;
        this.style.transform = `translateY(-8px) rotateX(${-y * 7}deg) rotateY(${x * 7}deg)`;
    }

    function onLeave() {
        this.style.transform = '';
        this.removeEventListener('mousemove', onMove);
        this.removeEventListener('mouseleave', onLeave);
    }
})();
