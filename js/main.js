// main.js - Portfolio Dynamic Scripts

document.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 40) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Initialize backend integration
    loadProjects('All');
    loadSkills();
    setupContactForm();
    setupFilters();
    setupModalEvents();
});

// Global cache for projects data
let allProjects = [];

// Fetch and render projects from backend API
async function loadProjects(category = 'All') {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;
    
    grid.innerHTML = `
        <div class="loading-state">
            <i class="fas fa-spinner fa-spin"></i> Loading case studies...
        </div>
    `;
    
    try {
        let url = 'api/projects.php';
        if (category !== 'All') {
            url += `?category=${encodeURIComponent(category)}`;
        }
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const result = await response.json();
        if (!result.success) throw new Error(result.error || 'Failed to fetch projects');
        
        allProjects = result.data;
        
    } catch (error) {
        console.warn('Backend API unavailable, falling back to static case studies:', error);
        allProjects = category === 'All' 
            ? FALLBACK_PROJECTS 
            : FALLBACK_PROJECTS.filter(p => p.category === category);
    }
    
    if (allProjects.length === 0) {
        grid.innerHTML = `
            <div class="error-state">
                <i class="fas fa-folder-open"></i>
                <p>No projects found in this category.</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = allProjects.map(project => {
        // Split tech stack by comma and clean up whitespace
        const tags = project.tech_stack 
            ? project.tech_stack.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
            : [];
            
        const tagsHtml = tags.map(tag => `<span class="project-tag">${tag}</span>`).join('');
        
        // Generate metrics preview badges
        let metricsPreviewHtml = '';
        if (project.key_metrics) {
            const previewMetrics = project.key_metrics.split(',').slice(0, 2);
            metricsPreviewHtml = `
                <div class="project-metrics-preview">
                    ${previewMetrics.map(m => `<span class="project-metric-pill"><i class="fas fa-chart-line"></i> ${m.trim()}</span>`).join('')}
                </div>
            `;
        }
        
        // Check if there's an image or render custom elegant gradient placeholder
        const imageHtml = project.image && project.image !== 'assets/images/project-placeholder.jpg'
            ? `<img src="${project.image}" alt="${project.title}">`
            : `
                <div class="project-image-placeholder">
                    <i class="fas fa-chart-line"></i>
                    <span>${project.category} Case Study</span>
                </div>
            `;
            
        return `
            <article class="project-card">
                <div class="project-image-wrapper" onclick="openCaseStudyModal(${project.id})" style="cursor:pointer">
                    <span class="project-category-badge">${project.category}</span>
                    ${imageHtml}
                </div>
                <div class="project-card-content">
                    ${metricsPreviewHtml}
                    <h3 onclick="openCaseStudyModal(${project.id})" style="cursor:pointer; transition: color 0.2s ease;">${project.title}</h3>
                    <p>${project.description}</p>
                    ${tags.length ? `<div class="project-tags">${tagsHtml}</div>` : ''}
                    <div class="project-links">
                        <button class="project-link" onclick="openCaseStudyModal(${project.id})" style="background:none;border:none;padding:0;cursor:pointer;font-family:inherit;"><i class="fas fa-file-alt"></i> Read Case Study</button>
                        ${project.live_url && project.live_url !== '#' ? `<a href="${project.live_url}" class="project-link" target="_blank"><i class="fas fa-external-link-alt"></i> Live Demo</a>` : ''}
                    </div>
                </div>
            </article>
        `;
    }).join('');
}

// Category metadata for icons, colors, and descriptions
const CATEGORY_META = {
    'Paid Acquisition (PPC)': {
        icon: 'fas fa-bullseye',
        color: '#e64d7a',
        gradient: 'linear-gradient(135deg, #e64d7a, #c75f8a)',
        glow: 'rgba(230, 77, 122, 0.25)',
        label: 'PPC & Paid Media'
    },
    'Search Engine Optimization': {
        icon: 'fas fa-search',
        color: '#7c5cbf',
        gradient: 'linear-gradient(135deg, #7c5cbf, #9b6fa5)',
        glow: 'rgba(124, 92, 191, 0.25)',
        label: 'SEO Strategy'
    },
    'Marketing Tech & Analytics': {
        icon: 'fas fa-chart-line',
        color: '#d4a57a',
        gradient: 'linear-gradient(135deg, #d4a57a, #c9855a)',
        glow: 'rgba(212, 165, 122, 0.25)',
        label: 'MarTech & Data'
    },
    'Retention & Email': {
        icon: 'fas fa-envelope-open-text',
        color: '#5bba8e',
        gradient: 'linear-gradient(135deg, #5bba8e, #3d9e72)',
        glow: 'rgba(91, 186, 142, 0.25)',
        label: 'Email & Retention'
    },
    'AI & Automations': {
        icon: 'fas fa-robot',
        color: '#4db8e8',
        gradient: 'linear-gradient(135deg, #4db8e8, #2590c9)',
        glow: 'rgba(77, 184, 232, 0.25)',
        label: 'AI & Automation'
    },
    'Content & Social Media': {
        icon: 'fas fa-share-alt',
        color: '#f07e3c',
        gradient: 'linear-gradient(135deg, #f07e3c, #d4602a)',
        glow: 'rgba(240, 126, 60, 0.25)',
        label: 'Content & Social'
    }
};

// Fetch and render skills grouped by category
async function loadSkills() {
    const container = document.getElementById('skills-container');
    if (!container) return;
    
    try {
        const response = await fetch('api/skills.php');
        if (!response.ok) throw new Error('Network response was not ok');
        
        const result = await response.json();
        if (!result.success) throw new Error(result.error || 'Failed to fetch skills');
        
        const groupedSkills = result.data;
        
        container.innerHTML = '';
        
        for (const [category, skills] of Object.entries(groupedSkills)) {
            const meta = CATEGORY_META[category] || {
                icon: 'fas fa-code',
                color: '#c75f8a',
                gradient: 'linear-gradient(135deg, #c75f8a, #9b6fa5)',
                glow: 'rgba(199, 95, 138, 0.25)',
                label: category
            };

            const skillCardsHtml = skills.map((skill, i) => {
                const icon = skill.icon_class || 'fas fa-code';
                const prof = skill.proficiency;
                // Tier label based on proficiency
                const tier = prof >= 95 ? 'Expert' : prof >= 85 ? 'Advanced' : prof >= 70 ? 'Proficient' : 'Familiar';
                const tierClass = prof >= 95 ? 'tier-expert' : prof >= 85 ? 'tier-advanced' : prof >= 70 ? 'tier-proficient' : 'tier-familiar';
                return `
                    <div class="skill-item" style="--skill-color:${meta.color};--skill-glow:${meta.glow};animation-delay:${i * 80}ms">
                        <div class="skill-info">
                            <span class="skill-name-wrapper">
                                <span class="skill-icon-wrap" style="background:${meta.gradient};box-shadow:0 4px 12px ${meta.glow}">
                                    <i class="${icon}"></i>
                                </span>
                                <span class="skill-name-text">${skill.name}</span>
                            </span>
                            <span class="skill-right">
                                <span class="skill-tier ${tierClass}">${tier}</span>
                                <span class="skill-proficiency" style="color:${meta.color}">${prof}%</span>
                            </span>
                        </div>
                        <div class="skill-progress-bar">
                            <div class="skill-progress-fill" data-proficiency="${prof}" style="--bar-gradient:${meta.gradient};--bar-glow:${meta.glow}"></div>
                        </div>
                    </div>
                `;
            }).join('');
            
            container.innerHTML += `
                <div class="skills-category" style="--cat-color:${meta.color};--cat-glow:${meta.glow}">
                    <div class="skills-category-header">
                        <div class="skills-cat-icon" style="background:${meta.gradient};box-shadow:0 8px 20px ${meta.glow}">
                            <i class="${meta.icon}"></i>
                        </div>
                        <div class="skills-cat-info">
                            <h3 class="skills-category-title">${category}</h3>
                            <span class="skills-cat-count">${skills.length} skill${skills.length !== 1 ? 's' : ''}</span>
                        </div>
                    </div>
                    <div class="skills-list">
                        ${skillCardsHtml}
                    </div>
                </div>
            `;
        }
        
        // Trigger progress bar animations with intersection observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const fills = entry.target.querySelectorAll('.skill-progress-fill');
                    fills.forEach((fill, i) => {
                        setTimeout(() => {
                            const prof = fill.getAttribute('data-proficiency');
                            fill.style.width = `${prof}%`;
                        }, i * 100);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(container);
        
    } catch (error) {
        console.error('Error loading skills:', error);
        container.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-circle"></i>
                <p>Failed to load skills. Please refresh the page.</p>
            </div>
        `;
    }
}

