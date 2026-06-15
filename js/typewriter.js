/* ============================================
   Typewriter Effect — Sofia Chen Portfolio
   ============================================ */
(function () {
    const roles = [
        'strategic marketing',
        'compelling brand stories',
        'data-driven campaigns',
        'powerful SEO strategies',
        'community-driven growth',
        'high-converting content',
        'meaningful connections',
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
            setTimeout(tick, 2000);
            return;
        }

        if (!deleting) {
            el.textContent = current.slice(0, charIndex + 1);
            charIndex++;
            if (charIndex === current.length) {
                deleting = true;
                pauseBeforeDelete = true;
            }
            setTimeout(tick, 75 + Math.random() * 45);
        } else {
            el.textContent = current.slice(0, charIndex - 1);
            charIndex--;
            if (charIndex === 0) {
                deleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
            }
            setTimeout(tick, 38);
        }
    }

    setTimeout(tick, 1000);
})();
