const fs = require('fs');
const path = require('path');

function ensureDirSync(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

// urlPath 예: '/', '/about/', '/categories/llm/' → dist 안의 index.html 경로로 변환
function writePage(outDir, urlPath, html) {
  const rel = urlPath === '/' ? 'index.html' : path.join(urlPath.replace(/^\//, ''), 'index.html');
  const full = path.join(outDir, rel);
  ensureDirSync(path.dirname(full));
  fs.writeFileSync(full, html, 'utf8');
}

function writeFile(outDir, relPath, content) {
  const full = path.join(outDir, relPath);
  ensureDirSync(path.dirname(full));
  fs.writeFileSync(full, content);
}

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  ensureDirSync(dest);
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

module.exports = { ensureDirSync, writePage, writeFile, copyDir };
