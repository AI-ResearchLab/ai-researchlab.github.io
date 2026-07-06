const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const sass = require('sass');

const { copyDir, writeFile, ensureDirSync } = require('./lib/util');
const { loadPosts, loadSurveys, renderPosts, renderSurveys } = require('./lib/render-posts');
const {
  CATEGORIES,
  renderHome,
  renderAbout,
  renderMembers,
  renderSurveyIndex,
  renderWeeklyTrends,
  renderCategoriesIndex,
  renderCategoryPages,
} = require('./lib/render-pages');
const { renderDocument } = require('./lib/layout');
const { generateFeed, generateSitemap } = require('./lib/feed');

const ROOT = path.join(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'dist');

function clean() {
  fs.rmSync(OUT_DIR, { recursive: true, force: true });
  ensureDirSync(OUT_DIR);
}

function loadConfig() {
  return yaml.load(fs.readFileSync(path.join(ROOT, 'site.config.yml'), 'utf8'));
}

function loadMembers() {
  return yaml.load(fs.readFileSync(path.join(ROOT, 'content/data/members.yml'), 'utf8'));
}

function loadWeeklyTrends() {
  // weekly-trends 레포의 sync 워크플로우가 이 파일을 자동 갱신합니다.
  const file = path.join(ROOT, 'content/data/llm-watchlist.yml');
  if (!fs.existsSync(file)) return { manual: [], auto: [] };
  return yaml.load(fs.readFileSync(file, 'utf8')) || { manual: [], auto: [] };
}

function buildCss() {
  const result = sass.compile(path.join(ROOT, 'styles/main.scss'), { style: 'compressed' });
  writeFile(OUT_DIR, 'assets/css/main.css', result.css);
}

function copyAssets() {
  copyDir(path.join(ROOT, 'assets/js'), path.join(OUT_DIR, 'assets/js'));
  copyDir(path.join(ROOT, 'assets/images'), path.join(OUT_DIR, 'assets/images'));
}

function render404(config) {
  const body = `<div class="page"><h1 class="page__title">404</h1><p>페이지를 찾을 수 없습니다. <a href="/">홈으로 돌아가기</a></p></div>`;
  return renderDocument({ title: '페이지를 찾을 수 없음', url: '/404.html', bodyHtml: body, config });
}

function build() {
  console.log('사이트 빌드를 시작합니다...');
  clean();

  const config = loadConfig();
  const members = loadMembers();
  const posts = loadPosts();
  const surveys = loadSurveys();
  const weeklyTrends = loadWeeklyTrends();

  buildCss();
  copyAssets();

  renderHome(OUT_DIR, config, { posts, surveys, members });
  renderAbout(OUT_DIR, config);
  renderMembers(OUT_DIR, config, members);
  renderSurveyIndex(OUT_DIR, config, surveys);
  renderWeeklyTrends(OUT_DIR, config, weeklyTrends);
  renderCategoriesIndex(OUT_DIR, config, posts);
  renderCategoryPages(OUT_DIR, config, posts);
  renderPosts(OUT_DIR, config, posts);
  renderSurveys(OUT_DIR, config, surveys);

  const allUrls = [
    '/',
    '/about/',
    '/members/',
    '/survey/',
    '/weekly-trends/',
    '/categories/',
    ...CATEGORIES.map((c) => `/categories/${c.slug}/`),
    ...posts.map((p) => p.url),
    ...surveys.map((s) => s.url),
  ];
  writeFile(OUT_DIR, 'feed.xml', generateFeed(config, posts));
  writeFile(OUT_DIR, 'sitemap.xml', generateSitemap(config, allUrls));
  writeFile(OUT_DIR, '.nojekyll', '');
  writeFile(OUT_DIR, '404.html', render404(config));

  console.log(`빌드 완료: 포스트 ${posts.length}개, 서베이 ${surveys.length}개, 카테고리 페이지 ${CATEGORIES.length}개`);
}

build();
