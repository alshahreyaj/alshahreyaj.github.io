(() => {
  const body = document.body;
  const menuToggle = document.querySelector('.mobile-nav-toggle');
  const navigation = document.querySelector('#primary-navigation');
  const navLinks = Array.from(document.querySelectorAll('#primary-navigation a[href^="#"]'));

  const closeMenu = () => {
    body.classList.remove('nav-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Open navigation');
  };

  menuToggle?.addEventListener('click', () => {
    const isOpen = !body.classList.contains('nav-open');
    body.classList.toggle('nav-open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });

  navigation?.addEventListener('click', event => {
    if (event.target.closest('a')) closeMenu();
  });

  document.addEventListener('click', event => {
    if (body.classList.contains('nav-open') && !event.target.closest('#primary-navigation, .mobile-nav-toggle')) closeMenu();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });

  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const target = `#${entry.target.id}`;
        navLinks.forEach(link => {
          const active = link.getAttribute('href') === target;
          link.closest('li')?.classList.toggle('active', active);
        });
      });
    }, {rootMargin: '-24% 0px -66% 0px'});
    document.querySelectorAll('.site-main > section[id]').forEach(section => sectionObserver.observe(section));
  }

  const filterButtons = Array.from(document.querySelectorAll('.project-filter'));
  const projectCards = Array.from(document.querySelectorAll('.project-card[data-category]'));
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      filterButtons.forEach(item => {
        const selected = item === button;
        item.classList.toggle('is-active', selected);
        item.setAttribute('aria-pressed', String(selected));
      });
      projectCards.forEach(card => {
        card.hidden = filter !== 'all' && card.dataset.category !== filter;
      });
    });
  });

  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const revealItems = document.querySelectorAll('[data-reveal]');
  if (!reduceMotion && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('reveal-ready');
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, {threshold: 0.08, rootMargin: '0px 0px -4% 0px'});
    revealItems.forEach(item => revealObserver.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }
})();
