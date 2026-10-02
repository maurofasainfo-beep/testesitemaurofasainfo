import sharp from 'sharp';
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const root = resolve(import.meta.dirname, '..');
await mkdir(resolve(root, 'source-assets/menu-pairs'), { recursive: true });
await mkdir(resolve(root, 'public/images/menu-pairs'), { recursive: true });
const { menus } = JSON.parse(await readFile(resolve(root, 'src/lib/section-media.json'), 'utf8'));
const pairs = [];
for (const menu of menus) {
  const pair = { id: menu.id, label: menu.label, layouts: [] };
  for (const layout of [1, 2]) {
    const filename = `${menu.id}${layout === 2 ? 'layout2' : ''}.png`;
    const source = resolve(root, 'source-assets/menu-pairs', filename);
    if (process.argv.includes('--refresh')) await copyFile(resolve('C:/Users/User/Downloads/animacaoiniciosite', filename), source);
    const { data, info } = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    let left = info.width, top = info.height, right = -1, bottom = -1;
    for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
      if (data[(y * info.width + x) * 4 + 3] === 0) continue;
      left = Math.min(left, x); top = Math.min(top, y); right = Math.max(right, x); bottom = Math.max(bottom, y);
    }
    const width = right-left+1, height = bottom-top+1;
    if (width !== 662 || height !== 1370) throw new Error(`Review alignment: ${filename}, ${width}x${height}`);
    const src = `/images/menu-pairs/${menu.id}-${layout}.webp`;
    await sharp(source).extract({ left, top, width, height }).resize(520,1076)
      .webp({ quality: 92, alphaQuality: 100, effort: 6 }).toFile(resolve(root, `public${src}`));
    pair.layouts.push({ src, width: 520, height: 1076, alt: `Cardápio de ${menu.label.toLowerCase()} no iPhone, layout ${layout}: ${layout === 1 ? 'categorias em imagens' : 'produtos em lista'}` });
  }
  pairs.push(pair);
}
await writeFile(resolve(root, 'src/lib/menu-pairs.json'), JSON.stringify(pairs, null, 2)+'\n');
console.log(`Prepared ${pairs.length} aligned pairs.`);
