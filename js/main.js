// main.js — Priya Portfolio Scripts

const DESIGN_DATA = {
    1: {
        title: "Artisan Coffee Shop Promo Poster",
        category: "Poster Design",
        categoryClass: "poster",
        gradient: "linear-gradient(135deg, #2c1810 0%, #8b4513 50%, #d2691e 100%)",
        icon: "fa-coffee",
        industry: "Food & Beverage / Local Cafe",
        description: "A high-impact promotional poster created for an artisan bakery and coffee shop. Designed to attract morning commuters with warm ambient color grading, clear hierarchy, and bold calls-to-action.",
        specs: [
            { label: "Deliverables", value: "Print Poster (A3/A4 PDF) + IG Story & Feed Graphic" },
            { label: "Dimensions", value: "1080 x 1350 px (Digital) & 300 DPI High-Res PDF (Print)" },
            { label: "Primary Tools", value: "Canva Pro & Adobe Photoshop" },
            { label: "Color Palette", value: "Warm Espresso (#2C1810), Golden Cinnamon (#D2691E), Cream (#FFF8F0)" },
            { label: "Turnaround Time", value: "2 Days (Includes 2 Concepts & Revisions)" }
        ],
        tags: ["Coffee Shop", "Restaurant Poster", "Canva Pro", "Print Ready 300DPI", "Special Offer Banner"],
        mockupHeader: "SPECIAL BREW & BAKERY",
        mockupTagline: "Artisan Coffee · Fresh Daily",
        mockupPromo: "BUY 1 GET 1 FREE",
        mockupSub: "Every Morning 8 AM - 11 AM"
    },
    2: {
        title: "Restaurant Grand Opening Poster",
        category: "Poster Design",
        categoryClass: "poster",
        gradient: "linear-gradient(135deg, #1a000c 0%, #7b1113 50%, #d9381e 100%)",
        icon: "fa-utensils",
        industry: "Hospitality & Fine Dining",
        description: "Vibrant promotional poster announcing the launch of an authentic Indian restaurant. Uses rich burgundy and crimson gradients combined with high-contrast typography for maximum eye-catching appeal.",
        specs: [
            { label: "Deliverables", value: "A4 Flyer, Social Media Story, Print Poster & Whatsapp Broadcast Banner" },
            { label: "Dimensions", value: "1080 x 1920 px (Story) & A4 Print File (300 DPI CMYK)" },
            { label: "Primary Tools", value: "Canva Pro" },
            { label: "Color Palette", value: "Deep Crimson (#7B1113), Vibrant Saffron (#D9381E), Gold (#FFD700)" },
            { label: "Turnaround Time", value: "2 Days" }
        ],
        tags: ["Restaurant", "Grand Opening", "Food Flyer", "Print Ready", "Social Media Poster"],
        mockupHeader: "GRAND OPENING",
        mockupTagline: "Authentic Indian Flavors",
        mockupPromo: "FLAT 25% OFF ON DINING",
        mockupSub: "Reserve Your Table Now"
    },
    3: {
        title: "Fashion Boutique Summer Collection Sale",
        category: "Social Media Graphics",
        categoryClass: "social",
        gradient: "linear-gradient(135deg, #2a085c 0%, #6b21a8 50%, #db2777 100%)",
        icon: "fa-tshirt",
        industry: "Retail & Apparel",
        description: "Elegant pastel aesthetic Instagram carousel and ad post designed for a women's fashion boutique. Formatted for high engagement on social feeds.",
        specs: [
            { label: "Deliverables", value: "5-Slide Carousel Pack + Instagram Story + Meta Ad Creative" },
            { label: "Dimensions", value: "1080 x 1080 px Square & 1080 x 1920 px Vertical" },
            { label: "Primary Tools", value: "Canva Pro" },
            { label: "Color Palette", value: "Royal Purple (#6B21A8), Magenta Rose (#DB2777), Warm White" },
            { label: "Turnaround Time", value: "2 Days" }
        ],
        tags: ["Fashion Boutique", "Instagram Carousel", "Ad Creative", "Canva Template", "Summer Sale"],
        mockupHeader: "SUMMER COLLECTION '26",
        mockupTagline: "Chic & Elegant Apparel",
        mockupPromo: "UP TO 50% OFF",
        mockupSub: "Shop Online & In-Store"
    },
    4: {
        title: "Fitness Gym Promo Web & Rollup Banner",
        category: "Banner Design",
        categoryClass: "banner",
        gradient: "linear-gradient(135deg, #064e3b 0%, #047857 50%, #10b981 100%)",
        icon: "fa-dumbbell",
        industry: "Health, Gym & Fitness",
        description: "Energetic, high-contrast banner design for fitness clubs. Scalable from Facebook ad dimensions to physical 6ft x 3ft standee rollup banners.",
        specs: [
            { label: "Deliverables", value: "Website Banner, Meta Ad Graphic, Rollup Standee PDF" },
            { label: "Dimensions", value: "1200 x 628 px (Web) & 3ft x 6ft (Physical Rollup)" },
            { label: "Primary Tools", value: "Canva Pro & Illustrator" },
            { label: "Color Palette", value: "Emerald Dark (#064E3B), Neon Mint (#10B981), Charcoal" },
            { label: "Turnaround Time", value: "3 Days" }
        ],
        tags: ["Gym & Fitness", "Rollup Banner", "Facebook Ad", "High Contrast", "Print & Web"],
        mockupHeader: "TRANSFORM YOUR BODY",
        mockupTagline: "Join Elite Fitness Gym",
        mockupPromo: "50% OFF ANNUAL PASS",
        mockupSub: "Personal Training Included"
    },
    5: {
        title: "Traditional Indian Festival Poster",
        category: "Poster Design",
        categoryClass: "poster",
        gradient: "linear-gradient(135deg, #4c1d95 0%, #831843 50%, #f59e0b 100%)",
        icon: "fa-holly-berry",
        industry: "Cultural & Festival Event",
        description: "Rich traditional poster artwork for Diwali, Pongal, and festive shopping offers. Features royal purple tones, intricate gold mandala vectors, and festive typography.",
        specs: [
            { label: "Deliverables", value: "Festival Greeting Poster, Store Display Flyer, WhatsApp Banner" },
            { label: "Dimensions", value: "1080 x 1920 px & A3 Print Format" },
            { label: "Primary Tools", value: "Canva Pro" },
            { label: "Color Palette", value: "Royal Violet (#4C1D95), Festive Amber (#F59E0B), Warm Crimson" },
            { label: "Turnaround Time", value: "2 Days" }
        ],
        tags: ["Festival Poster", "Diwali & Pongal", "WhatsApp Status", "Gold Mandala", "Canva Pro"],
        mockupHeader: "HAPPY DIWALI & PONGAL",
        mockupTagline: "Festive Mega Offers",
        mockupPromo: "SPECIAL FESTIVAL OFFERS",
        mockupSub: "Joyful Greetings & Wishes"
    },
    6: {
        title: "Tech & Digital Agency Social Suite",
        category: "Social Media Graphics",
        categoryClass: "social",
        gradient: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #3b82f6 100%)",
        icon: "fa-laptop-code",
        industry: "Technology & Professional Services",
        description: "Clean dark-mode corporate social media post series designed for IT firms, marketing agencies, and SaaS startups. Builds trust and highlights core services.",
        specs: [
            { label: "Deliverables", value: "6 Social Posts + LinkedIn Header + Service Infographic" },
            { label: "Dimensions", value: "1080 x 1080 px & 1584 x 396 px (LinkedIn)" },
            { label: "Primary Tools", value: "Canva Pro" },
            { label: "Color Palette", value: "Midnight Navy (#0F172A), Electric Blue (#3B82F6), Slate" },
            { label: "Turnaround Time", value: "3 Days" }
        ],
        tags: ["Tech Agency", "LinkedIn Banner", "Dark Mode UI", "Infographic", "Corporate Post"],
        mockupHeader: "SCALE YOUR BUSINESS",
        mockupTagline: "Modern Tech & Cloud Solutions",
        mockupPromo: "FREE CONSULTATION",
        mockupSub: "LinkedIn & Meta Ad Suite"
    },
    7: {
        title: "E-Commerce Flash Sale Web Banner",
        category: "Banner Design",
        categoryClass: "banner",
        gradient: "linear-gradient(135deg, #7c2d12 0%, #c2410c 50%, #f97316 100%)",
        icon: "fa-shopping-bag",
        industry: "E-Commerce & Online Retail",
        description: "Dynamic promotional slider banner created for online stores. Designed to capture instant attention with bold discount badges and clear coupon codes.",
        specs: [
            { label: "Deliverables", value: "Shopify Hero Slider, Category Banner, Email Header" },
            { label: "Dimensions", value: "1920 x 700 px (Desktop) & 800 x 800 px (Mobile)" },
            { label: "Primary Tools", value: "Canva Pro & Photoshop" },
            { label: "Color Palette", value: "Flame Orange (#F97316), Deep Amber (#7C2D12), Pure White" },
            { label: "Turnaround Time", value: "2 Days" }
        ],
        tags: ["E-Commerce", "Shopify Banner", "Flash Sale", "Promo Code", "Conversion Focused"],
        mockupHeader: "MEGA SAVINGS FESTIVAL",
        mockupTagline: "Flat 40% Off Sitewide",
        mockupPromo: "USE CODE: PRIYA40",
        mockupSub: "Limited Time Offer"
    },
    8: {
        title: "Minimalist Brand Identity & Logo Kit",
        category: "Brand Identity",
        categoryClass: "branding",
        gradient: "linear-gradient(135deg, #18181b 0%, #3f3f46 50%, #d4d4d8 100%)",
        icon: "fa-palette",
        industry: "Small Business & Freelancers",
        description: "Comprehensive starter brand kit featuring logo design variations, brand color codes, typography recommendations, and print business card mockup.",
        specs: [
            { label: "Deliverables", value: "Logo Files (PNG/SVG/PDF), Color Palette Card, Font Pairings, Business Card PDF" },
            { label: "Dimensions", value: "Vector Master Files + Brand Guide Document" },
            { label: "Primary Tools", value: "Canva Pro & Illustrator" },
            { label: "Color Palette", value: "Monochrome Obsidian (#18181B), Platinum Silver (#D4D4D8)" },
            { label: "Turnaround Time", value: "4 Days" }
        ],
        tags: ["Brand Kit", "Logo Design", "Style Guide", "Business Card", "Canva Template"],
        mockupHeader: "BRAND STYLE GUIDE",
        mockupTagline: "Color Palette & Typography",
        mockupPromo: "MODERN MINIMALIST",
        mockupSub: "Logo Kit & Card Template"
    }
};

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
            navbar.classList.toggle('scrolled', window.scrollY > 40);
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Scroll-reveal for cards
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.service-card, .poster-card, .skill-group-card, .testimonial-card, .goal-card').forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.5s ease ${i * 80}ms, transform 0.5s ease ${i * 80}ms`;
        observer.observe(el);
    });

    // Setup interactive design showcase filters & modal lightbox
    setupDesignShowcase();

    // Contact form handler
    setupContactForm();
});

