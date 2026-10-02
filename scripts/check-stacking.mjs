import { readFile } from 'node:fs/promises';
import { JSDOM } from 'jsdom';
import sharp from 'sharp';

const before = new JSDOM(await readFile('.backups/stacking-cards-20261002/before.html', 'utf8')).window.document;
const after = new JSDOM(await readFile('out/index.html', 'utf8')).window.document;
const errors = [];
const protectedSelectors = [...before.querySelectorAll('main > section:not(#recursos)')].map(section => `#${section.id}`);
protectedSelectors.push('header.topo', '.rodape', '.whats-flutuante');
for (const selector of protectedSelectors) {
  if (before.querySelector(selector)?.outerHTML !== after.querySelector(selector)?.outerHTML) errors.push(`Changed: ${selector}`);
}
for (const id of ['recursos', 'caixa', 'retaguarda']) {
  if (after.querySelectorAll(`#${id}`).length !== 1) errors.push(`Missing/duplicate anchor: ${id}`);
}
if (after.querySelector('#recursos [role=switch], #recursos [role=tablist]')) errors.push('Old demo remains');
const images = [...after.querySelectorAll('#recursos img')];
if (images.length !== 2) errors.push('Expected two real screenshots');
for (const [index, name] of ['caixamenu10', 'retaguardamenu10'].entries()) {
  const image = images[index];
  const original = sharp(`C:/Users/User/Downloads/animacaoiniciosite/${name}.png`);
  const converted = sharp(`public${image.getAttribute('src')}`);
  const meta = await original.metadata();
  if (Number(image.getAttribute('width')) !== meta.width || Number(image.getAttribute('height')) !== meta.height) errors.push(`Dimensions: ${name}`);
  if (image.getAttribute('loading') !== 'lazy' || image.getAttribute('decoding') !== 'async') errors.push(`Loading: ${name}`);
  if (!(await original.ensureAlpha().raw().toBuffer()).equals(await converted.ensureAlpha().raw().toBuffer())) errors.push(`Lossless pixels: ${name}`);
}
console.log(JSON.stringify({ unchangedSectionsAndRegions: protectedSelectors.length, images: images.map(image => ({ src: image.getAttribute('src'), width: image.width, height: image.height })), errors }, null, 2));
if (errors.length) process.exitCode = 1;
