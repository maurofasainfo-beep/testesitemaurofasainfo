import { readFile, access, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { gzipSync } from 'node:zlib';
import { JSDOM } from 'jsdom';

const root = resolve(import.meta.dirname, '../out');
const html = await readFile(resolve(root, 'index.html'), 'utf8');
const document = new JSDOM(html).window.document;
const errors = [];
const ids = [...document.querySelectorAll('[id]')].map(el => el.id);
if (new Set(ids).size !== ids.length) errors.push('Duplicate IDs');
if (document.querySelectorAll('h1').length !== 1) errors.push('Expected one h1');
for (const a of document.querySelectorAll('a[href^="#"]')) if (!document.getElementById(a.hash.slice(1))) errors.push(`Missing anchor ${a.hash}`);
const resources = new Set([...document.querySelectorAll('[src],link[href]')].map(el => el.getAttribute('src') || el.getAttribute('href')).filter(url => url?.startsWith('/')));
resources.add('/assets/js/site-original.js');
resources.add('/images/hero-particles.bin');
const sectionMedia = JSON.parse(await readFile(resolve(root, '../src/lib/section-media.json'), 'utf8'));
for (const item of [...sectionMedia.menus, ...sectionMedia.reports]) resources.add(item.src);
const menuPairs = JSON.parse(await readFile(resolve(root, '../src/lib/menu-pairs.json'), 'utf8'));
for (const pair of menuPairs) for (const layout of pair.layouts) resources.add(layout.src);
let jsRaw = 0, jsGzip = 0;
for (const url of resources) {
  const path = resolve(root, '.' + url.split('?')[0]);
  try {
    await access(path);
    if (url.endsWith('.js')) { const file = await readFile(path); jsRaw += file.length; jsGzip += gzipSync(file).length; }
  } catch { errors.push(`Missing resource ${url}`); }
}
for (const image of document.querySelectorAll('img')) {
  if (!image.hasAttribute('alt')) errors.push(`Missing alt ${image.src}`);
  // The original report dialog has an empty image until a report is opened.
  if (image.hasAttribute('src') && (!image.hasAttribute('width') || !image.hasAttribute('height'))) errors.push(`Missing dimensions ${image.src}`);
}
const base = process.argv.find(arg => arg.startsWith('--http='))?.slice(7);
if (base) {
  const urls = ['/', ...resources];
  for (const url of urls) {
    const response = await fetch(new URL(url, base));
    if (!response.ok) errors.push(`HTTP ${response.status}: ${url}`);
  }
  console.log(`HTTP checked: ${urls.length} URLs at ${base}`);
}
const result = { sections: document.querySelectorAll('main > section').length, localResources: resources.size, errors, htmlBytes: Buffer.byteLength(html), jsRawBytes: jsRaw, jsGzipBytes: jsGzip, heroBytes: (await stat(resolve(root, 'images/hero-menu.webp'))).size };
console.log(JSON.stringify(result, null, 2));
if (errors.length) process.exitCode = 1;
