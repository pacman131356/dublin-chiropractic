// Dublin Family Chiropractic — interactions
(() => {
  const header = document.querySelector('.header');
  const brand = header.querySelector('.brand');
  const icon = header.querySelector('.brand__icon');
  const toggle = header.querySelector('.nav-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const foldAway = header.querySelectorAll('.header__nav, .nav-toggle');
  const brandLabel = brand.getAttribute('aria-label');

  // ---- Folding header ----
  // Hysteresis: fold past FOLD_AT, unfold only back above UNFOLD_AT, so it
  // can never flicker when you hover around a single threshold.
  const FOLD_AT = 220;
  const UNFOLD_AT = 90;
  const REFOLD_AFTER = 240;  // px of scrolling after a manual open before refolding
  let collapsed = false;
  let openedAt = null;
  let ticking = false;

  // distance to slide the icon so it sits dead-center in the circle
  const measure = () => {
    const pill = header.querySelector('.header__pill').getBoundingClientRect();
    const b = brand.getBoundingClientRect();        // brand itself is never transformed
    const iconCenter = b.left + icon.offsetLeft + icon.offsetWidth / 2;
    header.style.setProperty('--icon-shift', `${(pill.left + pill.width / 2) - iconCenter}px`);
  };

  const setCollapsed = (state) => {
    if (state === collapsed) return;
    collapsed = state;
    header.classList.toggle('is-collapsed', state);
    foldAway.forEach((el) => el.toggleAttribute('inert', state));
    brand.setAttribute('aria-label', state ? 'Open navigation' : brandLabel);
  };

  const update = () => {
    ticking = false;
    if (header.classList.contains('menu-open')) return;
    const y = window.scrollY;
    if (y < UNFOLD_AT) { openedAt = null; setCollapsed(false); return; }
    if (openedAt !== null) {
      if (Math.abs(y - openedAt) > REFOLD_AFTER) { openedAt = null; setCollapsed(true); }
      return;
    }
    if (y > FOLD_AT) setCollapsed(true);
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };

  brand.addEventListener('click', (e) => {
    if (!collapsed) return;           // acts as the normal "home" link when unfolded
    e.preventDefault();
    openedAt = window.scrollY;
    setCollapsed(false);
  });

  measure();
  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', measure);
  if (document.fonts) document.fonts.ready.then(measure);

  // ---- Mobile menu ----
  const setMenu = (open) => {
    header.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  toggle.addEventListener('click', () => setMenu(!header.classList.contains('menu-open')));
  mobileNav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => e.key === 'Escape' && setMenu(false));
  document.addEventListener('click', (e) => {
    if (header.classList.contains('menu-open') && !header.contains(e.target)) setMenu(false);
  });

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
