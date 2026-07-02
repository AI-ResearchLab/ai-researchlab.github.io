const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '../dist');
const PORT = process.env.PORT || 4000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.xml': 'application/xml; charset=utf-8',
  '.ico': 'image/x-icon',
};

function resolveFilePath(urlPath) {
  let filePath = path.join(ROOT, urlPath);
  if (urlPath.endsWith('/')) return path.join(filePath, 'index.html');
  if (path.extname(filePath)) return filePath;
  return path.join(filePath, 'index.html');
}

http
  .createServer((req, res) => {
    const urlPath = decodeURIComponent(req.url.split('?')[0]);
    const filePath = resolveFilePath(urlPath);

    fs.readFile(filePath, (err, data) => {
      if (err) {
        fs.readFile(path.join(ROOT, '404.html'), (err2, notFoundData) => {
          res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(notFoundData || 'Not found');
        });
        return;
      }
      const ext = path.extname(filePath);
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
      res.end(data);
    });
  })
  .listen(PORT, () => {
    console.log(`dist/ 를 http://localhost:${PORT} 에서 서빙 중`);
  });
