/* ==========================================================================
   Pinpoint Calibration Service LLC — script.js
   - Mobile nav toggle
   - Sticky header shadow on scroll
   - Scroll reveal animations
   - Web3Forms submission (fetch, no redirect)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ----- footer year ----- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ----- mobile nav ----- */
  var hamburger = document.getElementById('hamburger');
  var mobileNav = document.getElementById('mobile-nav');

  function closeNav() {
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('open');
    mobileNav.hidden = true;
  }

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      var isOpen = mobileNav.classList.toggle('open');
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      mobileNav.hidden = !isOpen;
    });
    // close when a link is tapped
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });
  }

  /* ----- sticky header shadow ----- */
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (window.scrollY > 8) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ----- scroll reveal ----- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el, i) {
      // light stagger for grouped items
      el.style.transitionDelay = (i % 6) * 60 + 'ms';
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ----- Web3Forms submission ----- */
  var form = document.getElementById('quote-form');
  var status = document.getElementById('form-status');
  var submitBtn = document.getElementById('submit-btn');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.textContent = '';
      status.className = 'form-status';

      // honeypot: if filled, silently abort (bot)
      if (form.botcheck && form.botcheck.checked) return;

      // basic validation
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var btnText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      var formData = new FormData(form);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
        .then(function (res) { return res.json().then(function (data) { return { ok: res.ok, data: data }; }); })
        .then(function (result) {
          if (result.ok && result.data.success) {
            status.textContent = 'Thanks, your request was sent. We\u2019ll be in touch shortly.';
            status.classList.add('success');
            form.reset();
          } else {
            status.textContent = (result.data && result.data.message) || 'Something went wrong. Please email us directly.';
            status.classList.add('error');
          }
        })
        .catch(function () {
          status.textContent = 'Network error. Please email dylan.lester@pinpointcalibrationservice.com.';
          status.classList.add('error');
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = btnText;
        });
    });
  }

});
