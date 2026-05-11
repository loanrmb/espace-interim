/* ============================================================
   ESPACE INTÉRIM — main.js
   - Nav scroll effect
   - Mobile menu toggle
   - Scroll reveal animations
   - Count-up animation on stats
   - Sector filter (annonces page)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ────────────────────────────────
     1. NAV — scroll effect
  ──────────────────────────────── */
  const nav = document.getElementById('nav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ────────────────────────────────
     2. MOBILE MENU
  ──────────────────────────────── */
  const burger = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      burger.setAttribute('aria-expanded', isOpen);
      // Animate burger to X
      burger.classList.toggle('active', isOpen);
    });

    // Close on link click
    mobileMenu.querySelectorAll('.mobile-link, a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        burger.classList.remove('active');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.remove('open');
        burger.classList.remove('active');
      }
    });
  }

  /* Burger X animation */
  const style = document.createElement('style');
  style.textContent = `
    .nav__burger.active span:nth-child(1) {
      transform: translateY(7px) rotate(45deg);
    }
    .nav__burger.active span:nth-child(2) {
      opacity: 0;
      transform: scaleX(0);
    }
    .nav__burger.active span:nth-child(3) {
      transform: translateY(-7px) rotate(-45deg);
    }
  `;
  document.head.appendChild(style);

  /* ────────────────────────────────
     3. SCROLL REVEAL
  ──────────────────────────────── */
  const reveals = document.querySelectorAll('.reveal');

  if (reveals.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(el => revealObserver.observe(el));
  }

  // Make hero elements visible immediately (they're above fold)
  setTimeout(() => {
    document.querySelectorAll('.hero .reveal').forEach(el => {
      el.classList.add('visible');
    });
  }, 100);

  /* ────────────────────────────────
     4. COUNT-UP ANIMATION
  ──────────────────────────────── */
  const statNums = document.querySelectorAll('.stat-item__num[data-target]');

  if (statNums.length > 0) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.target, 10);
          const duration = 1800; // ms
          const start = performance.now();

          const update = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * target);
            if (progress < 1) requestAnimationFrame(update);
          };

          requestAnimationFrame(update);
          countObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    statNums.forEach(el => countObserver.observe(el));
  }

  /* ────────────────────────────────
     5. SECTOR FILTER (annonces page)
  ──────────────────────────────── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const annonceItems = document.querySelectorAll('.annonce-item');
  const jobCount = document.getElementById('jobCount');

  if (filterBtns.length > 0 && annonceItems.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active state
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        let visible = 0;

        annonceItems.forEach(item => {
          const sector = item.dataset.sector;
          const show = filter === 'all' || sector === filter;
          item.classList.toggle('hidden', !show);
          if (show) visible++;
        });

        // Update count
        if (jobCount) {
          jobCount.textContent = `${visible} offre${visible > 1 ? 's' : ''}`;
        }
      });
    });

    // Init count
    if (jobCount) {
      jobCount.textContent = `${annonceItems.length} offres`;
    }
  }

  /* ────────────────────────────────
     6. SMOOTH SCROLL for anchor links
  ──────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navHeight = nav ? nav.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ────────────────────────────────
     7. CARD hover parallax (subtle)
  ──────────────────────────────── */
  const cards = document.querySelectorAll('.why-card, .sector-card, .offer-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-3px) rotateX(${-y * 3}deg) rotateY(${x * 3}deg)`;
      card.style.transition = 'transform 0.1s ease';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.32s cubic-bezier(.4,0,.2,1), box-shadow 0.32s cubic-bezier(.4,0,.2,1)';
    });
  });

});
