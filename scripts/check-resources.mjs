import { readFile, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { JSDOM } from 'jsdom';
const base = '.backups/section-rhythm-20261002';
const before = new JSDOM(await readFile(`${base}/before.html`, 'utf8')).window.document;
const home = new JSDOM(await readFile('out/index.html', 'utf8')).window.document;
const snapshot = JSON.parse(await readFile(`${base}/protected.json`, 'utf8'));
const errors = [];
for (const [file, hash] of Object.entries(snapshot.hashes)) {
  if (createHash('sha256').update(await readFile(file)).digest('hex') !== hash) errors.push(`Protected file changed: ${file}`);
}
const protectedRegions = ['#inicio', '#clientes', '#cardapios', '#gestao', '#como-comecar', '.rodape', '.whats-flutuante'];
for (const selector of protectedRegions) {
  if (before.querySelector(selector)?.outerHTML !== home.querySelector(selector)?.outerHTML) errors.push(`Protected markup changed: ${selector}`);
}
const oldHeader = before.querySelector('header.topo').cloneNode(true);
oldHeader.querySelectorAll('a[href="/recursos"]').forEach(a => a.setAttribute('href', '/#recursos'));
if (oldHeader.outerHTML !== home.querySelector('header.topo').outerHTML) errors.push('Unexpected header markup change');
if (home.querySelectorAll('h1').length !== 1) errors.push('Expected one h1');
const ids = [...home.querySelectorAll('[id]')].map(el => el.id);
if (new Set(ids).size !== ids.length) errors.push('Duplicate ids');
for (const link of home.querySelectorAll('a[href]')) {
  const url = new URL(link.getAttribute('href'), 'https://local.test/');
  if (url.origin !== 'https://local.test') continue;
  if (url.pathname !== '/' || (url.hash && !home.getElementById(decodeURIComponent(url.hash.slice(1))))) errors.push(`Missing destination: ${url.pathname}${url.hash}`);
}
for (const id of ['recursos', 'caixa', 'retaguarda']) if (!home.getElementById(id)) errors.push(`Missing section: ${id}`);
for (const file of ['src/app/recursos/page.tsx', 'out/recursos.html']) {
  try { await access(file); errors.push(`Removed route still exists: ${file}`); } catch {}
}
if ((await readFile('out/sitemap.xml', 'utf8')).includes('/recursos')) errors.push('Removed route remains in sitemap');
const map = home.querySelector('.support-map iframe');
if (!map || !map.src.startsWith('https://www.google.com/maps?q=') || map.getAttribute('loading') !== 'lazy') errors.push('Expected lazy Google Maps embed');
if (!home.querySelector('.support-map-fallback a') || !home.querySelector('.support-map-address a')) errors.push('Map directions fallback missing');
const host = process.argv.find(arg => arg.startsWith('--http='))?.slice(7);
if (host) {
  for (const route of ['/', '/sitemap.xml']) if (!(await fetch(new URL(route, host))).ok) errors.push(`HTTP failure: ${route}`);
  for (const route of ['/recursos', '/recursos/']) {
    const response = await fetch(new URL(route, host), { redirect: 'manual' });
    if (response.status !== 301 || response.headers.get('location') !== '/#recursos') errors.push(`Redirect failed: ${route}`);
  }
}
console.log(JSON.stringify({ protectedFiles: Object.keys(snapshot.hashes).length, protectedRegions: protectedRegions.length, header: 'only Resources destination changed', errors }, null, 2));
if (errors.length) process.exitCode = 1;
