import { copyFile, cp, mkdir } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const output = new URL('dist/', root);
const files = [
  'index.html',
  'styles.css',
  'theme.css',
  'theme.js',
  'script.js',
  'section-effects.js',
  'historical-series.js',
  'simulator.js',
  'contact.js',
  'form-controls.js',
  'robots.txt',
  'sitemap.txt',
  'llms.txt',
];

await mkdir(output, { recursive: true });
for (const file of files) {
  await copyFile(new URL(file, root), new URL(file, output));
}
for (const [source, alias] of [['robots.txt', 'robot.txt'], ['llms.txt', 'llm.txt']]) {
  await copyFile(new URL(source, root), new URL(alias, output));
}
await cp(new URL('assets/', root), new URL('assets/', output), { recursive: true });
console.log('Landing page preparada em dist/.');
