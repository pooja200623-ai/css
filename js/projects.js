/* ============================================
   Projects / Campaigns Loader — Digital Marketing
   ============================================ */
(function () {
    const grid       = document.getElementById('projects-grid');
    const loading    = document.getElementById('projects-loading');
    const filterTabs = document.querySelectorAll('.filter-tab');
    if (!grid) return;

    // Gradient backgrounds for placeholder cards
    const placeholderGradients = [
        { bg: 'linear-gradient(135deg,#f97316,#ec4899)', emoji: '📈' },
        { bg: 'linear-gradient(135deg,#8b5cf6,#06b6d4)', emoji: '🔍' },
        { bg: 'linear-gradient(135deg,#06b6d4,#10b981)', emoji: '📱' },
        { bg: 'linear-gradient(135deg,#f59e0b,#f97316)', emoji: '📧' },
        { bg: 'linear-gradient(135deg,#ec4899,#8b5cf6)', emoji: '🚀' },
        { bg: 'linear-gradient(135deg,#10b981,#06b6d4)', emoji: '💡' },
    ];

    // Fallback campaigns shown when API is unavailable
    const FALLBACK_CAMPAIGNS = [
        {
            id: 1, title: 'E-Commerce SEO Overhaul',
            category: 'SEO',
            description: 'Revamped complete SEO strategy for a fashion e-commerce brand — boosting organic traffic by 312% and revenue by $180K in 6 months.',
            tech_stack: 'Technical SEO, Schema Markup, Link Building, Content Clusters, GA4',
            live_url: '#', github_url: '', featured: 1,
        },
        {
            id: 2, title: 'SaaS Meta Ads Campaign',
            category: 'PPC',
            description: 'Scaled a B2B SaaS company\'s paid social from $5K to $80K/month ad spend while maintaining a 4.2x ROAS through audience optimization.',
            tech_stack: 'Meta Ads, Lookalike Audiences, Retargeting, A/B Testing, Creative Strategy',
            live_url: '#', github_url: '', featured: 1,
        },
        {
            id: 3, title: 'Instagram Growth Strategy',
            category: 'Social',
            description: 'Grew a wellness brand\'s Instagram from 3K to 95K followers organically in 8 months, achieving 34% DM-to-sale conversion rate.',
            tech_stack: 'Instagram, Reels Strategy, Hashtag Research, Influencer Collab, Analytics',
            live_url: '#', github_url: '', featured: 0,
        },
        {
            id: 4, title: 'Email Automation Funnel',
            category: 'Email',
            description: 'Built a 12-email nurture sequence for a coaching business generating $15K/month on autopilot with 42% open rate and 18% CTR.',
            tech_stack: 'Klaviyo, Segmentation, A/B Testing, Copywriting, Behavioral Triggers',
            live_url: '#', github_url: '', featured: 1,
        },
        {
            id: 5, title: 'B2B Content Marketing Hub',
            category: 'Content',
            description: 'Developed a full content ecosystem — blog, LinkedIn, newsletter — that drove 85% of inbound leads for a fintech startup.',
            tech_stack: 'Content Strategy, SEO Writing, LinkedIn Newsletter, Thought Leadership',
            live_url: '#', github_url: '', featured: 0,
        },
        {
            id: 6, title: 'Google Ads Lead Gen Machine',
            category: 'PPC',
            description: 'Managed $50K/month Google Ads account for a real estate firm, achieving $28 cost-per-lead — 65% below industry average.',
            tech_stack: 'Google Ads, Search & Display, Conversion Tracking, Landing Page CRO',
            live_url: '#', github_url: '', featured: 0,
        },
    ];

    let allProjects  = [];
    let currentFilter = 'All';

    async function fetchProjects() {
        loading.style.display = 'block';
        grid.innerHTML = '';

        try {
            const res  = await fetch('api/projects.php');
            const json = await res.json();
            if (json.success && json.data && json.data.length > 0) {
                allProjects = json.data;
            } else {
                throw new Error('empty');
            }
        } catch (_) {
            allProjects = FALLBACK_CAMPAIGNS;
        } finally {
            loading.style.display = 'none';
            renderProjects(allProjects);
        }
    }

    function renderProjects(projects) {
        if (!projects.length) {
            grid.innerHTML = '<p style="color:rgba(255,255,255,0.3);text-align:center;padding:40px;grid-column:1/-1">No campaigns found.</p>';
            return;
        }

        grid.innerHTML = projects.map((p, i) => {
            const ph   = placeholderGradients[i % placeholderGradients.length];
            const tags = p.tech_stack
                ? p.tech_stack.split(',').slice(0, 4).map(t => `<span class="project-tag">${t.trim()}</span>`).join('')
                : '';

            const imgHtml = p.image && p.image !== 'assets/images/project-placeholder.jpg'
                ? `<img src="${escHtml(p.image)}" alt="${escHtml(p.title)}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'project-img-placeholder\\' style=\\'background:${ph.bg}\\'>${ph.emoji}</div>'">`
                : `<div class="project-img-placeholder" style="background:${ph.bg}">${ph.emoji}</div>`;

            const liveBtn = p.live_url && p.live_url !== '#'
                ? `<a href="${escHtml(p.live_url)}" class="project-link live" target="_blank" rel="noopener"><i class="fas fa-external-link-alt"></i> View Case Study</a>`
                : `<a href="#contact" class="project-link live"><i class="fas fa-envelope"></i> Request Details</a>`;

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
                    <div class="project-links">${liveBtn}</div>
                </div>
            </div>`;
        }).join('');

        setTimeout(() => {
            document.querySelectorAll('#projects-grid .reveal').forEach(el => el.classList.add('visible'));
        }, 50);
    }

    function applyFilter(filter) {
        currentFilter = filter;
        // Map display labels to data categories
        const filterMap = {
            'All':     'All',
            'SEO':     'SEO',
            'Social':  'Social',
            'PPC':     'PPC',
            'Content': 'Content',
            'Email':   'Email',
        };
        const mapped   = filterMap[filter] || filter;
        const filtered = mapped === 'All' ? allProjects : allProjects.filter(p => p.category === mapped);
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

    fetchProjects();
})();
