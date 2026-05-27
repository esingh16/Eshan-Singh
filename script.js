/* ══════════════════════════════════════════════════════════
   ESHAN SINGH PORTFOLIO — script.js
══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────
     1. CUSTOM CURSOR
  ───────────────────────────────────────── */
  const cursorDot  = document.getElementById('cursor');
  const follower   = document.getElementById('follower');
  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let fx = mx, fy = my;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursorDot.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
  });

  // Smooth follower
  function animateFollower() {
    fx += (mx - fx) * 0.1;
    fy += (my - fy) * 0.1;
    follower.style.transform = `translate(${fx - 16}px, ${fy - 16}px)`;
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover effect
  const interactables = document.querySelectorAll(
    'a, button, .pop-card, .skill-tab, .skill-tag-cloud span, .proj-stack span, .tl-tags span, .lang-tag, .social-chip, .ec-chips span'
  );
  interactables.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  /* ─────────────────────────────────────────
     2. THEME TOGGLE (Light / Dark)
  ───────────────────────────────────────── */
  const html        = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');

  // Persist preference
  const savedTheme = localStorage.getItem('es-theme') || 'light';
  html.setAttribute('data-theme', savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('es-theme', next);

    // Re-animate skill bars on theme change
    animateBarsInView();
  });

  /* ─────────────────────────────────────────
     3. NAV — scroll behaviour + hamburger
  ───────────────────────────────────────── */
  const nav       = document.getElementById('nav');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
    updateActiveNav();
  }, { passive: true });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close mobile menu on link click
  document.querySelectorAll('.nl').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // Active nav link
  function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
    });
    document.querySelectorAll('.nl').forEach(link => {
      link.style.color = '';
      if (link.getAttribute('href') === `#${current}`) {
        link.style.color = 'var(--jade)';
      }
    });
  }

  /* ─────────────────────────────────────────
     4. AOS — Animate On Scroll (custom)
  ───────────────────────────────────────── */
  const aosEls = document.querySelectorAll('[data-aos]');

  const aosObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el    = entry.target;
        const delay = parseInt(el.getAttribute('data-aos-delay') || 0);
        setTimeout(() => el.classList.add('aos-animate'), delay);
        aosObserver.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  aosEls.forEach(el => aosObserver.observe(el));

  /* ─────────────────────────────────────────
     5. COUNTER ANIMATION (stats strip)
  ───────────────────────────────────────── */
  const statNums = document.querySelectorAll('.stat-num[data-count]');
  let countersStarted = false;

  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersStarted) {
        countersStarted = true;
        statNums.forEach(el => {
          const target   = parseInt(el.getAttribute('data-count'));
          const duration = 1600;
          const start    = performance.now();

          function update(now) {
            const elapsed  = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * target);
            if (progress < 1) requestAnimationFrame(update);
          }
          requestAnimationFrame(update);
        });
        counterObserver.disconnect();
      }
    });
  }, { threshold: 0.5 });

  const statsStrip = document.querySelector('.stats-strip');
  if (statsStrip) counterObserver.observe(statsStrip);

  /* ─────────────────────────────────────────
     6. SKILL TABS
  ───────────────────────────────────────── */
  const skillTabs   = document.querySelectorAll('.skill-tab');
  const skillPanels = document.querySelectorAll('.skill-panel');

  skillTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active from all
      skillTabs.forEach(t  => t.classList.remove('active'));
      skillPanels.forEach(p => p.classList.remove('active'));

      // Activate clicked
      tab.classList.add('active');
      const panel = document.getElementById(`tab-${tab.dataset.tab}`);
      if (panel) {
        panel.classList.add('active');
        // Animate bars in new panel
        setTimeout(() => animateBarsInPanel(panel), 60);
      }
    });
  });

  /* ─────────────────────────────────────────
     7. SKILL BAR ANIMATION
  ───────────────────────────────────────── */
  function animateBarsInPanel(panel) {
    const fills = panel.querySelectorAll('.sk-fill');
    fills.forEach((fill, i) => {
      fill.classList.remove('animated');
      setTimeout(() => fill.classList.add('animated'), i * 80);
    });
  }

  function animateBarsInView() {
    const activePanel = document.querySelector('.skill-panel.active');
    if (activePanel) animateBarsInPanel(activePanel);
  }

  // Animate bars when skills section enters view
  const skillsSection = document.getElementById('skills');
  const barsObserver  = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateBarsInView();
        barsObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });

  if (skillsSection) barsObserver.observe(skillsSection);

  /* ─────────────────────────────────────────
     8. SMOOTH SCROLL
  ───────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 70;
        const top    = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ─────────────────────────────────────────
     9. HERO TEXT — staggered reveal
  ───────────────────────────────────────── */
  const heroLines = document.querySelectorAll('.hl-line');
  heroLines.forEach((line, i) => {
    line.style.opacity = '0';
    line.style.transform = 'translateY(32px)';
    line.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    setTimeout(() => {
      line.style.opacity = '1';
      line.style.transform = 'translateY(0)';
    }, 200 + i * 120);
  });

  /* ─────────────────────────────────────────
     10. TYPING EFFECT — hero eyebrow
  ───────────────────────────────────────── */
  const eyebrow  = document.querySelector('.hero-eyebrow span:last-child');
  if (eyebrow) {
    const text     = eyebrow.textContent;
    eyebrow.textContent = '';
    eyebrow.style.opacity = '1';
    let i = 0;
    setTimeout(() => {
      const type = setInterval(() => {
        if (i < text.length) {
          eyebrow.textContent += text[i++];
        } else {
          clearInterval(type);
        }
      }, 38);
    }, 800);
  }

  /* ─────────────────────────────────────────
     11. PARALLAX — hero orbs
  ───────────────────────────────────────── */
  const orbs = document.querySelectorAll('.orb');
  window.addEventListener('mousemove', e => {
    const cx = (e.clientX / window.innerWidth  - 0.5) * 2;
    const cy = (e.clientY / window.innerHeight - 0.5) * 2;
    orbs.forEach((orb, i) => {
      const depth = (i + 1) * 8;
      orb.style.transform = `translate(${cx * depth}px, ${cy * depth}px)`;
    });
  }, { passive: true });

  /* ─────────────────────────────────────────
     12. CARD TILT EFFECT
  ───────────────────────────────────────── */
  const tiltCards = document.querySelectorAll('.proj-card, .about-card, .cert-item');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const cx     = (e.clientX - rect.left) / rect.width  - 0.5;
      const cy     = (e.clientY - rect.top)  / rect.height - 0.5;
      const tiltX  = cy * -8;
      const tiltY  = cx * 8;
      card.style.transform = `translateY(-6px) scale(1.01) perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ─────────────────────────────────────────
     13. GLOW FOLLOW — cards
  ───────────────────────────────────────── */
  const glowCards = document.querySelectorAll('.tl-card, .edu-card');
  glowCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x    = e.clientX - rect.left;
      const y    = e.clientY - rect.top;
      card.style.background = `
        radial-gradient(
          circle 200px at ${x}px ${y}px,
          var(--jade-dim),
          var(--surface) 60%
        )
      `;
    });
    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });

  /* ─────────────────────────────────────────
     14. SCROLL PROGRESS BAR
  ───────────────────────────────────────── */
  const progressBar = document.createElement('div');
  progressBar.id    = 'scrollProgress';
  progressBar.style.cssText = `
    position: fixed; top: 0; left: 0; z-index: 9999;
    height: 3px; width: 0%;
    background: linear-gradient(90deg, var(--jade), var(--teal), var(--saffron));
    transition: width 0.1s linear;
    pointer-events: none;
  `;
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const docH  = document.documentElement.scrollHeight - window.innerHeight;
    const pct   = docH > 0 ? (window.scrollY / docH) * 100 : 0;
    progressBar.style.width = `${pct}%`;
  }, { passive: true });

  /* ─────────────────────────────────────────
     15. BACK TO TOP — smooth reveal
  ───────────────────────────────────────── */
  const backTop = document.querySelector('.back-top');
  if (backTop) {
    backTop.style.transition = 'opacity 0.3s, transform 0.3s';
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backTop.style.opacity = '1';
        backTop.style.pointerEvents = 'auto';
      } else {
        backTop.style.opacity = '0.4';
      }
    }, { passive: true });
  }

  /* ─────────────────────────────────────────
     16. SECTION ENTRANCE — enhanced stagger
  ───────────────────────────────────────── */
  const staggerGroups = [
    '.about-cards .about-card',
    '.tl-item',
    '.proj-card',
    '.cert-item',
    '.clink',
  ];
  staggerGroups.forEach(selector => {
    const items = document.querySelectorAll(selector);
    items.forEach((item, i) => {
      if (!item.hasAttribute('data-aos')) {
        item.setAttribute('data-aos', 'fade-up');
        item.setAttribute('data-aos-delay', String(i * 80));
        aosObserver.observe(item);
      }
    });
  });

  /* ─────────────────────────────────────────
     17. EASTER EGG — Konami code
  ───────────────────────────────────────── */
  const konami = [38,38,40,40,37,39,37,39,66,65];
  let kIdx = 0;
  document.addEventListener('keydown', e => {
    if (e.keyCode === konami[kIdx]) {
      kIdx++;
      if (kIdx === konami.length) {
        kIdx = 0;
        showEasterEgg();
      }
    } else {
      kIdx = 0;
    }
  });
  function showEasterEgg() {
    const msg = document.createElement('div');
    msg.textContent = '🎉 You found the Easter Egg! Eshan Singh — Building the future, one model at a time.';
    msg.style.cssText = `
      position:fixed; bottom:32px; left:50%; transform:translateX(-50%);
      background:var(--jade); color:#fff; padding:16px 28px;
      border-radius:999px; font-size:14px; font-weight:600;
      z-index:9999; box-shadow:0 8px 32px var(--glow-jade);
      animation: slideUp 0.4s ease;
      white-space: nowrap;
    `;
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 4000);
  }

  /* ─────────────────────────────────────────
     18. MAGNETIC BUTTONS
  ───────────────────────────────────────── */
  const magnetBtns = document.querySelectorAll('.btn-main, .btn-outline, .nav-resume-btn');
  magnetBtns.forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const cx   = e.clientX - rect.left - rect.width  / 2;
      const cy   = e.clientY - rect.top  - rect.height / 2;
      btn.style.transform = `translateY(-3px) translate(${cx * 0.15}px, ${cy * 0.15}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  /* ─────────────────────────────────────────
     19. PARTICLE SPARKLE on click
  ───────────────────────────────────────── */
  document.addEventListener('click', e => {
    if (e.target.closest('a, button')) return;
    spawnParticles(e.clientX, e.clientY);
  });

  function spawnParticles(x, y) {
    const colors = ['var(--jade)', 'var(--teal)', 'var(--saffron)'];
    for (let i = 0; i < 8; i++) {
      const p = document.createElement('div');
      const angle   = (Math.PI * 2 / 8) * i;
      const speed   = 40 + Math.random() * 40;
      const size    = 4 + Math.random() * 4;
      const color   = colors[Math.floor(Math.random() * colors.length)];
      p.style.cssText = `
        position:fixed; left:${x}px; top:${y}px;
        width:${size}px; height:${size}px;
        background:${color};
        border-radius:50%;
        pointer-events:none; z-index:9999;
        transform:translate(-50%,-50%);
        transition: transform 0.6s ease, opacity 0.6s ease;
      `;
      document.body.appendChild(p);
      requestAnimationFrame(() => {
        p.style.transform = `translate(
          calc(-50% + ${Math.cos(angle) * speed}px),
          calc(-50% + ${Math.sin(angle) * speed}px)
        )`;
        p.style.opacity = '0';
      });
      setTimeout(() => p.remove(), 700);
    }
  }

  /* ─────────────────────────────────────────
     20. INIT — trigger visible elements
  ───────────────────────────────────────── */
  // Force-animate elements already in view on load
  setTimeout(() => {
    aosEls.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.95) {
        const delay = parseInt(el.getAttribute('data-aos-delay') || 0);
        setTimeout(() => el.classList.add('aos-animate'), delay + 100);
      }
    });
  }, 100);

  console.log('%c👋 Hey there! Built by Eshan Singh — esingh16@umd.edu', 
    'background:#0a7c5c;color:#fff;padding:8px 16px;border-radius:4px;font-size:14px;');

}); // END DOMContentLoaded
