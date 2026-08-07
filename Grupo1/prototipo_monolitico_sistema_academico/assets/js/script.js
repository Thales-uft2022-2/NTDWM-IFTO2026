const toggle = document.getElementById('menuToggle');
const menu = document.getElementById('mainMenu');

if (toggle && menu) {
    toggle.addEventListener('click', () => {
        menu.classList.toggle('open');
    });
}

document.querySelectorAll('[data-confirm]').forEach(link => {
    link.addEventListener('click', event => {
        if (!confirm(link.dataset.confirm)) event.preventDefault();
    });
});

document.querySelectorAll('.stat-card').forEach(card => {
    card.addEventListener('mouseenter', () => card.classList.add('active'));
    card.addEventListener('mouseleave', () => card.classList.remove('active'));
});