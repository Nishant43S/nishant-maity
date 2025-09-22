document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar');            // uses your navbar
  const navbarCollapse = document.getElementById('navbarNav'); // matches your markup id
  if (!navbar) return;

  const animatedClasses = [
    'project-card',
    'about-section',
    'profile-container',
    'floating-particle',
    'skill-card'
  ];

  // Restart function (robust: toggles class + resets inline animation)
  function restartAnimationsIn(section) {
    animatedClasses.forEach(cls => {
      section.querySelectorAll('.' + cls).forEach(el => {
        // 1) toggle a trigger class (safe if you use .animate-reload in CSS)
        el.classList.remove('animate-reload');
        void el.offsetWidth; // force reflow
        el.classList.add('animate-reload');

        // 2) fallback: reset inline animation property to handle animations defined in other classes
        el.style.animation = 'none';
        // double rAF ensures browser applies 'none' then clears it
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            el.style.animation = '';
          });
        });
      });
    });
  }

  // Estimate a short delay so scroll finishes before we restart animations
  function estimateDelayForSection(section) {
    const distance = Math.abs(section.getBoundingClientRect().top);
    // clamp between 200ms and 1000ms
    return Math.min(1000, Math.max(200, Math.round(distance / 2)));
  }

  // Event delegation on navbar links
  navbar.addEventListener('click', (e) => {
    const link = e.target.closest('a.nav-link');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) return;

    const id = href.slice(1);
    const section = document.getElementById(id);
    if (!section) return;

    // prevent default so we can smooth-scroll and then restart animations reliably
    e.preventDefault();

    // If navbar is collapsed (mobile), hide it using Bootstrap API when available
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
      try {
        // Bootstrap 5 Collapse API
        const inst = bootstrap.Collapse.getInstance(navbarCollapse) || new bootstrap.Collapse(navbarCollapse, { toggle: false });
        inst.hide();
      } catch (err) {
        // fallback: remove show class
        navbarCollapse.classList.remove('show');
      }
    }

    // Smooth scroll to section
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Restart animations after an estimated delay
    const delay = estimateDelayForSection(section);
    setTimeout(() => restartAnimationsIn(section), delay);
  });

  // Also restart if user navigates using back/forward or direct hash changes
  window.addEventListener('hashchange', () => {
    const id = location.hash.replace('#', '');
    if (!id) return;
    const section = document.getElementById(id);
    if (section) {
      // small timeout to let browser complete jumping
      setTimeout(() => restartAnimationsIn(section), 200);
    }
  });

  // If page loads with a hash, restart that section's animations
  if (location.hash) {
    const id = location.hash.replace('#', '');
    const section = document.getElementById(id);
    if (section) setTimeout(() => restartAnimationsIn(section), 300);
  }
});