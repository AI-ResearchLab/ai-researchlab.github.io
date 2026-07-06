const fs = require('fs');
const path = require('path');
const { readContentFile, renderMarkdown, estimateReadMinutes } = require('./markdown');
const { renderDocument } = require('./layout');
const { writePage } = require('./util');

const SURVEYS_DIR = path.join(__dirname, '../../content/surveys');
const FILENAME_RE = /^(\d{4})-(\d{2})-(\d{2})-(.+)\.md$/;

function loadCollection(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((filename) => {
      const match = filename.match(FILENAME_RE);
      const { data, body } = readContentFile(path.join(dir, filename));
      const { html, toc } = renderMarkdown(body, data);
      return {
        filename,
        slug: match ? match[4] : filename.replace(/\.md$/, ''),
        year: match ? match[1] : null,
        month: match ? match[2] : null,
        day: match ? match[3] : null,
        data,
        html,
        toc,
        readMinutes: estimateReadMinutes(body),
      };
    })
    .sort((a, b) => new Date(b.data.date) - new Date(a.data.date));
}

function loadSurveys() {
  return loadCollection(SURVEYS_DIR).map((survey) => ({
    ...survey,
    url: `/survey/${survey.filename.replace(/\.md$/, '')}/`,
  }));
}

function formatDate(dateValue) {
  const d = new Date(dateValue);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

function renderTocHtml(toc) {
  if (!toc.length) return '';
  const items = toc.map((t) => `<li style="${t.level === 'h3' ? 'padding-left:0.75rem' : ''}"><a href="#${t.slug}">${t.text}</a></li>`).join('');
  return `<aside class="toc"><p class="toc__title">목차</p><ul class="toc__list">${items}</ul></aside>`;
}

function renderEntryDetail(entry, config, { kicker, metaExtra } = {}) {
  const tocHtml = renderTocHtml(entry.toc);
  const tagsHtml = (entry.data.tags || [])
    .map((t) => `<span class="tag-pill">#${t}</span>`)
    .join('');

  const body = `
<div class="page page--with-toc">
  <div class="page__body">
    <div class="page__header">
      ${kicker ? `<p class="card__meta">${kicker}</p>` : ''}
      <h1 class="page__title">${entry.data.title}</h1>
      <p class="page__meta">${formatDate(entry.data.date)} · ${entry.readMinutes}분 읽기${metaExtra ? ` · ${metaExtra}` : ''}</p>
    </div>
    ${entry.html}
    ${tagsHtml ? `<div style="margin-top:2rem;">${tagsHtml}</div>` : ''}
  </div>
  ${tocHtml}
</div>`;

  return renderDocument({
    title: entry.data.title,
    description: entry.data.excerpt,
    url: entry.url,
    bodyHtml: body,
    config,
  });
}

function renderSurveys(outDir, config, surveys) {
  surveys.forEach((survey) => {
    const html = renderEntryDetail(survey, config, {
      kicker: survey.data.category,
      metaExtra: survey.data.reviewer ? `리뷰어 @${survey.data.reviewer}` : '',
    });
    writePage(outDir, survey.url, html);
  });
}

module.exports = { loadSurveys, renderSurveys, formatDate };
