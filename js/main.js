// main.js — Priya Portfolio Scripts

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

    // Contact form handler
    setupContactForm();
});

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
