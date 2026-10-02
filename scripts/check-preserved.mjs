import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {JSDOM} from 'jsdom';
const baseline=JSON.parse(await readFile('.backups/sections-reform/preserved.json','utf8'));
const errors=[];
for(const [file,hash] of Object.entries(baseline.hashes)){
 if(createHash('sha256').update(await readFile(file)).digest('hex')!==hash) errors.push(`Protected file changed: ${file}`);
}
const doc=new JSDOM(await readFile('out/index.html','utf8')).window.document;
for(const [selector,markup] of Object.entries(baseline.markup)){
 if(doc.querySelector(selector)?.outerHTML!==markup)errors.push(`Protected markup changed: ${selector}`);
}
console.log(JSON.stringify({protectedFiles:Object.keys(baseline.hashes).length,protectedRegions:Object.keys(baseline.markup),errors},null,2));
if(errors.length)process.exitCode=1;
