import sharp from 'sharp';
import { copyFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
const root = resolve(import.meta.dirname, '..');
await mkdir(resolve(root, 'source-assets/layouts'), { recursive: true });
await mkdir(resolve(root, 'public/images/layouts'), { recursive: true });
for (const name of ['layout1', 'layout2']) {
  const source = resolve(root, `source-assets/layouts/${name}.png`);
  if (process.argv.includes('--refresh')) await copyFile(`C:/Users/User/Downloads/animacaoiniciosite/${name}.png`, source);
  const { data, info } = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let left = info.width, top = info.height, right = -1, bottom = -1;
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
    if (data[(y * info.width + x) * 4 + 3] === 0) continue;
    left = Math.min(left, x); top = Math.min(top, y); right = Math.max(right, x); bottom = Math.max(bottom, y);
  }
  const width = right - left + 1, height = bottom - top + 1;
  if (width !== 662 || height !== 1370) throw new Error(`Review iPhone alignment for ${name}: ${width}x${height}`);
  // Both phone frames share the same dimensions, but their transparent margins differ.
  const result = await sharp(source).extract({ left, top, width, height }).resize(520, 1076)
    .webp({ quality: 92, alphaQuality: 100, effort: 6 }).toFile(resolve(root, `public/images/layouts/${name}.webp`));
  console.log(name, result);
}
