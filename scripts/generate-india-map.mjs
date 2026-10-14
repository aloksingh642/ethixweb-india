/**
 * Regenerates src/lib/content/india-map.ts from Natural Earth 110m data.
 *
 *   node scripts/generate-india-map.mjs
 *
 * Requires network access on first run (downloads world-atlas). The generated
 * file is committed so the build never depends on this script.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CITY_META = {
  Jaipur: 'Headquarters · Design, engineering and support desk',
  'Delhi NCR': 'Enterprise, BFSI and government',
  Ahmedabad: 'D2C, textiles and manufacturing',
  Mumbai: 'BFSI, media and enterprise',
  Pune: 'SaaS, engineering and automotive',
  Bengaluru: 'Product and technology teams',
  Chennai: 'Healthcare, manufacturing and SaaS',
  Hyderabad: 'Pharma, enterprise IT and GCCs',
  Kochi: 'Healthcare, tourism and exports',
  Kolkata: 'Logistics, jute and manufacturing',
};

const work = join(tmpdir(), 'ethix-mapgen');
mkdirSync(work, { recursive: true });

execSync('npm init -y', { cwd: work, stdio: 'ignore' });
execSync('npm i --no-audit --no-fund d3-geo topojson-client', { cwd: work, stdio: 'ignore' });
execSync(
  'curl -sL -o countries-110m.json https://unpkg.com/world-atlas@2.0.2/countries-110m.json',
  { cwd: work, stdio: 'inherit' },
);

const { geoMercator, geoPath } = await import(join(work, 'node_modules/d3-geo/src/index.js'));
const { feature } = await import(join(work, 'node_modules/topojson-client/src/index.js'));

const topo = JSON.parse(readFileSync(join(work, 'countries-110m.json'), 'utf8'));
const india = feature(topo, topo.objects.countries).features.find(
  (f) => String(f.id) === '356' || f.properties?.name === 'India',
);
if (!india) throw new Error('India feature not found');

const PAD = 2;
const projection = geoMercator().fitExtent(
  [
    [PAD, PAD],
    [100 - PAD, 120 - PAD],
  ],
  india,
);
const pathGen = geoPath(projection);
const bounds = pathGen.bounds(india);
const W = +(bounds[1][0] - bounds[0][0] + PAD * 2).toFixed(2);
const H = +(bounds[1][1] - bounds[0][1] + PAD * 2).toFixed(2);
const dx = PAD - bounds[0][0];
const dy = PAD - bounds[0][1];

const path = pathGen(india).replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (_, x, y) =>
  `${(+(+x + dx)).toFixed(1)},${(+(+y + dy)).toFixed(1)}`,
);

const CITIES = [
  ['Jaipur', 26.9124, 75.7873, true],
  ['Delhi NCR', 28.6139, 77.209, false],
  ['Ahmedabad', 23.0225, 72.5714, false],
  ['Mumbai', 19.076, 72.8777, false],
  ['Pune', 18.5204, 73.8567, false],
  ['Bengaluru', 12.9716, 77.5946, false],
  ['Chennai', 13.0827, 80.2707, false],
  ['Hyderabad', 17.385, 78.4867, false],
  ['Kochi', 9.9312, 76.2673, false],
  ['Kolkata', 22.5726, 88.3639, false],
];

const cities = CITIES.map(([name, lat, lon, hub]) => {
  const p = projection([lon, lat]);
  return {
    name,
    hub,
    x: +(((p[0] + dx) / W) * 100).toFixed(2),
    y: +(((p[1] + dy) / H) * 100).toFixed(2),
    blurb: CITY_META[name] ?? '',
  };
});

const file = `/**
 * India mainland outline + projected city coordinates.
 *
 * Generated from Natural Earth 110m country data (public domain, via the
 * \`world-atlas\` topojson package) and projected with d3-geo's Mercator.
 * Regenerate with scripts/generate-india-map.mjs — never hand-edit.
 *
 * viewBox is \`0 0 ${W} ${H}\`; city x/y are percentages of that box so they
 * stay correct at any rendered size.
 */

export const INDIA_VIEWBOX = '0 0 ${W} ${H}';
export const INDIA_WIDTH = ${W};
export const INDIA_HEIGHT = ${H};

export const INDIA_PATH =
  '${path}';

export type MapCity = {
  name: string;
  /** Percentage across the viewBox. */
  x: number;
  /** Percentage down the viewBox. */
  y: number;
  hub: boolean;
  /** What this city does for us. */
  blurb: string;
};

export const MAP_CITIES: MapCity[] = [
${cities
  .map(
    (c) =>
      `  { name: '${c.name}', x: ${c.x}, y: ${c.y}, hub: ${c.hub}, blurb: '${c.blurb}' },`,
  )
  .join('\n')}
];
`;

writeFileSync(new URL('../src/lib/content/india-map.ts', import.meta.url), file);
console.log(`Wrote india-map.ts — viewBox 0 0 ${W} ${H}, ${cities.length} cities.`);
