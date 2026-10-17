// Buat logo-mark.svg dari public/logo.svg hasil VTracer:
// ambil shape paling besar saja sehingga tetap terbaca pada ukuran 24-40px.
// Jalankan: node scripts/logo-mark.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const src = readFileSync('public/logo.svg', 'utf8');
const re = /<path d="([^"]*)" fill="([^"]*)" transform="translate\(([-\d.]+),([-\d.]+)\)"\/>/g;

const paths = [];
let m;
while ((m = re.exec(src)) !== null) {
  const [, d, fill, tx, ty] = m;
  const nums = d.match(/-?\d+(?:\.\d+)?/g);
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  if (nums) {
    // VTracer memakai M/C/Z absolut -> pasangan (x,y) bergantian
    for (let i = 0; i + 1 < nums.length; i += 2) {
      const x = parseFloat(nums[i]) + parseFloat(tx);
      const y = parseFloat(nums[i + 1]) + parseFloat(ty);
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }
  if (!Number.isFinite(minX)) continue;
  paths.push({ d, fill, tx: parseFloat(tx), ty: parseFloat(ty), area: (maxX - minX) * (maxY - minY), minX, minY, maxX, maxY });
}

if (paths.length === 0) {
  console.error('Tidak ada path terbaca. Pastikan format transform translate cocok.');
  process.exit(1);
}

const maxArea = Math.max(...paths.map((p) => p.area));
// ambil shape besar: >= 5% dari shape terbesar, maksimal 60 path
const picked = paths
  .filter((p) => p.area >= maxArea * 0.05)
  .sort((a, b) => b.area - a.area)
  .slice(0, 60);

const minX = Math.min(...picked.map((p) => p.minX));
const minY = Math.min(...picked.map((p) => p.minY));
const maxX = Math.max(...picked.map((p) => p.maxX));
const maxY = Math.max(...picked.map((p) => p.maxY));

const body = picked
  .map((p) => `<path d="${p.d}" fill="${p.fill}" transform="translate(${p.tx},${p.ty})"/>`)
  .join('\n');

const out = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${minX} ${minY} ${maxX - minX} ${maxY - minY}">
${body}
</svg>
`;

writeFileSync('public/logo-mark.svg', out);
console.log(`paths=${paths.length} dipilih=${picked.length} viewBox=${minX} ${minY} ${maxX - minX} ${maxY - minY}`);
