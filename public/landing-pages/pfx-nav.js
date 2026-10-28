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
     sit in the menu instead: a search line at the top, and "Become a
     PizzaForno Licensee" at the end, after Contact. Let's Talk moves up under the kiosks. */
  var links = nav.querySelector('.pfx-links'), talk = links && links.querySelector('.pfx-link--talk');
  if (links) {
    var search = document.createElement('button');
    search.type = 'button'; search.className = 'pfx-msearch'; search.setAttribute('aria-label', 'Search the site');
    search.innerHTML = '<span>Search</span><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="8.6" cy="8.6" r="5.6" stroke="currentColor" stroke-width="1.8"/><path d="m13 13 4.2 4.2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
    search.addEventListener('click', function () {
      set(false);
      if (window.PFXSearch) window.PFXSearch.open(); else { var b = document.getElementById('siteSearchBtn'); if (b) b.click(); }
    });
    var pf = document.createElement('a');
    pf.className = 'pfx-link pfx-link--m pfx-link--pf'; pf.href = 'https://pizzaforno.com'; pf.target = '_blank'; pf.rel = 'noopener';
    pf.textContent = 'Become a PizzaForno Licensee';
    links.insertBefore(search, links.firstChild);
    var dd = links.querySelector('.pfx-dd');
    if (talk && dd) links.insertBefore(talk, dd.nextSibling);
    var contact = document.createElement('a');
    contact.className = 'pfx-link pfx-link--m'; contact.href = 'support.html'; contact.textContent = 'Contact';
    links.appendChild(contact);
    links.appendChild(pf);
  }
  nav.querySelectorAll('.pfx-link').forEach(function (a) { a.addEventListener('click', function () { set(false); }); });
  addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
  addEventListener('resize', function () { if (innerWidth > 820) set(false); });
})();
