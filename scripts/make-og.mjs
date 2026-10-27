// Builds the link-preview image (public/og-default.png, 1200x630) and favicons from
// Emree's logo: her tree mark on the left, the wordmark lettering on the right, on cream
// with the site's leaf-green wave. Run: node scripts/make-og.mjs
import sharp from 'sharp';

const W = 1200, H = 630;
const wave = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#faf7f1"/>
  <path d="M0 540 C 200 500 420 505 620 530 C 820 555 1020 560 1200 520 L1200 630 L0 630 Z" fill="#e6eedd"/>
  <path d="M0 585 C 260 560 480 565 700 590 C 900 612 1050 612 1200 580 L1200 630 L0 630 Z" fill="#426b69"/>
</svg>`);

// tree mark, ~400px tall
const tree = await sharp('src/assets/logo-mark-transparent.png').resize({ height: 380 }).png().toBuffer();
const tm = await sharp(tree).metadata();
// lettering only (the wordmark minus its small tree), ~640px wide
const word = await sharp('src/assets/logo-wordmark-nav.png');
const wm = await word.metadata();
const text = await word.extract({ left: 300, top: 0, width: wm.width - 300, height: wm.height }).trim().resize({ width: 600 }).png().toBuffer();
const tx = await sharp(text).metadata();

const treeLeft = 70, gap = 48;
const treeTop = Math.round((H - 90 - tm.height) / 2);
const textLeft = treeLeft + tm.width + gap;
const textTop = Math.round((H - 90 - tx.height) / 2);

await sharp(wave)
  .composite([
    { input: tree, left: treeLeft, top: treeTop },
    { input: text, left: textLeft, top: textTop },
  ])
  .png({ compressionLevel: 9 })
  .toFile('public/og-default.png');

// favicons from her tree mark
await sharp('src/assets/logo-mark-transparent.png').resize(64, 64, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile('public/favicon.png');
await sharp({ create: { width: 180, height: 180, channels: 4, background: '#faf7f1' } })
  .composite([{ input: await sharp('src/assets/logo-mark-transparent.png').resize(140, 140, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer(), left: 20, top: 20 }])
  .png().toFile('public/apple-touch-icon.png');
console.log('og + favicons written');
