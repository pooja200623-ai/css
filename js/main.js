// main.js - Portfolio Dynamic Scripts

document.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
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
});

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
        
        const projects = result.data;
        
        if (projects.length === 0) {
            grid.innerHTML = `
                <div class="error-state">
                    <i class="fas fa-folder-open"></i>
                    <p>No projects found in this category.</p>
                </div>
            `;
            return;
        }
        
        grid.innerHTML = projects.map(project => {
            // Split tech stack by comma and clean up whitespace
            const tags = project.tech_stack 
                ? project.tech_stack.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
                : [];
                
            const tagsHtml = tags.map(tag => `<span class="project-tag">${tag}</span>`).join('');
            
            // Generate clean links
            let linksHtml = '';
            if (project.live_url && project.live_url !== '#') {
                linksHtml += `<a href="${project.live_url}" class="project-link" target="_blank"><i class="fas fa-external-link-alt"></i> Live Demo</a>`;
            }
            if (project.github_url && project.github_url !== '#') {
                linksHtml += `<a href="${project.github_url}" class="project-link" target="_blank"><i class="fab fa-github"></i> Repository</a>`;
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
                    <div class="project-image-wrapper">
                        <span class="project-category-badge">${project.category}</span>
                        ${imageHtml}
                    </div>
                    <div class="project-card-content">
                        <h3>${project.title}</h3>
                        <p>${project.description}</p>
                        ${tags.length ? `<div class="project-tags">${tagsHtml}</div>` : ''}
                        ${linksHtml ? `<div class="project-links">${linksHtml}</div>` : ''}
                    </div>
                </article>
            `;
        }).join('');
        
    } catch (error) {
        console.error('Error loading projects:', error);
        grid.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-circle"></i>
                <p>Failed to load case studies. Please refresh the page.</p>
            </div>
        `;
    }
}

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
            const skillCardsHtml = skills.map(skill => {
                const icon = skill.icon_class || 'fas fa-code';
                return `
                    <div class="skill-item">
                        <div class="skill-info">
                            <span class="skill-name-wrapper">
                                <i class="${icon}"></i>
                                <span>${skill.name}</span>
                            </span>
                            <span class="skill-proficiency">${skill.proficiency}%</span>
                        </div>
                        <div class="skill-progress-bar">
                            <div class="skill-progress-fill" data-proficiency="${skill.proficiency}"></div>
                        </div>
                    </div>
                `;
            }).join('');
            
            container.innerHTML += `
                <div class="skills-category">
                    <h3 class="skills-category-title">${category}</h3>
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
                    fills.forEach(fill => {
                        const prof = fill.getAttribute('data-proficiency');
                        fill.style.width = `${prof}%`;
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        
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