// Setup project filter tabs
function setupFilters() {
    const tabs = document.querySelectorAll('.filter-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            tab.classList.add('active');
            
            const category = tab.getAttribute('data-category');
            loadProjects(category);
        });
    });
}

// Setup AJAX contact form submission
function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    const statusDiv = document.getElementById('form-status');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Clear previous status
        if (statusDiv) {
            statusDiv.className = 'form-status';
            statusDiv.innerHTML = '';
            statusDiv.style.display = 'none';
        }
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Send Message';
        
        // Disable form inputs
        const inputs = contactForm.querySelectorAll('input, textarea, button');
        inputs.forEach(el => el.disabled = true);
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        }
        
        try {
            const formData = new FormData();
            
            // Map index.html form fields to match API inputs
            const nameVal = document.getElementById('name').value;
            const emailVal = document.getElementById('email').value;
            const msgVal = document.getElementById('message').value;
            
            formData.append('name', nameVal);
            formData.append('email', emailVal);
            formData.append('message', msgVal);
            formData.append('subject', 'Portfolio Contact Form Inquiry');
            
            const response = await fetch('api/contact.php', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (response.ok && result.success) {
                if (statusDiv) {
                    statusDiv.className = 'form-status success';
                    statusDiv.innerHTML = `<i class="fas fa-check-circle" style="margin-right:8px"></i> ${result.message}`;
                    statusDiv.style.display = 'block';
                }
                contactForm.reset();
            } else {
                let errorMsg = result.error || 'Failed to send your message. Please try again.';
                if (result.errors && result.errors.length) {
                    errorMsg = result.errors.join('<br>');
                }
                throw new Error(errorMsg);
            }
            
        } catch (error) {
            console.error('Contact Form Error:', error);
            if (statusDiv) {
                statusDiv.className = 'form-status error';
                statusDiv.innerHTML = `<i class="fas fa-exclamation-circle" style="margin-right:8px"></i> ${error.message}`;
                statusDiv.style.display = 'block';
            }
        } finally {
            // Re-enable form inputs
            inputs.forEach(el => el.disabled = false);
            if (submitBtn) {
                submitBtn.innerHTML = originalBtnText;
            }
        }
    });
}

