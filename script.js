function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

function initNavToggle() {
    const toggle = document.querySelector('.nav-toggle');
    const links = document.querySelector('.top-nav-links');
    if (!toggle || !links) return;
    toggle.addEventListener('click', () => {
        links.classList.toggle('open');
        toggle.classList.toggle('open');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initNavToggle();
    initSmoothScroll();
});
