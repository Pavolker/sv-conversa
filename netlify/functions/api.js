const { createServer } = require('http');
const { parse } = require('url');
const { readFileSync, existsSync } = require('fs');
const path = require('path');

const DIST_DIR = path.join(__dirname, '..', 'public');

const http = createServer((req, res) => {
  const parsedUrl = parse(req.url, true);
  const pathname = parsedUrl.pathname;

  if (pathname === '/' || pathname === '/index.html') {
    const filePath = path.join(DIST_DIR, 'index.html');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(readFileSync(filePath));
    return;
  }

  if (pathname.startsWith('/css/')) {
    const filePath = path.join(DIST_DIR, pathname);
    if (existsSync(filePath)) {
      res.writeHead(200, { 'Content-Type': 'text/css' });
      res.end(readFileSync(filePath));
      return;
    }
  }

  if (pathname.startsWith('/js/')) {
    const filePath = path.join(DIST_DIR, pathname);
    if (existsSync(filePath)) {
      res.writeHead(200, { 'Content-Type': 'application/javascript' });
      res.end(readFileSync(filePath));
      return;
    }
  }

  res.writeHead(404);
  res.end('Not Found');
});

exports.handler = async (event, context) => {
  return new Promise((resolve, reject) => {
    http.on('error', reject);
    http.on('listening', () => {
      const { port } = http.address();
      http.close();
      resolve({
        statusCode: 200,
        body: '',
        headers: { 'Content-Type': 'text/html' }
      });
    });
    http.listen(0);
  });
};