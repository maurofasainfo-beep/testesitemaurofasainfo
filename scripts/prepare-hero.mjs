import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const source = resolve(root, 'source-assets/menu10.png');
const { data, info } = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
// Crop transparent margins only. Preserve the supplied artwork and its colors.
let left = info.width, top = info.height, right = 0, bottom = 0;
for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
  if (data[(y * info.width + x) * 4 + 3] === 0) continue;
  left = Math.min(left, x); top = Math.min(top, y);
  right = Math.max(right, x); bottom = Math.max(bottom, y);
}
const width = right - left + 1, height = bottom - top + 1;
const cropped = await sharp(source).extract({ left, top, width, height }).png().toBuffer();
await sharp(cropped).webp({ lossless: true, effort: 6 }).toFile(resolve(root, 'public/images/hero-menu.webp'));
const sample = await sharp(cropped).resize({ width: 210 }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const points = [];
for (let y = 0; y < sample.info.height; y += 3) for (let x = 0; x < sample.info.width; x += 3) {
  const i = (y * sample.info.width + x) * 4;
  if (sample.data[i + 3] < 100) continue;
  const p = Buffer.alloc(8);
  p.writeUInt16LE(x, 0); p.writeUInt16LE(y, 2);
  sample.data.copy(p, 4, i, i + 4); points.push(p);
}
await writeFile(resolve(root, 'public/images/hero-particles.bin'), Buffer.concat(points));
await writeFile(resolve(root, 'src/lib/hero-image.json'), JSON.stringify({ width, height, sampleWidth: sample.info.width, sampleHeight: sample.info.height, count: points.length }, null, 2) + '\n');
console.log({ width, height, samples: points.length });
