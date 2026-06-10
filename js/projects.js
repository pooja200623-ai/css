/* ============================================
   Projects Loader — Fetches from PHP API
   ============================================ */
(function () {
    const grid     = document.getElementById('projects-grid');
    const loading  = document.getElementById('projects-loading');
    const filterTabs = document.querySelectorAll('.filter-tab');
    if (!grid) return;

    // Gradient backgrounds for placeholder cards
    const placeholderGradients = [
        { bg: 'linear-gradient(135deg,#6366f1,#a855f7)', emoji: '🚀' },
        { bg: 'linear-gradient(135deg,#06b6d4,#6366f1)', emoji: '💡' },
        { bg: 'linear-gradient(135deg,#a855f7,#ec4899)', emoji: '⚡' },
        { bg: 'linear-gradient(135deg,#10b981,#06b6d4)', emoji: '🌐' },
        { bg: 'linear-gradient(135deg,#f59e0b,#ef4444)', emoji: '🎯' },
        { bg: 'linear-gradient(135deg,#8b5cf6,#06b6d4)', emoji: '🔥' },
    ];

    let allProjects = [];
    let currentFilter = 'All';

    async function fetchProjects() {
        loading.style.display = 'block';
        grid.innerHTML = '';

        try {
            const res = await fetch('api/projects.php');
            const json = await res.json();
            if (json.success) {
                allProjects = json.data;
                renderProjects(allProjects);
            } else {
                grid.innerHTML = '<p style="color:rgba(255,255,255,0.3);text-align:center;padding:40px;grid-column:1/-1">Failed to load projects.</p>';
            }
        } catch (err) {
            grid.innerHTML = '<p style="color:rgba(255,255,255,0.3);text-align:center;padding:40px;grid-column:1/-1">Could not connect. Make sure XAMPP is running.</p>';
        } finally {
            loading.style.display = 'none';
        }
    }

    function renderProjects(projects) {
        if (projects.length === 0) {
            grid.innerHTML = '<p style="color:rgba(255,255,255,0.3);text-align:center;padding:40px;grid-column:1/-1">No projects found.</p>';
            return;
        }

        grid.innerHTML = projects.map((p, i) => {
            const ph = placeholderGradients[i % placeholderGradients.length];
            const tags = p.tech_stack
                ? p.tech_stack.split(',').slice(0, 4).map(t => `<span class="project-tag">${t.trim()}</span>`).join('')
                : '';

            const imgHtml = p.image && p.image !== 'assets/images/project-placeholder.jpg'
                ? `<img src="${escHtml(p.image)}" alt="${escHtml(p.title)}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'project-img-placeholder\\' style=\\'background:${ph.bg}\\'>${ph.emoji}</div>'">`
                : `<div class="project-img-placeholder" style="background:${ph.bg}">${ph.emoji}</div>`;

            const liveBtn = p.live_url && p.live_url !== '#'
                ? `<a href="${escHtml(p.live_url)}" class="project-link live" target="_blank" rel="noopener"><i class="fas fa-external-link-alt"></i> Live</a>`
                : '';
            const ghBtn = p.github_url && p.github_url !== '#'
                ? `<a href="${escHtml(p.github_url)}" class="project-link github" target="_blank" rel="noopener"><i class="fab fa-github"></i> Code</a>`
                : '';

            const featuredBadge = parseInt(p.featured) ? '<span class="project-featured">★ Featured</span>' : '';

            return `
            <div class="project-card reveal" style="animation-delay:${i * 0.08}s">
                <div class="project-img">${imgHtml}</div>
                <div class="project-body">
                    <div class="project-meta">
                        <span class="project-category">${escHtml(p.category)}</span>
                        ${featuredBadge}
                    </div>
                    <h3 class="project-title">${escHtml(p.title)}</h3>
                    <p class="project-desc">${escHtml(p.description)}</p>
                    <div class="project-tags">${tags}</div>
                    <div class="project-links">${liveBtn}${ghBtn || (!liveBtn ? '<span style="font-size:13px;color:rgba(255,255,255,0.25)">In Development</span>' : '')}</div>
                </div>
            </div>`;
        }).join('');

        // Trigger reveal for newly added cards
        setTimeout(() => {
            document.querySelectorAll('#projects-grid .reveal').forEach(el => {
                el.classList.add('visible');
            });
        }, 50);
    }

    function applyFilter(filter) {
        currentFilter = filter;
        const filtered = filter === 'All' ? allProjects : allProjects.filter(p => p.category === filter);
        renderProjects(filtered);
    }

    filterTabs.forEach(tab => {
        tab.addEventListener('click', function () {
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            applyFilter(this.dataset.filter);
        });
    });

    function escHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    // Boot
    fetchProjects();
})();
