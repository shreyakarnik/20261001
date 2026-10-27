/* =====================================================================
   PFX site-wide extras (styles in pfx-site.css)
   1. Cookie banner. Asks once; the answer is kept in localStorage under
      "pfx_consent". Accepting loads analytics.js's tools on the spot.
   2. Sticky mobile CTA. A bottom bar on phones with the two actions that
      matter (Let's Talk! and the ROI calculator). It steps aside while a
      form is on screen, a menu or overlay is open, and on pages that are
      the form already.
   ===================================================================== */
(function () {
  var CONSENT_KEY = 'pfx_consent';
  var page = location.pathname.split('/').pop() || 'index.html';

  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function make(html) { var d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstChild; }

  /* ---------------------------------------------------- cookie banner */
  function cookieBanner() {
    if (get(CONSENT_KEY)) return;
    var b = make(
      '<div class="pfx-cookie" role="region" aria-label="Cookie consent">' +
        '<p>We use cookies to understand how visitors use this site and to improve it. ' +
        'See our <a href="privacy-policy.html">Privacy Policy</a>.</p>' +
        '<div class="pfx-cookie-btns">' +
          '<button type="button" class="pfx-cookie-no">Decline</button>' +
          '<button type="button" class="pfx-cookie-yes">Accept</button>' +
        '</div>' +
      '</div>');
    document.body.appendChild(b);
    requestAnimationFrame(function () { requestAnimationFrame(function () { b.classList.add('on'); }); });
    function close(choice) {
      set(CONSENT_KEY, choice);
      b.classList.remove('on');
      setTimeout(function () { b.remove(); }, 450);
      if (choice === 'accepted' && typeof window.pfxLoadAnalytics === 'function') window.pfxLoadAnalytics();
    }
    b.querySelector('.pfx-cookie-yes').addEventListener('click', function () { close('accepted'); });
    b.querySelector('.pfx-cookie-no').addEventListener('click', function () { close('declined'); });
  }

  /* ------------------------------------------------ sticky mobile CTA */
  var NO_CTA = ['contact.html', 'thank-you.html', 'login.html', 'admin.html'];
  function stickyCta() {
    if (NO_CTA.indexOf(page) !== -1 || document.body.hasAttribute('data-no-sticky-cta')) return;
    var onRoi = page === 'roi_calculator.html';
    var bar = make(
      '<div class="pfx-mcta" role="region" aria-label="Get in touch">' +
        (onRoi ? '<a class="pfx-mcta-sec" href="kiosk-outdoor.html">Explore Kiosks</a>'
               : '<a class="pfx-mcta-sec" href="roi_calculator.html">ROI Calculator</a>') +
        '<a class="pfx-mcta-pri" href="contact.html">Let&rsquo;s Talk!</a>' +
      '</div>');
    /* Let's Talk! opens the page's inquiry overlay when it has one (talk-modal.js
       wires its own [data-talk-trigger] links, so borrow one of those) */
    bar.querySelector('.pfx-mcta-pri').addEventListener('click', function (e) {
      var trigger = document.getElementById('talkOverlay') && document.querySelector('[data-talk-trigger]');
      if (trigger) { e.preventDefault(); trigger.click(); }
    });
    document.body.appendChild(bar);
    document.body.classList.add('has-mcta');

    /* step aside while an inline form is in view */
    var forms = document.querySelectorAll('#inquiry, .tm-inline, form.contact-form, #contactForm');
    if (forms.length && 'IntersectionObserver' in window) {
      var seen = new Set();
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) seen.add(en.target); else seen.delete(en.target); });
        bar.classList.toggle('off', seen.size > 0);
      }, { threshold: 0.15 });
      forms.forEach(function (f) { io.observe(f); });
    }
  }

  function init() { stickyCta(); cookieBanner(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

/* Kiosk feature showcase ([data-kshow]): click a tab to show its images; the
   active tab's rule fills as a timer and moves on to the next when it runs out
   (paused while hovered, off with reduced motion). */
(function () {
  function wire(root) {
    var tabs = [].slice.call(root.querySelectorAll('.kshow-tab'));
    var sets = [].slice.call(root.querySelectorAll('.kshow-set'));
    var desc = root.querySelector('.kshow-desc-m');
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    function show(i) {
      tabs.forEach(function (t, k) {
        t.classList.toggle('on', k === i); t.setAttribute('aria-selected', k === i ? 'true' : 'false');
        var bar = t.querySelector('.kshow-rule i'); if (bar) { bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = ''; }
      });
      sets.forEach(function (s, k) { s.classList.toggle('on', k === i); });
      if (desc) desc.textContent = tabs[i].querySelector('p').textContent;
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { show(i); });
      var bar = t.querySelector('.kshow-rule i');
      if (bar && !reduce) bar.addEventListener('animationend', function () {
        if (t.classList.contains('on')) show((i + 1) % tabs.length);
      });
    });
    root.addEventListener('mouseenter', function () { root.classList.add('paused'); });
    root.addEventListener('mouseleave', function () { root.classList.remove('paused'); });
    show(0);
  }
  function init() { [].forEach.call(document.querySelectorAll('[data-kshow]'), wire); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
