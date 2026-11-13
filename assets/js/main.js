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

  const projectDialog = document.querySelector('.project-dialog');
  const projectDialogContent = projectDialog?.querySelector('.project-dialog-content');
  const projectDialogClose = projectDialog?.querySelector('.project-dialog-close');
  const openProjectDialog = card => {
    if (!projectDialog || !projectDialogContent) return;
    const title = card.querySelector('.project-copy h3')?.textContent.trim() || 'Project details';
    const image = card.querySelector('.project-art');
    const copy = card.querySelector('.project-copy');
    projectDialogContent.replaceChildren();

    const hero = document.createElement('div');
    hero.className = 'project-dialog-hero';
    if (image) {
      const imageCopy = image.cloneNode();
      imageCopy.removeAttribute('loading');
      hero.append(imageCopy);
    }
    const intro = document.createElement('div');
    intro.className = 'project-dialog-intro';
    const meta = copy?.querySelector('.project-meta')?.cloneNode(true);
    if (meta) intro.append(meta);
    const heading = document.createElement('h2');
    heading.id = 'project-dialog-title';
    heading.textContent = title;
    intro.append(heading);
    const description = copy?.querySelector(':scope > p')?.cloneNode(true);
    if (description) intro.append(description);
    const badges = copy?.querySelector('.project-badges')?.cloneNode(true);
    if (badges) intro.append(badges);
    hero.append(intro);
    projectDialogContent.append(hero);

    const technologies = copy?.querySelector('.project-tags');
    if (technologies) {
      const section = document.createElement('section');
      section.className = 'project-dialog-section project-dialog-tech';
      const label = document.createElement('h3');
      label.textContent = 'Tools & technology';
      section.append(label, technologies.cloneNode(true));
      projectDialogContent.append(section);
    }

    const caseStudy = copy?.querySelector('.project-case-study .case-study-grid');
    if (caseStudy) {
      const section = document.createElement('section');
      section.className = 'project-dialog-section';
      const label = document.createElement('h3');
      label.textContent = 'Project details';
      section.append(label, caseStudy.cloneNode(true));
      projectDialogContent.append(section);
    }

    const actions = copy?.querySelector('.project-actions');
    if (actions) {
      const section = document.createElement('div');
      section.className = 'project-dialog-actions';
      section.append(...Array.from(actions.children, action => action.cloneNode(true)));
      projectDialogContent.append(section);
    }

    projectDialog.showModal();
  };

  projectCards.forEach(card => {
    card.tabIndex = 0;
    card.setAttribute('aria-haspopup', 'dialog');
    card.addEventListener('click', event => {
      if (event.target.closest('a, button')) return;
      openProjectDialog(card);
    });
    card.addEventListener('keydown', event => {
      if (event.target !== card || !['Enter', ' '].includes(event.key)) return;
      event.preventDefault();
      openProjectDialog(card);
    });
  });

  projectDialogClose?.addEventListener('click', () => projectDialog?.close());
  projectDialog?.addEventListener('click', event => {
    if (event.target === projectDialog) projectDialog.close();
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