// Setup Design Showcase Filters & Lightbox Modal
function setupDesignShowcase() {
    const filterTabs = document.querySelectorAll('.design-tab');
    const designCards = document.querySelectorAll('#design-grid .poster-card');
    const modalOverlay = document.getElementById('design-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    if (filterTabs.length > 0 && designCards.length > 0) {
        filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                filterTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const filterValue = tab.getAttribute('data-filter');

                designCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');

                    if (filterValue === 'all' || cardCategory === filterValue) {
                        card.style.display = 'flex';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // Modal trigger event listeners
    document.querySelectorAll('[data-design-id]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const id = btn.getAttribute('data-design-id');
            openDesignModal(id);
        });
    });

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeDesignModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeDesignModal();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
            closeDesignModal();
        }
    });
}

function openDesignModal(id) {
    const data = DESIGN_DATA[id];
    const modalOverlay = document.getElementById('design-modal');
    if (!data || !modalOverlay) return;

    // Visual Mockup Box
    const visualBox = document.getElementById('modal-visual-box');
    if (visualBox) {
        visualBox.style.background = data.gradient;
        visualBox.innerHTML = `
            <div class="modal-mockup-card">
                <i class="fas ${data.icon}" style="font-size:2.8rem; margin-bottom:12px; color:#ffffff;"></i>
                <div class="mockup-header" style="font-size:1.3rem;">${data.mockupHeader}</div>
                <div class="mockup-tagline" style="font-size:0.85rem; margin-top:4px;">${data.mockupTagline}</div>
                <div class="mockup-promo" style="font-size:0.9rem; margin-top:12px; padding:5px 14px;">${data.mockupPromo}</div>
                <div class="mockup-sub" style="font-size:0.78rem; margin-top:8px;">${data.mockupSub}</div>
            </div>
        `;
    }

    // Category
    const categoryEl = document.getElementById('modal-category');
    if (categoryEl) categoryEl.textContent = data.category;

    // Title
    const titleEl = document.getElementById('modal-title');
    if (titleEl) titleEl.textContent = data.title;

    // Description
    const descEl = document.getElementById('modal-desc');
    if (descEl) descEl.textContent = data.description;

    // Specifications List
    const specsList = document.getElementById('modal-specs-list');
    if (specsList) {
        specsList.innerHTML = data.specs.map(spec => `
            <li><strong>${spec.label}:</strong> ${spec.value}</li>
        `).join('');
    }

    // Tags
    const tagsBox = document.getElementById('modal-tags-box');
    if (tagsBox) {
        tagsBox.innerHTML = data.tags.map(tag => `<span>#${tag}</span>`).join('');
    }

    // WhatsApp CTA link customize with design title
    const waBtn = document.getElementById('modal-wa-btn');
    if (waBtn) {
        const text = encodeURIComponent(`Hi Priya! I loved your "${data.title}" design in your portfolio and would like to discuss a similar project.`);
        waBtn.href = `https://wa.me/917530090915?text=${text}`;
    }

    modalOverlay.classList.add('active');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeDesignModal() {
    const modalOverlay = document.getElementById('design-modal');
    if (!modalOverlay) return;
    modalOverlay.classList.remove('active');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

// Setup AJAX contact form submission
function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    const statusDiv = document.getElementById('form-status');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (statusDiv) {
            statusDiv.className = 'form-status';
            statusDiv.innerHTML = '';
            statusDiv.style.display = 'none';
        }

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Send Message';

        const inputs = contactForm.querySelectorAll('input, textarea, button');
        inputs.forEach(el => el.disabled = true);
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        }

        try {
            const formData = new FormData();
            const nameVal    = document.getElementById('name').value;
            const emailVal   = document.getElementById('email').value;
            const subjectEl  = document.getElementById('subject');
            const subjectVal = subjectEl ? subjectEl.value : '';
            const msgVal     = document.getElementById('message').value;

            formData.append('name',    nameVal);
            formData.append('email',   emailVal);
            formData.append('message', msgVal);
            formData.append('subject', subjectVal || 'Design Enquiry from Portfolio');

            const response = await fetch('api/contact.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (response.ok && result.success) {
                if (statusDiv) {
                    statusDiv.className = 'form-status success';
                    statusDiv.innerHTML = `<i class="fas fa-check-circle" style="margin-right:8px"></i> ${result.message || 'Your message has been sent! I will get back to you soon.'}`;
                    statusDiv.style.display = 'block';
                }
                contactForm.reset();
            } else {
                let errorMsg = result.error || 'Something went wrong. Please try again.';
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
            inputs.forEach(el => el.disabled = false);
            if (submitBtn) {
                submitBtn.innerHTML = originalBtnText;
            }
        }
    });
}

