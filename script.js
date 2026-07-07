/* ============================================================
   PARFUMERIE SOUFIANE — Main Script
   ============================================================ */

(function () {
  'use strict';

  /* ─── NAV: Hide on scroll down, show on scroll up ─── */
  const nav    = document.getElementById('nav');
  let lastY    = window.scrollY;
  let ticking  = false;

  function onScroll () {
    const currentY = window.scrollY;

    if (currentY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    if (currentY > lastY && currentY > 300) {
      nav.classList.add('hidden');
    } else {
      nav.classList.remove('hidden');
    }

    lastY   = currentY;
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  });

  /* ─── MOBILE MENU ─── */
  const toggle   = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (toggle && navLinks) {
    toggle.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
      const spans = toggle.querySelectorAll('span');
      if (isOpen) {
        spans[0].style.transform = 'translateY(6px) rotate(45deg)';
        spans[1].style.opacity   = '0';
        spans[2].style.transform = 'translateY(-6px) rotate(-45deg)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity   = '';
        spans[2].style.transform = '';
      }
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        const spans = toggle.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity   = '';
        spans[2].style.transform = '';
      });
    });
  }

  /* ─── SCROLL REVEAL ─── */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback for old browsers
    revealEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ─── NEWSLETTER FORM ─── */
  const form        = document.getElementById('newsletterForm');
  const emailInput  = document.getElementById('emailInput');
  const successMsg  = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const email = emailInput ? emailInput.value.trim() : '';
      if (!email) return;

      // Animate the button
      const btn = form.querySelector('.btn');
      if (btn) {
        btn.textContent = '...';
        btn.disabled = true;
      }

      setTimeout(function () {
        if (successMsg) successMsg.classList.add('visible');
        form.reset();
        if (btn) {
          btn.textContent = 'S\'abonner';
          btn.disabled = false;
        }
      }, 900);
    });
  }

  /* ─── SMOOTH ANCHOR SCROLL (offset for fixed nav) ─── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = nav ? nav.offsetHeight + 16 : 80;
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

})();
