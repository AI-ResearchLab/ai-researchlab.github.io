const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const navData = yaml.load(
  fs.readFileSync(path.join(__dirname, '../../content/data/navigation.yml'), 'utf8')
);

const ICONS = {
  moon: '<svg class="theme-toggle__icon--dark" viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/></svg>',
  sun: '<svg class="theme-toggle__icon--light" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4" fill="currentColor" stroke="none"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>',
  menu: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
  github: '<svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>',
  rss: '<svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M2 2a1 1 0 0 1 1-1c6.08 0 11 4.92 11 11a1 1 0 1 1-2 0A9 9 0 0 0 3 3a1 1 0 0 1-1-1zm0 5a1 1 0 0 1 1-1 7 7 0 0 1 7 7 1 1 0 1 1-2 0 5 5 0 0 0-5-5 1 1 0 0 1-1-1zm3 6a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/></svg>',
};

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

function renderNavItems(items) {
  return items
    .map((item) => {
      if (item.children) {
        const childrenHtml = item.children
          .map((child) => {
            if (child.url === '#') return '<li class="dropdown-divider" role="separator"></li>';
            return `<li><a href="${child.url}">${child.title}</a></li>`;
          })
          .join('');
        return `
          <li class="nav__item nav__item--dropdown">
            <a href="${item.children[0].url}">${escapeHtml(item.title)}</a>
            <ul class="dropdown-menu">${childrenHtml}</ul>
          </li>`;
      }
      const target = item.url.startsWith('http') ? ' target="_blank" rel="noopener"' : '';
      return `<li class="nav__item"><a href="${item.url}"${target}>${escapeHtml(item.title)}</a></li>`;
    })
    .join('');
}

function renderHeader(config) {
  return `
<header class="site-header">
  <div class="site-header__inner">
    <a class="site-title" href="/">
      ${escapeHtml(config.title)}
      <span class="site-subtitle">${escapeHtml(config.subtitle || '')}</span>
    </a>
    <nav class="site-nav" id="site-nav">
      <ul class="nav__list">${renderNavItems(navData.main)}</ul>
    </nav>
    <div style="display:flex;align-items:center;">
      <button id="theme-toggle" class="icon-btn theme-toggle" type="button">
        <span class="visually-hidden">다크/라이트 모드 전환</span>
        ${ICONS.moon}${ICONS.sun}
      </button>
      <button id="nav-toggle" class="icon-btn nav-toggle" type="button" aria-controls="site-nav" aria-expanded="false">
        <span class="visually-hidden">메뉴 열기</span>
        ${ICONS.menu}
      </button>
    </div>
  </div>
</header>`;
}

function renderFooter(config) {
  const year = new Date().getFullYear();
  return `
<footer class="site-footer">
  <div class="site-footer__inner">
    <div>&copy; ${year} ${escapeHtml(config.title)}. All rights reserved.</div>
    <ul class="footer-links">
      <li><a href="${config.githubUrl}" target="_blank" rel="noopener">${ICONS.github} GitHub</a></li>
      <li><a href="/feed.xml">${ICONS.rss} Feed</a></li>
    </ul>
  </div>
</footer>`;
}

const THEME_INIT_SCRIPT = `
try {
  var saved = localStorage.getItem('ai-lab-theme');
  if (saved === 'light') document.documentElement.setAttribute('data-theme', 'light');
} catch (e) {}
`.trim();

function renderHead({ title, description, url, config }) {
  const fullTitle = title ? `${title} - ${config.title}` : config.title;
  return `
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(fullTitle)}</title>
<meta name="description" content="${escapeHtml(description || config.description)}">
<link rel="canonical" href="${config.url}${url}">
<meta property="og:title" content="${escapeHtml(fullTitle)}">
<meta property="og:description" content="${escapeHtml(description || config.description)}">
<meta property="og:url" content="${config.url}${url}">
<meta property="og:type" content="website">
<link rel="alternate" type="application/atom+xml" href="/feed.xml" title="${escapeHtml(config.title)} Feed">
<link rel="stylesheet" href="/assets/css/main.css">
<script>${THEME_INIT_SCRIPT}</script>`;
}

function renderDocument({ title, description, url, bodyHtml, config }) {
  return `<!doctype html>
<html lang="${config.locale}">
<head>
${renderHead({ title, description, url, config })}
</head>
<body>
${renderHeader(config)}
<main>
${bodyHtml}
</main>
${renderFooter(config)}
<script src="/assets/js/theme-toggle.js"></script>
<script src="/assets/js/nav-toggle.js"></script>
<script src="/assets/js/watchlist-paginate.js"></script>
</body>
</html>
`;
}

module.exports = { renderDocument, escapeHtml };
