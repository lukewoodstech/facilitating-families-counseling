// Generates src/data/states.json: a clean outline path for each licensed state,
// fitted into the same 300x300 box so the cards look uniform.
// Source: us-atlas (US Census Bureau cartographic boundaries, 1:10m). Run: node scripts/make-states.mjs
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
import { geoMercator, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
const require = createRequire(import.meta.url);
const topo = require('us-atlas/states-10m.json');
const states = feature(topo, topo.objects.states).features;
const want = { '27': 'Minnesota', '55': 'Wisconsin', '56': 'Wyoming', '16': 'Idaho', '49': 'Utah' };
const SIZE = 300, PAD = 12;
const out = [];
for (const [id, name] of Object.entries(want)) {
  const f = states.find((s) => s.id === id);
  if (!f) throw new Error('missing ' + name);
  const proj = geoMercator().fitExtent([[PAD, PAD], [SIZE - PAD, SIZE - PAD]], f);
  const d = geoPath(proj)(f);
  const [[x0, y0], [x1, y1]] = geoPath(proj).bounds(f);
  out.push({ name, slug: name.toLowerCase(), viewBox: `0 0 ${SIZE} ${SIZE}`, d: d.replace(/(\d+\.\d{2})\d+/g, '$1'), width: Math.round(x1 - x0), height: Math.round(y1 - y0) });
}
writeFileSync('src/data/states.json', JSON.stringify(out, null, 1));
console.log(out.map((s) => `${s.name} ${s.width}x${s.height} path ${s.d.length} chars`).join('\n'));
