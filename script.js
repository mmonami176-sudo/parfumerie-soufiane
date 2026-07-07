/* ============================================================
   PARFUMERIE SOUFIANE — Main Script
   ============================================================ */

(function () {
  'use strict';

  /* ─── CONFIG ─── */
  var WHATSAPP_NUMBER = '212778878421'; // رقم واتساب المتجر

  /* ─── NAV: Hide on scroll down, show on scroll up ─── */
  var nav    = document.getElementById('nav');
  var lastY  = window.scrollY;
  var ticking = false;

  function onScroll() {
    var currentY = window.scrollY;
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
  var toggle   = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');

  if (toggle && navLinks) {
    toggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
      var spans = toggle.querySelectorAll('span');
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

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        var spans = toggle.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity   = '';
        spans[2].style.transform = '';
      });
    });
  }

  /* ─── SCROLL REVEAL ─── */
  var revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ─── NEWSLETTER FORM ─── */
  var newsletterForm = document.getElementById('newsletterForm');
  var emailInput     = document.getElementById('emailInput');
  var successMsg     = document.getElementById('formSuccess');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = emailInput ? emailInput.value.trim() : '';
      if (!email) return;
      var btn = newsletterForm.querySelector('.btn');
      if (btn) { btn.textContent = '...'; btn.disabled = true; }
      setTimeout(function () {
        if (successMsg) successMsg.classList.add('visible');
        newsletterForm.reset();
        if (btn) { btn.textContent = "S'abonner"; btn.disabled = false; }
      }, 900);
    });
  }

  /* ─── SMOOTH ANCHOR SCROLL ─── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (!href || href === '#') return;
      var target;
      try { target = document.querySelector(href); } catch (_) { return; }
      if (!target) return;
      e.preventDefault();
      var offset = nav ? nav.offsetHeight + 16 : 80;
      var top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ============================================================
     ORDER MODAL + WHATSAPP
     ============================================================ */
  var backdrop   = document.getElementById('modalBackdrop');
  var modalClose = document.getElementById('modalClose');
  var orderForm  = document.getElementById('orderForm');
  var modalTitle = document.getElementById('modalTitle');
  var modalPrice = document.getElementById('modalPrice');

  // Store current product info
  var currentProduct = '';
  var currentPrice   = '';

  /* Open modal */
  window.openOrder = function (product, price) {
    currentProduct  = product;
    currentPrice    = price;
    if (modalTitle) modalTitle.textContent = product;
    if (modalPrice) modalPrice.textContent = price;
    if (backdrop)   backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    // Focus first input
    var firstInput = orderForm ? orderForm.querySelector('input') : null;
    if (firstInput) setTimeout(function () { firstInput.focus(); }, 100);
  };

  /* Close modal */
  function closeModal() {
    if (backdrop) backdrop.classList.remove('open');
    document.body.style.overflow = '';
    if (orderForm) orderForm.reset();
    clearErrors();
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (backdrop) {
    backdrop.addEventListener('click', function (e) {
      if (e.target === backdrop) closeModal();
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  /* Validation */
  function clearErrors() {
    if (!orderForm) return;
    orderForm.querySelectorAll('input').forEach(function (inp) {
      inp.classList.remove('error');
    });
  }

  function validate() {
    var valid = true;
    ['orderName','orderPhone','orderCity','orderAddress'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el && !el.value.trim()) {
        el.classList.add('error');
        valid = false;
      } else if (el) {
        el.classList.remove('error');
      }
    });
    return valid;
  }

  /* Submit → WhatsApp */
  if (orderForm) {
    orderForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate()) return;

      var name    = document.getElementById('orderName').value.trim();
      var phone   = document.getElementById('orderPhone').value.trim();
      var city    = document.getElementById('orderCity').value.trim();
      var address = document.getElementById('orderAddress').value.trim();

      var message =
        '🌹 *طلب جديد - Parfumerie Soufiane*\n\n' +
        '📦 *المنتج:* ' + currentProduct + '\n' +
        '💰 *السعر:* ' + currentPrice + '\n\n' +
        '👤 *الاسم:* ' + name + '\n' +
        '📞 *الهاتف:* ' + phone + '\n' +
        '🏙️ *المدينة:* ' + city + '\n' +
        '📍 *العنوان:* ' + address;

      var waUrl = 'https://wa.me/' + WHATSAPP_NUMBER +
                  '?text=' + encodeURIComponent(message);

      window.open(waUrl, '_blank');
      closeModal();
    });
  }

})();
