const fs = require('fs');
const yaml = require('js-yaml');
const MarkdownIt = require('markdown-it');

const md = new MarkdownIt({ html: true, linkify: true, typographer: true });

const FRONT_MATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

function readContentFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const match = raw.match(FRONT_MATTER_RE);
  if (!match) return { data: {}, body: raw };
  const data = yaml.load(match[1]) || {};
  return { data, body: match[2] };
}

// 아주 작은 {{ page.field }} 치환기 — 저자들이 서베이/포스트 본문에서
// front matter 값을 그대로 인용하고 싶을 때 쓰는 용도 (예: 리뷰어, 날짜).
function substitutePageVars(body, data) {
  return body.replace(/\{\{\s*page\.(\w+)\s*(?:\|\s*date:\s*"[^"]*")?\s*\}\}/g, (_, key) => {
    const value = data[key];
    if (value === undefined || value === null) return '';
    if (key === 'date' || value instanceof Date) {
      const d = new Date(value);
      return d.toISOString().slice(0, 10);
    }
    return String(value);
  });
}

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\wㄱ-힝\s-]/g, '')
    .replace(/\s+/g, '-') || 'section';
}

// 마크다운 본문을 렌더링하면서 h2/h3 제목에 id를 붙이고 목차(toc)를 뽑아낸다.
function renderMarkdown(body, data) {
  const substituted = substitutePageVars(body, data);
  const tokens = md.parse(substituted, {});
  const toc = [];
  const seen = {};

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.type === 'heading_open' && (token.tag === 'h2' || token.tag === 'h3')) {
      const inline = tokens[i + 1];
      const text = inline ? inline.content : '';
      let slug = slugify(text);
      if (seen[slug] !== undefined) {
        seen[slug] += 1;
        slug = `${slug}-${seen[slug]}`;
      } else {
        seen[slug] = 0;
      }
      token.attrSet('id', slug);
      toc.push({ level: token.tag, text, slug });
    }
  }

  const html = md.renderer.render(tokens, md.options, {});
  return { html, toc };
}

function estimateReadMinutes(body) {
  const chars = body.replace(/\s/g, '').length;
  return Math.max(1, Math.round(chars / 500));
}

module.exports = { readContentFile, renderMarkdown, estimateReadMinutes, slugify };
