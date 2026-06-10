/* ============================================
   Contact Form — AJAX Submission
   ============================================ */
(function () {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const submitBtn = document.getElementById('submit-btn');

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

        const formData = new FormData(form);

        try {
            const response = await fetch('api/contact.php', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (result.success) {
                showToast('success', '<i class="fas fa-check-circle"></i>', result.message || 'Message sent successfully!');
                form.reset();
            } else {
                const msg = result.errors ? result.errors.join(' ') : (result.error || 'Something went wrong.');
                showToast('error', '<i class="fas fa-exclamation-circle"></i>', msg);
            }
        } catch (err) {
            showToast('error', '<i class="fas fa-exclamation-circle"></i>', 'Network error. Please try again.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        }
    });
})();
