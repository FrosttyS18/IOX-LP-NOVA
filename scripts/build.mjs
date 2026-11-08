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
];

await mkdir(output, { recursive: true });
for (const file of files) {
  await copyFile(new URL(file, root), new URL(file, output));
}
await cp(new URL('assets/', root), new URL('assets/', output), { recursive: true });
console.log('Landing page preparada em dist/.');
