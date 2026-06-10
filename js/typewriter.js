/* ============================================
   Typewriter Effect
   ============================================ */
(function () {
    const roles = [
        'Full-Stack Developer',
        'PHP & MySQL Expert',
        'JavaScript Enthusiast',
        'UI/UX Craftsman',
        'Problem Solver',
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
            setTimeout(tick, 1500);
            return;
        }

        if (!deleting) {
            el.textContent = current.slice(0, charIndex + 1);
            charIndex++;
            if (charIndex === current.length) {
                deleting = true;
                pauseBeforeDelete = true;
            }
            setTimeout(tick, 80 + Math.random() * 40);
        } else {
            el.textContent = current.slice(0, charIndex - 1);
            charIndex--;
            if (charIndex === 0) {
                deleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
            }
            setTimeout(tick, 45);
        }
    }

    // Small initial delay
    setTimeout(tick, 800);
})();
