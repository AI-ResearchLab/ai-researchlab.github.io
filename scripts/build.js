const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const sass = require('sass');

const { copyDir, writeFile, ensureDirSync } = require('./lib/util');
const { loadSurveys, renderSurveys } = require('./lib/render-posts');
const {
  renderHome,
  renderAbout,
  renderMembers,
  renderSurveyIndex,
  renderWeeklyTrends,
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
  const file = path.join(ROOT, 'content/data/trend-watchlist.yml');
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
  const surveys = loadSurveys();
  const weeklyTrends = loadWeeklyTrends();

  buildCss();
  copyAssets();

  renderHome(OUT_DIR, config, { members });
  renderAbout(OUT_DIR, config);
  renderMembers(OUT_DIR, config, members);
  renderSurveyIndex(OUT_DIR, config, surveys);
  renderWeeklyTrends(OUT_DIR, config, weeklyTrends);
  renderSurveys(OUT_DIR, config, surveys);

  const allUrls = [
    '/',
    '/about/',
    '/members/',
    '/survey/',
    '/weekly-trends/',
    ...surveys.map((s) => s.url),
  ];
  writeFile(OUT_DIR, 'feed.xml', generateFeed(config, surveys));
  writeFile(OUT_DIR, 'sitemap.xml', generateSitemap(config, allUrls));
  writeFile(OUT_DIR, '.nojekyll', '');
  writeFile(OUT_DIR, '404.html', render404(config));

  console.log(`빌드 완료: 서베이 ${surveys.length}개`);
}

build();
