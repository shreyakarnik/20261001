/* Mobile menu for the shared PFX navigation bar. */
(function () {
  var nav = document.getElementById('pfxNav'); if (!nav) return;
  var burger = nav.querySelector('.pfx-burger');
  function set(open) {
    nav.classList.toggle('menu-open', open);
    burger.classList.toggle('active', open);
    burger.setAttribute('aria-expanded', String(open));
    document.documentElement.classList.toggle('pfx-nav-open', open);
  }
  burger.addEventListener('click', function () { set(!nav.classList.contains('menu-open')); });
  nav.querySelectorAll('.pfx-link').forEach(function (a) { a.addEventListener('click', function () { set(false); }); });
  addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
  addEventListener('resize', function () { if (innerWidth > 820) set(false); });
})();
