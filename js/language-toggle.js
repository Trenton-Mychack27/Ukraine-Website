// /js/language-toggle.js
(function () {
  const toggle = document.getElementById('langToggle');
  if (!toggle) return;

  const path = window.location.pathname;               // e.g. /about.html or /UK/techniques/pair-grounding-ukr.html
  const isUkr = path.startsWith('/UK/');               // NOTE: folder name is case-sensitive
  toggle.checked = isUkr;

  // Helpers to add/remove "-ukr" before ".html"
  function addUkrSuffix(p) {
    return p.replace(/\/([^/]+)\.html$/i, (m, name) =>
      `/${name.endsWith('-ukr') ? name : name + '-ukr'}.html`
    );
  }
  function removeUkrSuffix(p) {
    return p.replace(/-ukr(?=\.html$)/i, '');
  }

  // Build Ukrainian counterpart of a path: ensure /UK/ prefix + -ukr.html
  function toUkrPath(p) {
    let out = p;
    if (!out.startsWith('/UK/')) out = '/UK' + (out.startsWith('/') ? out : '/' + out);
    out = addUkrSuffix(out);
    return out;
  }

  // Build English counterpart of a path: strip /UK/ + remove -ukr
  function toEngPath(p) {
    let out = p.replace(/^\/UK\//, '/');
    out = removeUkrSuffix(out);
    return out;
  }

  // Toggle navigation: go to counterpart of the *current* page
  toggle.addEventListener('change', () => {
    const qh = window.location.search + window.location.hash;
    const target = toggle.checked ? toUkrPath(path) : toEngPath(path);
    window.location.assign(target + qh);
  });

  // -------- Link Rewriter --------
  // When in UKR mode, rewrite links like /about.html -> /UK/about-ukr.html
  // When in EN mode, rewrite links like /UK/about-ukr.html -> /about.html
  function rewriteLinks(forUkr) {
    const anchors = document.querySelectorAll('a[href$=".html"]');
    anchors.forEach(a => {
      const raw = a.getAttribute('href');
      if (!raw || raw.startsWith('http') || raw.startsWith('mailto:') || raw.startsWith('#')) return;

      // Resolve to an absolute URL so we can safely read pathname/search/hash
      const u = new URL(raw, window.location.origin + window.location.pathname);
      const newPath = forUkr ? toUkrPath(u.pathname) : toEngPath(u.pathname);
      a.setAttribute('href', newPath + u.search + u.hash);
    });
  }

  rewriteLinks(isUkr);
})();
