/* =========================================================
   PFX SITE SEARCH
   -------------------------------------------------------
   Powers the search button in the shared nav on every page.
   Reads posts from PFX_BLOG_POSTS (blog-data.js, must be
   loaded BEFORE this file) and matches against title, tags,
   and excerpt. Results link to blog.html#<slug>.

   Include on every page as:
     <script src="blog-data.js"></script>
     <script src="site-search.js"></script>
   and add this button inside the shared nav markup:
     <button type="button" class="search-btn" id="siteSearchBtn" aria-label="Search blog">…</button>
   ========================================================= */
(function () {
  const posts = (typeof PFX_BLOG_POSTS !== "undefined") ? PFX_BLOG_POSTS : [];

  const style = document.createElement("style");
  style.textContent = `
    .search-btn{
      display:flex; align-items:center; justify-content:center;
      width:42px; height:42px; flex-shrink:0;
      background:none; border:none;
      color:#000; cursor:pointer; padding:0;
    }
    .search-btn:hover{ color:#C00022; }
    .search-overlay{
      position:fixed; inset:0; background:rgba(0,0,0,0.5);
      display:none; align-items:flex-start; justify-content:center;
      padding:10vh 20px 20px; z-index:1000;
    }
    .search-overlay.open{ display:flex; }
    .search-panel{
      background:#fff; width:100%; max-width:640px; border-radius:12px;
      box-shadow:0 10px 40px rgba(0,0,0,0.25); overflow:hidden;
      font-family:"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;
      max-height:70vh; display:flex; flex-direction:column;
    }
    .search-input-row{
      display:flex; align-items:center; gap:10px;
      border-bottom:1px solid #E8EAED; padding:14px 18px;
    }
    .search-input-row svg{ flex-shrink:0; color:#888686; }
    .search-input-row input{
      border:none; outline:none; font-size:16px; flex:1;
      font-family:inherit; color:#000;
    }
    .search-close{
      border:none; background:none; cursor:pointer; color:#888686;
      font-size:13px; font-weight:400; letter-spacing:.05em; text-transform:uppercase;
      padding:6px 10px; border-radius:12px;
    }
    .search-close:hover{ background:#EFF3F5; color:#000; }
    .search-results{ overflow-y:auto; padding:8px; }
    .search-result{
      display:block; padding:12px 14px; border-radius:12px;
      text-decoration:none; color:inherit; margin-bottom:4px;
    }
    .search-result:hover{ background:#EFF3F5; }
    .search-result h4{ font-size:15px; font-weight:700; margin-bottom:4px; color:#000; }
    .search-result p{ font-size:13.5px; color:#888686; margin-bottom:6px; line-height:1.5; }
    .search-result .tags{ display:flex; gap:6px; flex-wrap:wrap; }
    .search-result .tag{
      font-size:10.5px; font-weight:700; letter-spacing:.05em; text-transform:uppercase;
      background:#EFF3F5; color:#C00022; padding:3px 8px; border-radius:12px;
    }
    .search-empty{ padding:32px 18px; text-align:center; color:#888686; font-size:14px; }
    .search-hint{ padding:10px 18px 16px; font-size:12px; color:#888686; }
  `;
  document.head.appendChild(style);

  const overlay = document.createElement("div");
  overlay.className = "search-overlay";
  overlay.innerHTML = `
    <div class="search-panel" role="dialog" aria-modal="true" aria-label="Search blog">
      <div class="search-input-row">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <input type="text" id="siteSearchInput" placeholder="Search the blog by title or topic…" autocomplete="off">
        <button type="button" class="search-close" id="siteSearchClose">Esc</button>
      </div>
      <div class="search-results" id="siteSearchResults"></div>
    </div>
  `;
  document.body.appendChild(overlay);

  const input = overlay.querySelector("#siteSearchInput");
  const results = overlay.querySelector("#siteSearchResults");

  function renderResults(query) {
    const q = query.trim().toLowerCase();
    let list = posts;
    if (q) {
      list = posts.filter(function (p) {
        const haystack = (p.title + " " + p.excerpt + " " + p.tags.join(" ")).toLowerCase();
        return haystack.includes(q);
      });
    }
    if (!list.length) {
      results.innerHTML = '<div class="search-empty">No blog posts match “' + escapeHtml(query) + '”. Try a different keyword.</div>';
      return;
    }
    results.innerHTML = list.map(function (p) {
      return '<a class="search-result" href="blog.html#' + p.slug + '">' +
        '<h4>' + escapeHtml(p.title) + '</h4>' +
        '<p>' + escapeHtml(p.excerpt) + '</p>' +
        '<div class="tags">' + p.tags.map(function (t) { return '<span class="tag">' + escapeHtml(t) + '</span>'; }).join('') + '</div>' +
        '</a>';
    }).join('');
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function openSearch() {
    overlay.classList.add("open");
    input.value = "";
    renderResults("");
    setTimeout(function () { input.focus(); }, 10);
  }

  function closeSearch() {
    overlay.classList.remove("open");
  }

  input.addEventListener("input", function () { renderResults(input.value); });
  overlay.querySelector("#siteSearchClose").addEventListener("click", closeSearch);
  overlay.addEventListener("click", function (e) { if (e.target === overlay) closeSearch(); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && overlay.classList.contains("open")) closeSearch();
    if (e.key === "/" && !overlay.classList.contains("open")) {
      const tag = document.activeElement && document.activeElement.tagName;
      if (tag !== "INPUT" && tag !== "TEXTAREA" && tag !== "SELECT") {
        e.preventDefault();
        openSearch();
      }
    }
  });

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".search-btn, #siteSearchBtn").forEach(function (btn) {
      btn.addEventListener("click", openSearch);
    });
  });

  window.PFXSearch = { open: openSearch, close: closeSearch };
})();
