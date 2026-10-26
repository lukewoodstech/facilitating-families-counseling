import type { ImageMetadata } from 'astro';

/** Every original image downloaded from Emree's Google Site, keyed by file name. */
const originals = import.meta.glob<{ default: ImageMetadata }>('../assets/original/*.{png,jpg}', { eager: true });

export function original(fileName: string): ImageMetadata {
  const hit = originals[`../assets/original/${fileName}`];
  if (!hit) throw new Error(`Missing original asset: src/assets/original/${fileName}`);
  return hit.default;
}