// =========================================
// Case Study Modal Interactions & Fallbacks
// =========================================

// Open detailed case study modal
function openCaseStudyModal(projectId) {
    // Find project in the combined cache/fallback list
    let project = allProjects.find(p => p.id == projectId);
    if (!project) {
        project = FALLBACK_PROJECTS.find(p => p.id == projectId);
    }
    if (!project) return;

    // Populate modal text content
    document.getElementById('modal-category').textContent = project.category;
    document.getElementById('modal-title').textContent = project.title;
    document.getElementById('modal-problem').textContent = project.problem || project.description || 'No challenge description provided.';
    document.getElementById('modal-strategy').textContent = project.strategy || 'No solution description provided.';
    document.getElementById('modal-results').textContent = project.results || 'No results data provided.';

    // Populate metrics cards
    const metricsContainer = document.getElementById('modal-metrics-container');
    metricsContainer.innerHTML = '';
    
    if (project.key_metrics) {
        const metricsList = project.key_metrics.split(',').map(m => m.trim()).filter(m => m !== '');
        metricsList.forEach(metric => {
            const spaceIdx = metric.indexOf(' ');
            let val = metric;
            let lbl = 'Metric';
            if (spaceIdx > 0) {
                val = metric.substring(0, spaceIdx);
                lbl = metric.substring(spaceIdx + 1);
            }
            metricsContainer.innerHTML += `
                <div class="modal-metric-card">
                    <span class="modal-metric-val">${val}</span>
                    <span class="modal-metric-lbl">${lbl}</span>
                </div>
            `;
        });
    }

    // Populate tech stack
    const techStackContainer = document.getElementById('modal-tech-stack');
    techStackContainer.innerHTML = '';
    const tags = project.tech_stack 
        ? project.tech_stack.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
        : [];
    tags.forEach(tag => {
        techStackContainer.innerHTML += `<span class="project-tag">${tag}</span>`;
    });

    // Populate live/github links if any
    const sidebar = document.querySelector('.modal-sidebar');
    const existingLinkWidget = document.getElementById('modal-links-widget');
    if (existingLinkWidget) existingLinkWidget.remove();

    if ((project.live_url && project.live_url !== '#') || (project.github_url && project.github_url !== '#')) {
        const linksWidget = document.createElement('div');
        linksWidget.className = 'sidebar-widget';
        linksWidget.id = 'modal-links-widget';
        linksWidget.innerHTML = `
            <h4>Project Links</h4>
            <div class="sidebar-buttons">
                ${project.live_url && project.live_url !== '#' ? `<a href="${project.live_url}" class="btn btn-outline btn-block" target="_blank"><i class="fas fa-external-link-alt"></i> Live Demo</a>` : ''}
                ${project.github_url && project.github_url !== '#' ? `<a href="${project.github_url}" class="btn btn-outline btn-block" target="_blank"><i class="fab fa-github"></i> Repository</a>` : ''}
            </div>
        `;
        sidebar.insertBefore(linksWidget, sidebar.lastElementChild);
    }

    // Open Modal
    const modal = document.getElementById('case-study-modal');
    if (modal) {
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Prevent main page scrolling
    }
}

