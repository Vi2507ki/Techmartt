// Simple static file server for TechMart Frontend
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const FRONTEND_DIR = path.join(__dirname, 'frontend/pages');

const mimeTypes = {
  '.html': 'text/html',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon'
};

const server = http.createServer((req, res) => {
  let urlPath = req.url === '/' ? '/index.html' : req.url;
  // Strip query strings
  urlPath = urlPath.split('?')[0];

  let filePath = path.join(FRONTEND_DIR, urlPath);

  // If no extension, try .html
  if (!path.extname(filePath)) filePath += '.html';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h2>404 — Page not found</h2>');
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`🌐 TechMart Frontend: http://localhost:${PORT}`);
  console.log(`   Home/Shop : http://localhost:${PORT}/index.html`);
  console.log(`   Checkout  : http://localhost:${PORT}/checkout.html`);
  console.log(`   My Orders : http://localhost:${PORT}/orders.html`);
  console.log(`   Admin     : http://localhost:${PORT}/admin.html`);
});
