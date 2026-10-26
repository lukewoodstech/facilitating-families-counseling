# Facilitating Families Counseling, LLC

Marketing site for Emree's therapy practice. Astro 7 + Tailwind v4, fully static,
deployed to GitHub Pages. See `PLAN.md` for the full build plan and decisions, and
`CONTENT-TODO.md` for what still needs to come from Emree.

## Develop

```sh
npm install
npm run dev        # http://localhost:4321
npm run build      # static output in dist/
npm run preview    # serve dist/ locally
npx astro check    # type-check .astro files
```

## Where things live

- **Copy**: `src/content/pages/*.md` and `src/content/services/*.md`. Edit the markdown; the pages pick it up.
  Business facts (email, phone, crisis line) are in `src/content/site.json`.
- **Verbatim source of truth**: `src/content/source-copy.md` (raw capture of her Google Site, typos included).
- **Her images**: `src/assets/original/` (logo, tree illustrations, state images, photo). Never redraw; trimmed/cropped layout copies live in `src/assets/`.
- **Design tokens**: `src/styles/global.css`, the `@theme` block. Colors, fonts, type scale, spacing, radii, shadows, motion. Change them there and the whole site follows.
- **Placeholders**: anything wrapped in `<Placeholder …/>` or `<PlaceholderImage …/>` is a visible `[TODO]` for missing content.
- **New images** (e.g. the headshot): drop into `public/images/`.
- **Open Graph image**: `public/og-default.png`, regenerate with `node scripts/make-og.mjs`.

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds and publishes to
GitHub Pages.

- **Before DNS**: the site is served at `https://lukewoodstech.github.io/facilitating-families-counseling/`.
- **After DNS** points `facilitatingfamiliescounseling.com` at GitHub Pages: set the
  repository Actions variable `CUSTOM_DOMAIN_ENABLED` to `true`. The next deploy builds
  for the root path and ships the `CNAME` file. Then enable "Enforce HTTPS" in
  Settings → Pages.

Suggested DNS: four `A` records on the apex to `185.199.108.153`, `185.199.109.153`,
`185.199.110.153`, `185.199.111.153`, and `CNAME www → lukewoodstech.github.io`.
