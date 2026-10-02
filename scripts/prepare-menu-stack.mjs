import sharp from 'sharp';
import { mkdir, copyFile, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
// Refresh is explicit: routine builds never read an external Downloads folder.
const refresh = process.argv.includes('--refresh');
const sources = resolve(root, 'source-assets/sections');
const output = resolve(root, 'public/images/sections');
await mkdir(sources, { recursive: true });
await mkdir(output, { recursive: true });
const manifest = JSON.parse(await readFile(resolve(root, 'src/lib/section-media.json'), 'utf8'));
for (const item of manifest.menus) {
  const source = resolve(sources, `${item.id}.png`);
  if (refresh) await copyFile(resolve('C:/Users/User/Downloads/animacaoiniciosite', `${item.id}.png`), source);
  const { data, info } = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let left = info.width, top = info.height, right = -1, bottom = -1;
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
    if (data[(y * info.width + x) * 4 + 3] === 0) continue;
    left = Math.min(left, x); top = Math.min(top, y); right = Math.max(right, x); bottom = Math.max(bottom, y);
  }
  if (right < left) throw new Error(`Empty image: ${source}`);
  const result = await sharp(source).extract({ left, top, width: right-left+1, height: bottom-top+1 })
    .resize({ width: 520, height: 1080, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 90, alphaQuality: 100, effort: 6 }).toFile(resolve(output, `${item.id}.webp`));
  item.width = result.width; item.height = result.height;
  console.log(`${item.label}: ${info.width}x${info.height} -> ${result.width}x${result.height}, ${Math.round(result.size / 1024)} KB`);
}
await writeFile(resolve(root, 'src/lib/section-media.json'), JSON.stringify(manifest, null, 2) + '\n');
