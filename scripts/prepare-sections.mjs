import sharp from 'sharp';
import { mkdir, writeFile, copyFile, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const root = resolve(import.meta.dirname, '..');
const sourceDir = resolve(root, 'source-assets/sections');
const outputDir = resolve(root, 'public/images/sections');
await mkdir(sourceDir, { recursive: true }); await mkdir(outputDir, { recursive: true });
const menus = [];
for (const [id, label] of [['pizzaria','Pizzaria'],['hamburgueria','Hamburgueria'],['marmitaria','Marmitaria'],['sushi','Sushi'],['pastel','Pastelaria']]) {
  const source = resolve(sourceDir, `${id}.png`);
  try { await readFile(source); } catch { await copyFile(resolve('C:/Users/User/Downloads/animacaoiniciosite', `${id}.png`), source); }
  const { data, info } = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let left=info.width,top=info.height,right=0,bottom=0;
  for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++){
    if(data[(y*info.width+x)*4+3]===0)continue;
    left=Math.min(left,x);top=Math.min(top,y);right=Math.max(right,x);bottom=Math.max(bottom,y);
  }
  const result = await sharp(source).extract({left,top,width:right-left+1,height:bottom-top+1})
    .resize({width:520,height:1080,fit:'inside',withoutEnlargement:true})
    .webp({quality:90,alphaQuality:100,effort:6}).toFile(resolve(outputDir,`${id}.webp`));
  menus.push({ id,label,src:`/images/sections/${id}.webp`,width:result.width,height:result.height,alt:`Cardápio de ${label.toLowerCase()} com a identidade do estabelecimento, em uma moldura de celular` });
}
const reports = [];
for(const [id,label,alt,caption] of [
  ['vendas','Vendas','Tela real de relatórios do Menu10, com vendas por dia, modalidade, canal e horário, bairros e mapa de calor.','Veja o que vendeu, quando e de quais bairros vêm os pedidos.'],
  ['avaliacoes','Avaliações','Tela real da pesquisa de satisfação no Menu10, com avaliações do atendimento e índice NPS.','Acompanhe as avaliações do atendimento e a satisfação dos seus clientes.'],
]) {
  const src = `/assets/img/relatorio-${id}.webp`;
  const result = await sharp(resolve(root,`public${src}`)).metadata();
  reports.push({id,label,src,width:result.width,height:result.height,alt,caption});
}
await writeFile(resolve(root,'src/lib/section-media.json'),JSON.stringify({menus,reports},null,2)+'\n');
console.log(JSON.stringify({menus,reports},null,2));
