// Renders public/og-default.png (1200x630) from an inline SVG using sharp (ships with Astro).
// Run: node scripts/make-og.mjs
import sharp from 'sharp';
import { writeFileSync } from 'node:fs';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#f8f4ed"/>
  <circle cx="1010" cy="120" r="300" fill="#d9e5e1" opacity="0.8"/>
  <circle cx="140" cy="560" r="240" fill="#f1dfd4" opacity="0.9"/>
  <g fill="none" stroke="#1e4d48" stroke-opacity="0.12" stroke-width="2">
    <circle cx="980" cy="330" r="260"/><circle cx="980" cy="330" r="190"/><circle cx="980" cy="330" r="120"/>
  </g>
  <text x="90" y="150" font-family="Georgia, 'Iowan Old Style', serif" font-size="30" letter-spacing="6" fill="#a04e31">FACILITATING FAMILIES COUNSELING, LLC</text>
  <text x="90" y="300" font-family="Georgia, 'Iowan Old Style', serif" font-size="112" fill="#1e4d48">I believe</text>
  <text x="90" y="420" font-family="Georgia, 'Iowan Old Style', serif" font-size="112" fill="#1e4d48">in change.</text>
  <text x="90" y="520" font-family="Helvetica, Arial, sans-serif" font-size="30" fill="#5e5750">Eating disorders · Couples &amp; family · Individual support · Trauma</text>
</svg>`;

const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
writeFileSync(new URL('../public/og-default.png', import.meta.url), png);
console.log('wrote public/og-default.png', png.length, 'bytes');
