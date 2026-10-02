import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';

const root = resolve(import.meta.dirname, '../out');
const port = Number(process.env.PORT || 3010);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.json': 'application/json', '.txt': 'text/plain; charset=utf-8', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.bin': 'application/octet-stream', '.ico': 'image/x-icon' };
try { await stat(resolve(root, 'index.html')); } catch { console.error('Execute npm run build antes de npm start.'); process.exit(1); }
const server = createServer(async (request, response) => {
  try {
    if (!['GET', 'HEAD'].includes(request.method)) { response.writeHead(405); response.end(); return; }
    const pathname = decodeURIComponent(new URL(request.url, `http://127.0.0.1:${port}`).pathname);
    if (pathname === '/recursos' || pathname === '/recursos/') {
      response.writeHead(301, { Location: '/#recursos' }); response.end(); return;
    }
    let file = resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!file.startsWith(root + sep)) { response.writeHead(403); response.end(); return; }
    try {
      try {
        if ((await stat(file)).isDirectory()) {
          const index = resolve(file, 'index.html');
          // Static exports can include an RSC directory beside a page's HTML.
          try { await stat(index); file = index; } catch { file += '.html'; }
        }
      }
      catch { if (!extname(file)) file += '.html'; else throw new Error('Missing file'); }
      const body = await readFile(file);
      response.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream', 'Content-Length': body.length, 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff' });
      response.end(request.method === 'HEAD' ? undefined : body);
    } catch {
      response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      response.end(await readFile(resolve(root, '404.html')));
    }
  } catch { response.writeHead(400); response.end('Bad request'); }
});
server.listen(port, '127.0.0.1', () => console.log(`Menu10: http://127.0.0.1:${port}`));
server.on('error', error => { console.error(error.message); process.exitCode = 1; });
