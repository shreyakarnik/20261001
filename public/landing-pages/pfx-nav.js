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
  /* on phones the search button and the PizzaForno mark leave the bar and
     sit in the menu instead, as two plain entries */
  var links = nav.querySelector('.pfx-links'), talk = links && links.querySelector('.pfx-link--talk');
  if (links) {
    var search = document.createElement('button');
    search.type = 'button'; search.className = 'pfx-link pfx-link--m'; search.textContent = 'Search';
    search.addEventListener('click', function () {
      set(false);
      if (window.PFXSearch) window.PFXSearch.open(); else { var b = document.getElementById('siteSearchBtn'); if (b) b.click(); }
    });
    var pf = document.createElement('a');
    pf.className = 'pfx-link pfx-link--m'; pf.href = 'https://pizzaforno.com'; pf.target = '_blank'; pf.rel = 'noopener';
    pf.textContent = 'Become a PizzaForno Licensee';
    links.insertBefore(search, talk); links.insertBefore(pf, talk);
  }
  nav.querySelectorAll('.pfx-link').forEach(function (a) { a.addEventListener('click', function () { set(false); }); });
  addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
  addEventListener('resize', function () { if (innerWidth > 820) set(false); });
})();