// Close detailed case study modal
function closeCaseStudyModal() {
    const modal = document.getElementById('case-study-modal');
    if (modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Restore main page scrolling
    }
}

// Bind modal events
function setupModalEvents() {
    const closeBtn = document.getElementById('modal-close-btn');
    const modal = document.getElementById('case-study-modal');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeCaseStudyModal);
    }
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeCaseStudyModal();
            }
        });
    }
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeCaseStudyModal();
        }
    });
}

// Fallback campaigns shown when API is unavailable (Offline Mode)
const FALLBACK_PROJECTS = [
    {
        id: 1,
        title: "E-Commerce SEO Overhaul",
        description: "Revamped complete SEO strategy for a premium fashion brand — boosting organic traffic by 312% and adding $180K in monthly organic revenue.",
        tech_stack: "Semrush, Google Search Console, Schema Markup, Content Clusters",
        live_url: "#",
        github_url: "",
        image: "assets/images/seo-case-study.jpg",
        category: "SEO",
        featured: 1,
        key_metrics: "312% Organic Traffic, +$180K Monthly Revenue, 14.5% Conversion Rate",
        problem: "The client, a premium fashion e-commerce brand, suffered from stagnant organic search visibility and a heavy reliance on paid acquisition. Their search presence was hindered by technical debt, slow page loads, duplicate product description content, and a lack of organized topical hubs.",
        strategy: "We executed a three-pronged SEO strategy: 1) Technical remediation, resolving indexation issues and implementing JSON-LD schema markup. 2) Topical authority building, clustering content around high-intent keywords. 3) Scalable digital PR campaigns to secure high-authority backlinks from major style and retail publications.",
        results: "Within 6 months, organic page-one keyword rankings increased by 420%. Organic traffic grew by 312%, translating directly into an additional $180,000 in monthly organic revenue. Technical optimizations also reduced bounce rates by 18%."
    },
    {
        id: 2,
        title: "SaaS Meta Ads Scaling",
        description: "Scaled B2B SaaS paid acquisition from $5,000 to $80,000/month in ad spend while maintaining a 4.2x ROAS through visual A/B testing and CAPI setup.",
        tech_stack: "Meta Ads Manager, CAPI (Conversion API), Smartly.io, VWO",
        live_url: "#",
        github_url: "",
        image: "assets/images/ppc-case-study.jpg",
        category: "PPC",
        featured: 1,
        key_metrics: "4.2x ROAS, 16x Paid Traffic Growth, -45% Customer Acquisition Cost",
        problem: "A B2B SaaS provider was struggling to scale their monthly paid acquisition spend beyond $5,000 while maintaining efficiency. Their Meta ad creatives were fatiguing rapidly, conversion tracking was dropping up to 25% of events due to browser restrictions, and targeting was too broad.",
        strategy: "We implemented the Meta Conversions API (CAPI) via server-side tagging to bypass cookie restrictions. We set up Smartly.io for automated creative asset variations and established a continuous A/B testing framework (VWO) on customized landing pages. We built narrow lookalike audiences based on high-LTV customers.",
        results: "Successfully scaled B2B SaaS paid acquisition from $5,000 to $80,000/month in ad spend. The campaign maintained an average 4.2x ROAS (Return on Ad Spend) and dropped customer acquisition cost (CAC) by 45%."
    },
    {
        id: 3,
        title: "Instagram Growth Campaign",
        description: "Designed organic social & influencer campaigns for a wellness brand, expanding reach from 3K to 95K followers with high engagement Reels.",
        tech_stack: "Instagram Reels, GRIN (Influencer Tool), Canva, Metricool",
        live_url: "#",
        github_url: "",
        image: "assets/images/social-case-study.jpg",
        category: "Social",
        featured: 0,
        key_metrics: "92K New Followers, +620% Engagement Rate, 34% DM-to-Sale Conversion",
        problem: "A boutique wellness brand had a high-quality product line but virtually zero social presence (stuck at 3K followers). Their content lacked cohesive aesthetic appeal, had low engagement, and failed to drive sales conversions.",
        strategy: "We developed a Reels-first content strategy focused on educational micro-videos and lifestyle aesthetics. Using GRIN, we identified and onboarded 25 micro-influencers for authentic product reviews. We also implemented automated Instagram DM funnel flows to instantly nurture post comments into purchase discounts.",
        results: "Expanded organic reach from 3K to 95K followers within 8 months. Reels generated over 4.2 million total views. Crucially, the automated DM funnel drove a 34% DM-to-sale conversion rate, representing a major new direct revenue stream."
    },
    {
        id: 4,
        title: "Email Automation Funnel",
        description: "Created high-converting automated welcome and cart-abandonment flows, generating $15K/month on autopilot with 42% open rate.",
        tech_stack: "Klaviyo, Shopify Integration, Copywriting, Figma",
        live_url: "#",
        github_url: "",
        image: "assets/images/email-case-study.jpg",
        category: "Email",
        featured: 1,
        key_metrics: "+$15K Monthly Autopilot Revenue, 42% Open Rate, 18% Click-Through Rate",
        problem: "An online coaching business had a list of 12,000 subscribers but was only sending sporadic broadcast newsletters. They had no automated nurture sequences or cart recovery systems, leaving substantial revenue on the table.",
        strategy: "We designed a highly segmented email lifecycle strategy using Klaviyo. We built a 7-stage welcome series, dynamic abandoned cart flows, and post-purchase cross-sell sequences. We also performed deep subscriber cleanups and implemented dedicated domain sending to maximize inbox deliverability.",
        results: "The automated welcome and cart-abandonment flows generated $15,000/month in recurring revenue on autopilot. The campaigns averaged a 42% open rate and a high-performing 18% click-through rate."
    },
    {
        id: 5,
        title: "Fintech Thought Leadership Hub",
        description: "Developed an industry blog, LinkedIn newsletter, and podcast ecosystem that drove 85% of inbound SaaS marketing leads.",
        tech_stack: "Content Strategy, Buzzsprout, LinkedIn Publishing, Medium",
        live_url: "#",
        github_url: "",
        image: "assets/images/content-case-study.jpg",
        category: "Content",
        featured: 0,
        key_metrics: "85% Inbound Lead Share, 1.2M Annual Pageviews, +240% Demo Bookings",
        problem: "A fintech startup was offering a complex B2B payment solution but had low brand credibility and difficulty explaining their value proposition to C-suite decision makers.",
        strategy: "We established a high-authority content hub centered on technical finance blogs, a LinkedIn newsletter, and a monthly industry podcast. We utilized content syndication on Medium and secured thought leadership guest columns for company executives in prominent financial news portals.",
        results: "The content ecosystem grew to drive 85% of all inbound marketing leads. Demo bookings increased by 240% year-over-year, and website pageviews crossed 1.2 million annually."
    },
    {
        id: 6,
        title: "Google Ads Lead Gen Engine",
        description: "Structured search and local service ads for a multi-location real estate franchise, achieving a 65% reduction in cost-per-lead.",
        tech_stack: "Google Ads Editor, Unbounce (Landing Pages), Zapier, Salesforce",
        live_url: "#",
        github_url: "",
        image: "assets/images/leadgen-case-study.jpg",
        category: "PPC",
        featured: 0,
        key_metrics: "-65% Cost-Per-Lead, +180% Lead Volume, 94% Quality Match Score",
        problem: "A multi-location real estate franchise was running Google Ads but suffered from high cost-per-lead ($80+), poor lead quality (junk forms), and inefficient budget allocation across regions.",
        strategy: "We rebuilt the Google Ads account from scratch with a single-theme ad group structure, added negative keyword lists, and restructured local service campaigns. We created custom landing pages integrated with Salesforce CRM to feed offline conversion data back to Google's bidding algorithm.",
        results: "Reduced the average cost-per-lead from $80 to $28 (a 65% reduction) while increasing overall lead volume by 180%. Lead quality match score rose to 94%, significantly improving sales team efficiency."
    }
];

