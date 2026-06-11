/* ============================================
   main.js — Navigation, Particles, Skills, Scroll, Cursor
   Digital Marketing Portfolio Edition
   ============================================ */

// ====== Year ======
document.getElementById('year').textContent = new Date().getFullYear();

// ====== Custom Cursor ======
(function initCursor() {
    const cursor     = document.getElementById('cursor');
    const cursorRing = document.getElementById('cursor-ring');
    if (!cursor || !cursorRing) return;

    let mouseX = 0, mouseY = 0;
    let ringX  = 0, ringY  = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX + 'px';
        cursor.style.top  = mouseY + 'px';
    });

    function animateRing() {
        ringX += (mouseX - ringX) * 0.11;
        ringY += (mouseY - ringY) * 0.11;
        cursorRing.style.left = ringX + 'px';
        cursorRing.style.top  = ringY + 'px';
        requestAnimationFrame(animateRing);
    }
    animateRing();

    document.addEventListener('mouseleave', () => {
        cursor.style.opacity     = '0';
        cursorRing.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity     = '1';
        cursorRing.style.opacity = '1';
    });
    document.addEventListener('mousedown', () => {
        cursor.style.transform     = 'translate(-50%,-50%) scale(0.7)';
        cursorRing.style.transform = 'translate(-50%,-50%) scale(0.85)';
    });
    document.addEventListener('mouseup', () => {
        cursor.style.transform     = 'translate(-50%,-50%) scale(1)';
        cursorRing.style.transform = 'translate(-50%,-50%) scale(1)';
    });
})();

// ====== Scroll Progress Bar ======
const scrollBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
    const scrollTop   = document.documentElement.scrollTop;
    const scrollTotal = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    scrollBar.style.width = (scrollTop / scrollTotal * 100) + '%';
}, { passive: true });

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

// ====== Particle Canvas ======
(function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, particles;
    const COUNT  = 65;
    // Orange, violet, cyan palette matching brand
    const COLORS = ['rgba(249,115,22,', 'rgba(139,92,246,', 'rgba(6,182,212,', 'rgba(236,72,153,'];

    function resize() {
        W = canvas.width  = canvas.offsetWidth;
        H = canvas.height = canvas.offsetHeight;
    }

    function createParticle() {
        return {
            x:     Math.random() * W,
            y:     Math.random() * H,
            r:     Math.random() * 1.8 + 0.4,
            dx:    (Math.random() - 0.5) * 0.32,
            dy:    (Math.random() - 0.5) * 0.32,
            a:     Math.random() * 0.4 + 0.08,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
        };
    }

    function init() { resize(); particles = Array.from({ length: COUNT }, createParticle); }

    function draw() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.color + p.a + ')';
            ctx.fill();
            p.x += p.dx; p.y += p.dy;
            if (p.x < 0 || p.x > W) p.dx *= -1;
            if (p.y < 0 || p.y > H) p.dy *= -1;
        });
        // Connecting lines
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const d  = Math.sqrt(dx*dx + dy*dy);
                if (d < 110) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(249,115,22,${0.06 * (1 - d / 110)})`;
                    ctx.lineWidth   = 0.5;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize, { passive: true });
    init();
    draw();
})();

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
