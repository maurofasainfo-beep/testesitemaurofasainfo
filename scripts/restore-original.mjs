import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { JSDOM } from 'jsdom';

const root = resolve(import.meta.dirname, '..');
const html = await readFile(resolve(root, 'original/index.html'), 'utf8');
const doc = new JSDOM(html).window.document;
const normalize = content => content.replaceAll('assets/img/', '/assets/img/');
const sections = [...doc.querySelectorAll('main > section')].map(el => ({
  id: el.id, className: el.className, labelledBy: el.getAttribute('aria-labelledby'), html: normalize(el.innerHTML),
}));
const hero = sections.find(s => s.id === 'inicio');
const heroDoc = new JSDOM(hero.html).window.document;
heroDoc.querySelectorAll('canvas,.palco-particulas,.dica').forEach(el => el.remove());
hero.html = heroDoc.body.innerHTML;
const closing = sections.find(s => s.className === 'fechamento');
const closingDoc = new JSDOM(closing.html).window.document;
closingDoc.querySelector('canvas')?.remove();
closing.html = closingDoc.body.innerHTML;
const customers = [
  ['benitos', 'Benito’s Pizzaria'], ['don-betones', 'Don Betones Pizza'],
  ['diniz', 'Pizzaria Diniz'], ['tatuliano', 'Restaurante Tatuliano'],
  ['sumi-sushi', 'Sumi Sushi'], ['amanda-nunes', 'Confeitaria Amanda Nunes'],
];
const brands = sections.find(s => s.id === 'clientes');
const brandsDoc = new JSDOM(brands.html).window.document;
brandsDoc.querySelector('.marcas-titulo')?.remove();
brands.labelledBy = null;
brandsDoc.querySelector('.marcas-grupo').innerHTML = customers.map(([slug, name]) => `<li class="cliente-identificado"><figure><span class="cliente-logo${slug === 'sumi-sushi' ? ' cliente-logo-clara' : ''}"><img src="/images/clients/${slug}.webp" alt="${name}" width="220" height="150" loading="lazy" decoding="async"></span></figure></li>`).join('');
brands.html = brandsDoc.body.innerHTML;
const symbols = [...doc.querySelectorAll('body > svg')].map(el => el.outerHTML).join('');
const output = {
  title: doc.title,
  description: doc.querySelector('meta[name="description"]').content,
  header: normalize(doc.querySelector('header').innerHTML),
  footer: normalize(doc.querySelector('footer').innerHTML),
  floating: doc.querySelector('.whats-flutuante').outerHTML,
  symbols, sections,
};
await writeFile(resolve(root, 'src/lib/original-page.json'), JSON.stringify(output, null, 2) + '\n');
// New section components own their selectors. Preserve navigation, footer and business-hours behavior.
const names = ['config', 'movimento', 'main'];
const scripts = await Promise.all(names.map(name => readFile(resolve(root, `public/assets/js/${name}.js`), 'utf8')));
await writeFile(resolve(root, 'public/assets/js/site-original.js'), scripts.join('\n;\n'));
console.log('Original page restored: ' + sections.length + ' sections, original copy and original classes.');
