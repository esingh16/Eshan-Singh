/* ══════════════════════════════════════════════════════════
   ESHAN SINGH PORTFOLIO — script.js  (v2 — patched)
══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────
     1. TOUCH DETECTION — disable cursor on mobile
  ───────────────────────────────────────── */
  const isTouchDevice = () => window.matchMedia('(hover: none)').matches;
  const cursorDot  = document.getElementById('cursor');
  const follower   = document.getElementById('follower');

  if (isTouchDevice()) {
    if (cursorDot)  cursorDot.style.display  = 'none';
    if (follower)   follower.style.display   = 'none';
    document.body.style.cursor = 'auto';
  }

  /* ─────────────────────────────────────────
     2. CUSTOM CURSOR (desktop only)
  ───────────────────────────────────────── */
  if (!isTouchDevice() && cursorDot && follower) {
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let fx = mx, fy = my;
    let cursorVisible = false;

    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
      cursorDot.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
      if (!cursorVisible) {
        cursorDot.style.opacity  = '1';
        follower.style.opacity   = '0.5';
        cursorVisible = true;
      }
    });

    function animateFollower() {
      fx += (mx - fx) * 0.1;
      fy += (my - fy) * 0.1;
      follower.style.transform = `translate(${fx - 16}px, ${fy - 16}px)`;
      requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Cursor invisible until first move
    cursorDot.style.opacity = '0';
    follower.style.opacity  = '0';

    document.addEventListener('mouseleave', () => {
      cursorDot.style.opacity = '0';
      follower.style.opacity  = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursorDot.style.opacity = '1';
      follower.style.opacity  = '0.5';
    });

    const interactables = document.querySelectorAll(
      'a, button, .pop-card, .skill-tab, .skill-tag-cloud span, .proj-stack span, .tl-tags span, .lang-tag, .social-chip, .ec-chips span'
    );
    interactables.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  /* ─────────────────────────────────────────
     3. THEME TOGGLE
  ───────────────────────────────────────── */
  const html        = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');

  // Respect system preference if no saved preference
  const systemDark  = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme  = localStorage.getItem('es-theme') || (systemDark ? 'dark' : 'light');
  html.setAttribute('data-theme', savedTheme);

  themeToggle && themeToggle.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('es-theme', next);
    // Re-trigger skill bars for current panel
    const activePanel = document.querySelector('.skill-panel.active');
    if (activePanel) setTimeout(() => animateBarsInPanel(activePanel), 50);
  });

  /* ─────────────────────────────────────────
     4. NAV — scroll + active link + hamburger
  ───────────────────────────────────────── */
  const nav       = document.getElementById('nav');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    // Scrolled state
    nav && nav.classList.toggle('scrolled', sy > 40);
    // Hide nav on fast scroll down, show on scroll up
    if (sy > 300) {
      if (sy > lastScroll + 4) {
        nav && nav.classList.add('nav-hidden');
      } else if (sy < lastScroll - 4) {
        nav && nav.classList.remove('nav-hidden');
      }
    } else {
      nav && nav.classList.remove('nav-hidden');
    }
    lastScroll = sy;
    updateActiveNav();
  }, { passive: true });

  hamburger && hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks && navLinks.classList.toggle('open');
  });

  document.querySelectorAll('.nl').forEach(link => {
    link.addEventListener('click', () => {
      hamburger && hamburger.classList.remove('open');
      navLinks  && navLinks.classList.remove('open');
    });
  });

  function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    document.querySelectorAll('.nl').forEach(link => {
      link.classList.toggle('nl-active', link.getAttribute('href') === `#${current}`);
    });
  }

  /* ─────────────────────────────────────────
     5. AOS — Animate On Scroll
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
  }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });

  aosEls.forEach(el => aosObserver.observe(el));

  // Stagger cards that don't have data-aos yet
  [
    '.about-cards .about-card',
    '.tl-item',
    '.proj-card',
    '.cert-item',
    '.clink',
    '.lang-tag',
  ].forEach(selector => {
    document.querySelectorAll(selector).forEach((item, i) => {
      if (!item.hasAttribute('data-aos')) {
        item.setAttribute('data-aos', 'fade-up');
        item.setAttribute('data-aos-delay', String(i * 80));
        aosObserver.observe(item);
      }
    });
  });

  // Trigger already-visible elements on load
  setTimeout(() => {
    aosEls.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.95) {
        const delay = parseInt(el.getAttribute('data-aos-delay') || 0);
        setTimeout(() => el.classList.add('aos-animate'), delay + 80);
      }
    });
  }, 150);

  /* ─────────────────────────────────────────
     6. COUNTER ANIMATION
  ───────────────────────────────────────── */
  function runCounters() {
    document.querySelectorAll('.stat-num[data-count]').forEach(el => {
      if (el.dataset.counted) return;
      el.dataset.counted = 'true';
      const target   = parseInt(el.getAttribute('data-count'));
      const duration = 1800;
      const start    = performance.now();
      function update(now) {
        const p = Math.min((now - start) / duration, 1);
        const e = 1 - Math.pow(1 - p, 4); // ease out quart
        el.textContent = Math.round(e * target);
        if (p < 1) requestAnimationFrame(update);
        else el.textContent = target;
      }
      requestAnimationFrame(update);
    });
  }

  const statsStrip = document.querySelector('.stats-strip');
  if (statsStrip) {
    const cObs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        runCounters();
        cObs.disconnect();
      }
    }, { threshold: 0.3 });
    cObs.observe(statsStrip);
  }
  // Also try on scroll — fallback
  window.addEventListener('scroll', () => {
    if (!statsStrip) return;
    const r = statsStrip.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.85) runCounters();
  }, { passive: true, once: true });

  /* ─────────────────────────────────────────
     7. SKILL TABS + BAR ANIMATION
  ───────────────────────────────────────── */
  document.querySelectorAll('.skill-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.skill-tab').forEach(t  => t.classList.remove('active'));
      document.querySelectorAll('.skill-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById(`tab-${tab.dataset.tab}`);
      if (panel) {
        panel.classList.add('active');
        setTimeout(() => animateBarsInPanel(panel), 60);
      }
    });
  });

  function animateBarsInPanel(panel) {
    panel.querySelectorAll('.sk-fill').forEach((fill, i) => {
      fill.classList.remove('animated');
      void fill.offsetWidth; // reflow
      setTimeout(() => fill.classList.add('animated'), i * 90);
    });
  }

  // Animate initial panel when skills section enters view
  const skillsSection = document.getElementById('skills');
  if (skillsSection) {
    const sObs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        const activePanel = document.querySelector('.skill-panel.active');
        if (activePanel) animateBarsInPanel(activePanel);
        sObs.disconnect();
      }
    }, { threshold: 0.25 });
    sObs.observe(skillsSection);
  }

  /* ─────────────────────────────────────────
     8. SMOOTH SCROLL
  ───────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - 68,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ─────────────────────────────────────────
     9. HERO TEXT — staggered reveal
  ───────────────────────────────────────── */
  document.querySelectorAll('.hl-line').forEach((line, i) => {
    line.style.cssText = 'opacity:0; transform:translateY(32px); transition: opacity 0.85s ease, transform 0.85s ease;';
    setTimeout(() => {
      line.style.opacity   = '1';
      line.style.transform = 'translateY(0)';
    }, 180 + i * 130);
  });

  /* ─────────────────────────────────────────
     10. TYPING EFFECT — hero eyebrow
  ───────────────────────────────────────── */
  const eyebrow = document.querySelector('.hero-eyebrow span:last-child');
  if (eyebrow) {
    const text = eyebrow.textContent.trim();
    eyebrow.textContent = '';
    let i = 0;
    setTimeout(() => {
      const iv = setInterval(() => {
        if (i < text.length) eyebrow.textContent += text[i++];
        else clearInterval(iv);
      }, 36);
    }, 900);
  }

  /* ─────────────────────────────────────────
     11. PARALLAX — hero orbs on mouse
  ───────────────────────────────────────── */
  if (!isTouchDevice()) {
    const orbs = document.querySelectorAll('.orb');
    window.addEventListener('mousemove', e => {
      const cx = (e.clientX / window.innerWidth  - 0.5) * 2;
      const cy = (e.clientY / window.innerHeight - 0.5) * 2;
      orbs.forEach((orb, i) => {
        const d = (i + 1) * 10;
        orb.style.transform = `translate(${cx * d}px, ${cy * d}px)`;
      });
    }, { passive: true });
  }

  /* ─────────────────────────────────────────
     12. 3D TILT on project + about cards
  ───────────────────────────────────────── */
  if (!isTouchDevice()) {
    document.querySelectorAll('.proj-card, .about-card, .cert-item, .edu-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r  = card.getBoundingClientRect();
        const cx = ((e.clientX - r.left) / r.width  - 0.5) * 2;
        const cy = ((e.clientY - r.top)  / r.height - 0.5) * 2;
        card.style.transform = `translateY(-6px) scale(1.015) perspective(700px) rotateX(${cy * -5}deg) rotateY(${cx * 5}deg)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  /* ─────────────────────────────────────────
     13. GLOW SPOTLIGHT on timeline + edu cards
  ───────────────────────────────────────── */
  if (!isTouchDevice()) {
    document.querySelectorAll('.tl-card, .edu-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        card.style.background = `radial-gradient(circle 220px at ${e.clientX - r.left}px ${e.clientY - r.top}px, var(--jade-dim), var(--surface) 65%)`;
      });
      card.addEventListener('mouseleave', () => { card.style.background = ''; });
    });
  }

  /* ─────────────────────────────────────────
     14. SCROLL PROGRESS BAR
  ───────────────────────────────────────── */
  const bar = Object.assign(document.createElement('div'), {
    style: 'position:fixed;top:0;left:0;z-index:9999;height:3px;width:0%;background:linear-gradient(90deg,var(--jade),var(--teal),var(--saffron));pointer-events:none;transition:width .08s linear;'
  });
  document.body.appendChild(bar);
  window.addEventListener('scroll', () => {
    const d = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = d > 0 ? `${(window.scrollY / d) * 100}%` : '0%';
  }, { passive: true });

  /* ─────────────────────────────────────────
     15. MAGNETIC BUTTONS
  ───────────────────────────────────────── */
  if (!isTouchDevice()) {
    document.querySelectorAll('.btn-main, .btn-outline, .nav-resume-btn').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r  = btn.getBoundingClientRect();
        const cx = e.clientX - r.left - r.width  / 2;
        const cy = e.clientY - r.top  - r.height / 2;
        btn.style.transform = `translateY(-3px) translate(${cx * 0.18}px, ${cy * 0.18}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }

  /* ─────────────────────────────────────────
     16. PARTICLE SPARKLE on click
  ───────────────────────────────────────── */
  document.addEventListener('click', e => {
    if (e.target.closest('a, button')) return;
    const colors = ['var(--jade)', 'var(--teal)', 'var(--saffron)'];
    for (let i = 0; i < 8; i++) {
      const p     = document.createElement('div');
      const angle = (Math.PI * 2 / 8) * i;
      const spd   = 40 + Math.random() * 50;
      const sz    = 4 + Math.random() * 4;
      p.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;width:${sz}px;height:${sz}px;background:${colors[i % 3]};border-radius:50%;pointer-events:none;z-index:9998;transform:translate(-50%,-50%);transition:transform .65s ease,opacity .65s ease;`;
      document.body.appendChild(p);
      requestAnimationFrame(() => {
        p.style.transform = `translate(calc(-50% + ${Math.cos(angle)*spd}px),calc(-50% + ${Math.sin(angle)*spd}px))`;
        p.style.opacity   = '0';
      });
      setTimeout(() => p.remove(), 750);
    }
  });

  /* ─────────────────────────────────────────
     17. SECTION NUMBER IN VIEW — highlight chip
  ───────────────────────────────────────── */
  const chips = document.querySelectorAll('.section-chip');
  const chipObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.boxShadow = '0 0 16px var(--glow-jade)';
        setTimeout(() => { e.target.style.boxShadow = ''; }, 1200);
      }
    });
  }, { threshold: 0.8 });
  chips.forEach(c => chipObs.observe(c));

  /* ─────────────────────────────────────────
     18. TIMELINE DOT — pulse on enter view
  ───────────────────────────────────────── */
  document.querySelectorAll('.tl-dot').forEach(dot => {
    new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        dot.style.transform = 'scale(1.5)';
        setTimeout(() => { dot.style.transform = ''; }, 500);
      }
    }, { threshold: 1 }).observe(dot);
  });

  /* ─────────────────────────────────────────
     19. KONAMI CODE EASTER EGG
  ───────────────────────────────────────── */
  const konami = [38,38,40,40,37,39,37,39,66,65];
  let kIdx = 0;
  document.addEventListener('keydown', e => {
    if (e.keyCode === konami[kIdx]) { kIdx++; }
    else kIdx = 0;
    if (kIdx === konami.length) {
      kIdx = 0;
      const msg = Object.assign(document.createElement('div'), {
        textContent: '🎉 Easter Egg found! Eshan Singh — Building the future, one model at a time.',
        style: 'position:fixed;bottom:32px;left:50%;transform:translateX(-50%);background:var(--jade);color:#fff;padding:14px 28px;border-radius:999px;font-size:14px;font-weight:600;z-index:9999;box-shadow:0 8px 32px var(--glow-jade);white-space:nowrap;animation:slideUp .4s ease;'
      });
      document.body.appendChild(msg);
      setTimeout(() => msg.remove(), 4000);
    }
  });

  /* ─────────────────────────────────────────
     20. LAZY IMAGE FADE-IN
  ───────────────────────────────────────── */
  document.querySelectorAll('img').forEach(img => {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.6s ease';
    if (img.complete) {
      img.style.opacity = '1';
    } else {
      img.addEventListener('load', () => { img.style.opacity = '1'; });
      img.addEventListener('error', () => { img.style.opacity = '0.3'; });
    }
  });

  /* ─────────────────────────────────────────
     21. FOOTER YEAR — auto update
  ───────────────────────────────────────── */
  const footerCopy = document.querySelector('.footer-copy');
  if (footerCopy) {
    footerCopy.innerHTML = footerCopy.innerHTML.replace('2026', new Date().getFullYear());
  }

  console.log(
    '%c👋 Eshan Singh · MS Data Science @ UMD · esingh16@umd.edu',
    'background:linear-gradient(90deg,#0a7c5c,#00b4d8);color:#fff;padding:8px 18px;border-radius:4px;font-size:13px;font-weight:600;'
  );

}); // END DOMContentLoaded
