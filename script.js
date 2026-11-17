// Dublin Family Chiropractic — interactions
(() => {
  const header = document.querySelector('.header');
  const nav = document.getElementById('nav');
  const toggle = document.querySelector('.nav-toggle');

  // Header shadow on scroll
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile menu
  const setMenu = (open) => {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  toggle.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => e.key === 'Escape' && setMenu(false));

  // Reveal on scroll
  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add('in'));
  }

  // Contact form: opens the visitor's email app addressed to the office
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const f = new FormData(form);
      const body = [
        `Name: ${f.get('name') || ''}`,
        `Phone: ${f.get('phone') || ''}`,
        `Email: ${f.get('email') || ''}`,
        '',
        f.get('message') || 'Hi, I am interested in scheduling an appointment!',
      ].join('\n');
      window.location.href = 'mailto:DrJamie@DublinFamilyChiropractic.com'
        + '?subject=' + encodeURIComponent('New Appointment')
        + '&body=' + encodeURIComponent(body);
    });
  }

  // Highlight today's hours
  const today = document.querySelector(`#hours-table tr[data-day="${new Date().getDay()}"]`);
  if (today) today.classList.add('today');

  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
