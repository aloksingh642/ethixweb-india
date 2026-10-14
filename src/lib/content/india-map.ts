/**
 * India mainland outline + projected city coordinates.
 *
 * Generated from Natural Earth 110m country data (public domain, via the
 * `world-atlas` topojson package) and projected with d3-geo's Mercator.
 * Regenerate with scripts/generate-india-map.mjs — never hand-edit.
 *
 * viewBox is `0 0 100 102.6`; city x/y are percentages of that box so they
 * stay correct at any rendered size.
 */

export const INDIA_VIEWBOX = '0 0 100 102.6';
export const INDIA_WIDTH = 100;
export const INDIA_HEIGHT = 102.6;

export const INDIA_PATH =
  'M97.8,30L98,31.4L96.9,32.1L97.1,34.4L94.8,33.7L90.5,36.3L90.6,38.4L88.8,41.4L88.6,43.2L87.2,46.1L84.6,45.3L84.5,49L83.7,50.2L84.1,51.8L82.5,52.6L80.7,46.9L79.8,47L79.3,49.2L77.5,47.4L78.5,45.3L80,45.1L81.5,42.1L79.6,41.5L76.6,41.5L73.4,41L73.1,38.5L71.6,38.3L69,36.7L67.8,39.2L70.2,41.1L68.1,42.5L67.4,43.8L69.4,44.8L68.9,46.9L70,49.6L70.5,52.5L70,53.8L67.8,53.8L63.8,54.5L63.9,57.2L62.2,59.2L57.5,61.6L53.8,65.7L51.3,67.9L48,70.1L48,71.7L46.4,72.5L43.4,73.8L41.9,73.9L40.9,76.5L41.6,81L41.8,83.8L40.4,87L40.4,92.6L38.7,92.8L37.2,95.3L38.2,96.4L35.2,97.4L34.1,99.6L32.8,100.6L29.6,97.5L28.1,92.8L26.9,89.5L25.7,87.9L24,84.6L23.2,80.4L22.6,78.3L19.6,73.6L18.2,67L17.3,62.5L17.3,58.3L16.6,55L11.9,57.1L9.5,56.7L5.3,52.4L6.8,51.1L5.9,49.7L2,46.7L4.2,44.3L11.4,44.3L10.8,41.2L8.9,39.4L8.6,36.6L6.4,34.9L10,31L13.8,31.3L17.3,27.4L19.3,23.6L22.5,19.7L22.5,17L25.3,14.8L22.6,12.8L21.5,10.2L20.3,6.7L21.9,5L26.9,6L30.6,5.4L33.7,2L37.3,6.7L36.9,9.9L38.2,11.9L38.1,13.9L35.8,13.4L36.7,17.7L39.9,20.1L44.5,22.8L42.4,24.5L41.1,28L44.3,29.4L47.4,31.3L51.7,33.3L56.2,33.8L58.1,35.7L60.6,36L64.6,36.9L67.3,36.8L67.7,35.4L67.3,33L67.5,31.4L69.5,30.7L69.8,33.6L69.9,34.3L72.8,35.7L74.9,35.1L77.7,35.4L80.4,35.3L80.6,33L79.3,31.8L81.9,31.4L84.9,28.6L88.7,26.2L91.4,27.1L93.8,25.5L95.3,27.9L94.2,29.4Z';

export type MapCity = {
  name: string;
  /** Percentage across the viewBox. */
  x: number;
  /** Percentage down the viewBox. */
  y: number;
  hub: boolean;
  blurb: string;
};

export const MAP_CITIES: MapCity[] = [
  { name: 'Jaipur', x: 27, y: 34.12, hub: true, blurb: 'Headquarters · Design, engineering and support desk' },
  { name: 'Delhi NCR', x: 31.67, y: 27.96, hub: false, blurb: 'Enterprise, BFSI and government' },
  { name: 'Ahmedabad', x: 16.44, y: 47.86, hub: false, blurb: 'D2C, textiles and manufacturing' },
  { name: 'Mumbai', x: 17.45, y: 61.41, hub: false, blurb: 'BFSI, media and enterprise' },
  { name: 'Pune', x: 20.66, y: 63.28, hub: false, blurb: 'SaaS, engineering and automotive' },
  { name: 'Bengaluru', x: 32.94, y: 81.75, hub: false, blurb: 'Product and technology teams' },
  { name: 'Chennai', x: 41.73, y: 81.39, hub: false, blurb: 'Healthcare, manufacturing and SaaS' },
  { name: 'Hyderabad', x: 35.87, y: 67.11, hub: false, blurb: 'Pharma, enterprise IT and GCCs' },
  { name: 'Kochi', x: 28.58, y: 91.68, hub: false, blurb: 'Healthcare, tourism and exports' },
  { name: 'Kolkata', x: 68.32, y: 49.43, hub: false, blurb: 'Logistics, jute and manufacturing' },
];
