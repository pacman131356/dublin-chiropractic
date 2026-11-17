// Dublin Family Chiropractic — interactions
(() => {
  const header = document.querySelector('.header');
  const nav = document.getElementById('nav');
  const toggle = document.querySelector('.nav-toggle');

  // ---- Collapsing nav: folds into the circular logo badge on scroll ----
  const bar = header.querySelector('.header__bar');
  const brand = header.querySelector('.brand');
  const icon = header.querySelector('.brand__icon');
  const brandLabel = brand.getAttribute('aria-label');
  const COLLAPSE_AT = 260;   // px scrolled before folding up
  const TOP_ZONE = 140;      // always unfolded near the top
  const REFOLD_AFTER = 220;  // px of scrolling after a manual open before folding again
  let collapsed = false;
  let openedAt = null;       // scroll position where the user re-opened the bar

  const placeOrb = () => {
    const b = bar.getBoundingClientRect();
    const i = icon.getBoundingClientRect();
    bar.style.setProperty('--cx', `${i.left - b.left + i.width / 2}px`);
    bar.style.setProperty('--cy', `${i.top - b.top + i.height / 2}px`);
  };

  const setCollapsed = (state) => {
    if (state === collapsed) return;
    collapsed = state;
    header.classList.toggle('is-collapsed', state);
    // keep hidden links out of the tab order / screen readers while folded
    nav.toggleAttribute('inert', state);
    toggle.toggleAttribute('inert', state);
    brand.setAttribute('aria-label', state ? 'Open navigation menu' : brandLabel);
    brand.setAttribute('aria-expanded', String(!state));
  };

  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 10);
    if (nav.classList.contains('open')) return;       // never fold while the mobile menu is open
    if (y < TOP_ZONE) { openedAt = null; setCollapsed(false); return; }
    if (openedAt !== null) {
      if (Math.abs(y - openedAt) > REFOLD_AFTER) { openedAt = null; setCollapsed(true); }
      return;
    }
    if (y > COLLAPSE_AT) setCollapsed(true);
  };

  brand.addEventListener('click', (e) => {
    if (!collapsed) return;                            // normal "home" link when unfolded
    e.preventDefault();
    openedAt = window.scrollY;
    setCollapsed(false);
  });

  placeOrb();
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', placeOrb);
  document.fonts && document.fonts.ready.then(placeOrb);

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
