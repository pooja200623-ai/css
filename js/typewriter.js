/* ============================================
   Typewriter Effect — Digital Marketing Roles
   ============================================ */
(function () {
    const roles = [
        'Digital Marketing Strategist',
        'SEO & SEM Specialist',
        'Social Media Expert',
        'Content Marketing Pro',
        'PPC Campaign Manager',
        'Brand Growth Consultant',
        'Email Marketing Wizard',
    ];

    const el = document.getElementById('typewriter-text');
    if (!el) return;

    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let pauseBeforeDelete = false;

    function tick() {
        const current = roles[roleIndex];

        if (pauseBeforeDelete) {
            pauseBeforeDelete = false;
            setTimeout(tick, 1800);
            return;
        }

        if (!deleting) {
            el.textContent = current.slice(0, charIndex + 1);
            charIndex++;
            if (charIndex === current.length) {
                deleting = true;
                pauseBeforeDelete = true;
            }
            setTimeout(tick, 70 + Math.random() * 40);
        } else {
            el.textContent = current.slice(0, charIndex - 1);
            charIndex--;
            if (charIndex === 0) {
                deleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
            }
            setTimeout(tick, 40);
        }
    }

    setTimeout(tick, 900);
})();
