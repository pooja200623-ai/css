/* ============================================
   main.js — Navigation, Particles, Skills, Scroll, Cursor
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

    // Smooth ring follow
    function animateRing() {
        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;
        cursorRing.style.left = ringX + 'px';
        cursorRing.style.top  = ringY + 'px';
        requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity     = '0';
        cursorRing.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity     = '1';
        cursorRing.style.opacity = '1';
    });

    // Click effect
    document.addEventListener('mousedown', () => {
        cursor.style.transform     = 'translate(-50%, -50%) scale(0.7)';
        cursorRing.style.transform = 'translate(-50%, -50%) scale(0.85)';
    });
    document.addEventListener('mouseup', () => {
        cursor.style.transform     = 'translate(-50%, -50%) scale(1)';
        cursorRing.style.transform = 'translate(-50%, -50%) scale(1)';
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
    if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Active link highlighting
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
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
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

// ====== Skills Loader ======
(async function loadSkills() {
    const container = document.getElementById('skills-container');
    if (!container) return;

    try {
        const res  = await fetch('api/skills.php');
        const json = await res.json();

        if (!json.success) throw new Error('API error');

        const grouped = json.data;
        let html = '<div class="skills-grid">';

        Object.entries(grouped).forEach(([category]) => {
            const skills = grouped[category];
            html += `<div class="skill-category">
                <div class="skill-category-title">${category}</div>
                ${skills.map(s => `
                <div class="skill-item">
                    <div class="skill-header">
                        <span class="skill-name"><i class="${s.icon_class || 'fas fa-code'}"></i>${s.name}</span>
                        <span class="skill-pct">${s.proficiency}%</span>
                    </div>
                    <div class="skill-bar">
                        <div class="skill-fill" data-width="${s.proficiency}"></div>
                    </div>
                </div>`).join('')}
            </div>`;
        });

        html += '</div>';
        container.innerHTML = html;

        // Animate bars when in view
        const fills = container.querySelectorAll('.skill-fill');
        const barObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const w = entry.target.dataset.width;
                    entry.target.style.width = w + '%';
                    barObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        fills.forEach(fill => barObserver.observe(fill));

    } catch (err) {
        container.innerHTML = '<p style="color:rgba(255,255,255,0.3);font-size:14px;padding:16px 0"><i class="fas fa-exclamation-circle" style="margin-right:8px"></i>Could not load skills. Make sure XAMPP is running.</p>';
    }
})();

// ====== Particle Canvas ======
(function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx    = canvas.getContext('2d');
    let W, H, particles;
    const COUNT  = 70;
    const COLORS = ['rgba(99,102,241,', 'rgba(168,85,247,', 'rgba(6,182,212,', 'rgba(236,72,153,'];

    function resize() {
        W = canvas.width  = canvas.offsetWidth;
        H = canvas.height = canvas.offsetHeight;
    }

    function createParticle() {
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        return {
            x:     Math.random() * W,
            y:     Math.random() * H,
            r:     Math.random() * 1.8 + 0.5,
            dx:    (Math.random() - 0.5) * 0.35,
            dy:    (Math.random() - 0.5) * 0.35,
            a:     Math.random() * 0.45 + 0.08,
            color,
        };
    }

    function init() {
        resize();
        particles = Array.from({ length: COUNT }, createParticle);
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.color + p.a + ')';
            ctx.fill();

            p.x += p.dx;
            p.y += p.dy;

            if (p.x < 0 || p.x > W) p.dx *= -1;
            if (p.y < 0 || p.y > H) p.dy *= -1;
        });

        // Draw connecting lines
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx   = particles[i].x - particles[j].x;
                const dy   = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(99,102,241,${0.07 * (1 - dist / 120)})`;
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

// ====== 3D Tilt on Project Cards ======
(function initTilt() {
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width  - 0.5;
            const y = (e.clientY - rect.top)  / rect.height - 0.5;
            card.style.transform = `translateY(-8px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
})();
