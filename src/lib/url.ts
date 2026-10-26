/**
 * Prefix an internal path with the configured base path.
 * On GitHub Pages without the custom domain the site lives under
 * /facilitating-families-counseling/, so every internal href must go through here.
 */
const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export function url(path: string): string {
  if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Strip the base so the current pathname can be compared with a nav link. */
export function currentPath(pathname: string): string {
  const stripped = base && pathname.startsWith(base) ? pathname.slice(base.length) : pathname;
  const noTrailing = stripped.replace(/\/+$/, '');
  return noTrailing === '' ? '/' : noTrailing;
}
