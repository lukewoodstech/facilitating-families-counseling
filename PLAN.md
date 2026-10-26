# Facilitating Families Counseling — build plan

Rebuild of Emree's Google Site as a custom Astro + Tailwind static site, deployed to
GitHub Pages, eventually at **facilitatingfamiliescounseling.com**.

Three goals: (1) keep Emree's exact words, (2) add an About Me page, (3) make it look
far better. Everything below was built as described; the "Decisions to confirm" and
"Placeholders" sections are what still needs a human.

---

## 1. Routes

| Route | Old Google Site page | Content source |
| --- | --- | --- |
| `/` | /home | `src/content/pages/home.md` + service summaries |
| `/about` | NEW ("About Me": her photo + short about on top, Connect With Me below) | `src/content/pages/about.md` + `contact.md` (placeholders only) |
| `/services` | /scope-of-practice (heading kept: "Scope of Practice") | `src/content/pages/services.md` + services collection |
| `/services/eating-disorders` | /scope-of-practice/eating-disorders | `src/content/services/eating-disorders.md` |
| `/services/couples-and-family` | /scope-of-practice/couples-and-family | `src/content/services/couples-and-family.md` |
| `/services/individual-support` | /scope-of-practice/individual-support | `src/content/services/individual-support.md` |
| `/services/trauma` | /scope-of-practice/trauma | `src/content/services/trauma.md` |
| `/licenses-payments` | /licenses-payments | `src/content/pages/licenses-payments.md` |
| `/contact` | (Connect With Me block) | redirects to `/about#connect` |
| `/404` | — | `src/pages/404.astro` |

Redirect map for later (old → new): `/scope-of-practice` → `/services`,
`/scope-of-practice/*` → `/services/*`, `/home` → `/`.

## 2. File / folder structure

```
facilitating-families-counseling/
├── .github/workflows/deploy.yml   # build + deploy to GitHub Pages on push to main
├── CNAME                          # custom domain; only copied into dist when enabled
├── astro.config.mjs               # site/base switch (github sub-path vs custom domain)
├── public/
│   ├── favicon.svg, og-default.png (wordmark on cream), robots.txt
│   └── images/placeholders/about-headshot.svg
├── scripts/make-og.mjs            # regenerates og-default.png with sharp
└── src/
    ├── content.config.ts          # collections: services, pages
    ├── content/
    │   ├── source-copy.md         # VERBATIM primary source (raw, uncorrected)
        │   ├── site.json              # name, email, phone, crisis line
    │   ├── pages/*.md             # home, about, services, licenses-payments, contact
    │   └── services/*.md          # one file per service area
    ├── assets/original/           # Emree's logo, tree illustrations, state images, photo (untouched)
    ├── assets/*.png               # trimmed / cropped copies of the logo for layout (pixels untouched)
    ├── styles/global.css          # ALL design tokens (@theme) + base + prose + motion
    ├── lib/url.ts                 # base-path-aware href helper
    ├── layouts/BaseLayout.astro
    ├── components/                # see below
    └── pages/                     # routes
```

## 3. Components

| Component | Purpose |
| --- | --- |
| `BaseLayout` | html shell, Head, Header, Footer, scroll-reveal script |
| `Head` | per-page title/description, canonical, Open Graph, Twitter, favicon, sitemap link |
| `Header` | sticky; wordmark, desktop nav with active state, accessible mobile menu, skip link |
| `Footer` | contact info, site links, 988 crisis line, legal name |
| `Button` | primary / secondary / accent / ghost link buttons |
| `Section` | vertical rhythm + surface tone (cream / linen / sand / teal), optional linen texture |
| `PageHero` | inner-page header: her h1 with the faint logo tree |
| `Divider` | organic wave section divider (as on her business card) |
| `LeafAccent` | the logo tree as a faint watermark |
| `ServiceCard`, `ServiceGrid` | the four service cards with her original tree illustrations |
| `StateCard` | state outline (Census boundary) with her logo tree overlaid, uniform per state |
| `ContactCTA` | "Connect With Me": Email + Phone over her hand-and-seedling photo |
| `Placeholder` | visible `[TODO: ...]` marker for content Emree still owes |
| `PlaceholderImage` | correctly sized placeholder `<img>` with alt text + TODO caption |

## 4. Design tokens (`src/styles/global.css`)

Every value lives in one `@theme` block. Tailwind v4 turns each one into a utility
*and* a CSS variable, so `bg-teal` and `var(--color-teal)` are the same token.

**Palette**, sampled from her logo (teal `#426b69`, leaf green `#8db277`). All text
pairings pass WCAG AA.

| Token | Hex | Use |
| --- | --- | --- |
| cream | `#faf7f1` | page background |
| linen | `#f3eee5` | alternate sections |
| sand / sand-deep | `#e9e2d5` / `#d3c9b6` | borders, rules |
| ink / ink-soft | `#27302f` / `#5b6664` | body / secondary text |
| teal / teal-deep / teal-soft | `#426b69` / `#2e4f4d` / `#dde8e5` | logo teal: buttons, Core Belief block, headings (deep) |
| leaf / leaf-deep / leaf-soft | `#8db277` / `#48713a` / `#e6eedd` | logo green: decorative / small text / tinted bands |

**Type**: Fraunces Variable (editorial serif, headings, pull quotes, italics with the
"soft/wonky" axes turned up) + Instrument Sans Variable (body). Self-hosted via
@fontsource, no Google Fonts request. Fluid sizes: `display`, `h1`–`h3`, `quote`,
`lead`, `body`, `eyebrow`.

**Spacing**: `section`, `section-sm`, `gutter` (all fluid clamps). **Radii**: `card`,
`image`, `pill`, `button`. **Shadows**: `card`, `card-hover`. **Motion**: `ease-calm`,
`duration-reveal`.

**Motion**: single IntersectionObserver reveal on `[data-reveal]`, disabled under
`prefers-reduced-motion`, and content is fully visible with JS off.

## 5. Copy handling

Source of truth: **only** `https://sites.google.com/view/facilitatingfamiliescounseling/`
(every nav link followed, including the Scope of Practice sub-pages). The older
`sites.google.com/facilitatingfamiliescounseling.com/ffc` version is ignored entirely.
Verbatim capture: `src/content/source-copy.md` (raw, typos preserved).

### Typo fixes applied (please confirm)

| # | Page | Original | Fixed to |
| --- | --- | --- | --- |
| 1 | Home, Core Belief | `available to all .` | `available to all.` |
| 2 | Home, Core Belief | `constant basis .` | `constant basis.` |
| 3 | Home, Core Belief | `how we change .` | `how we change.` |
| 4 | Licenses & Payments | `Minnesta` | `Minnesota` |
| 5 | Licenses & Payments | `Wisconson` | `Wisconsin` |
| 6 | Eating Disorders heading | `Orthoxia` | `Orthorexia` |
| 7 | Eating Disorders heading | `Disorder(ARFID)` | `Disorder (ARFID)` |
| 8 | Eating Disorders | `teanagers` | `teenagers` |
| 9 | Home card | `Conscious transformations` + line break + `identifying…` | joined into one sentence |
| 10 | Licenses & Payments | `Regents, Blue Cross Blue Shield` | `Regence, Blue Cross Blue Shield` (confirmed by Luke) |

Left exactly as written (flagged, not obvious enough to touch): `patients who;`,
`ie choking allergies, or medical issues`, `You have Strengths.`,
`Select Health`.

### Her words used as display text (verbatim)
- Hero headline: "I believe in change." (first sentence of Core Belief)
- Everything else on the site is her page copy under her own headings.

### Text that is NOT Emree's (review list)
1. **Nav labels**: "Home", "About Me", "Scope of Practice", "Licenses & Payments" ("About Me" is the new page name; the rest match her nav)
2. **Mobile menu button**: "Menu" / "Close". **Skip link**: "Skip to content"
3. **Hero buttons**: "Connect With Me", "Scope of Practice" (her headings reused as labels)
4. **Telehealth sentence** (requested): "All sessions are held virtually by telehealth." On Licenses & Payments and Connect With Me. **Privacy sentence** (requested): "All text messages and emails are securely encrypted." On Connect With Me.
5. **About Me page**: heading "About Me", "EmRee M. Pugmire, LMFT" and "Licensed Marriage and Family Therapist" (supplied by Luke), + the `[TODO]` placeholders
6. **Service pages**: "Scope of Practice" heading over the links to the other three services (her heading, my placement)
7. **Footer**: crisis line "If you are in crisis or thinking about suicide, call or text 988 (Suicide & Crisis Lifeline), available 24/7. If you are in immediate danger, call 911."; "© 2026 Facilitating Families Counseling, LLC"; "Connect With Me" / "Email:" / "Phone:" (hers)
8. **404 page**: "Page not found", buttons "Home", "Connect With Me"
9. **`[TODO: …]` placeholder texts** (all pages)
10. **Image alt text** for every image
11. **Browser titles and meta descriptions** for every page (`src/content/pages/*.md`, `src/content/services/*.md`, `src/content/site.json`)
12. **Card small-caps labels** "Email:" / "Phone:" styling is mine; the words are hers

### Thin or empty pages (not filled)
- **Trauma**: one paragraph. A `[TODO]` asks if she wants to say more.
- **Trauma card blurb**: her site shows dots. `[TODO]` on the card.
- **About Me**: name and credentials are in; headshot and short bio are placeholders. The values on her card (Intentionality · Curiosity · Sustainability) are not used.
- **Connect With Me**: email and phone only, as on her site, plus the telehealth and encryption lines.
- **Licenses & Payments**: one optional placeholder for license numbers. No fee or policy placeholders (Luke: not needed).

## 6. Images (all from her site, in `src/assets/original/`)
- `logo-wordmark.png` (header, hero, OG image), `logo-mark.png` (the main logo tree: hero, faint watermark, footer)
- `tree-eating-disorder.png`, `tree-couple-and-family.png`, `tree-individual-support.png`, `tree-trauma.png` (service cards and service pages only)
- `state-*.png` (downloaded, no longer used: they were cropped unevenly and Utah's tree was clipped). The state cards are now built from clean US Census outlines (`scripts/make-states.mjs` → `src/data/states.json`) with her logo tree laid over each one at the same size
- `photo-hand-seedling.jpg` (soft background behind Connect With Me, as on her site)
- `home-card-*.png`, `bg-teal-blur.jpg` (downloaded, unused)
- Derived for layout only: `src/assets/logo-wordmark-trimmed.png` (transparent margins trimmed), `src/assets/logo-wordmark-nav.png` (same file with the script's teal shifted to the site's deep teal and the tagline's green to a deeper green for legibility in the nav; letterforms untouched) and `src/assets/logo-mark-transparent.png` (her mark with its white background removed by un-blending the edge pixels; no shapes redrawn).
- Still needed: headshot for About Me.

## 7. Telehealth
No office, address, hours, map, or in-person wording anywhere, including meta
descriptions. Contact and footer carry email and phone exactly as on her site.

## 8. Deployment
- Push to `main` → `.github/workflows/deploy.yml` builds (Node 24) and deploys to GitHub Pages.
- Until DNS is set up the site builds for `https://lukewoodstech.github.io/facilitating-families-counseling/`.
- Domain DNS lives at Squarespace Domains (Google Domains successor; nameservers are still
  `ns-cloud-*.googledomains.com`). Today the apex has no `A` record at all and `www` is a
  CNAME to Google Sites (`ghs.googlehosted.com`). Mail is Google Workspace (`MX` + SPF `TXT`),
  must not be touched.
- Records to set: four `A` on the apex → 185.199.108.153, 185.199.109.153, 185.199.110.153,
  185.199.111.153; `CNAME www` → `lukewoodstech.github.io`. Optional: verify the domain at
  github.com/settings/pages (adds a `_github-pages-challenge-lukewoodstech` TXT record).
- Then run `scripts/go-live.sh` (idempotent): checks DNS, sets the Pages custom domain, sets
  the Actions variable `CUSTOM_DOMAIN_ENABLED=true`, deploys, waits for the cert, enforces HTTPS.
  `--check` only reports. Afterwards unpublish the Google Site so there is one site.

## 9. Open questions
1. Card headings use her home-page wording ("Eating Disorder", "Couple & Family"); page headings use her page titles ("Eating Disorders", "Couples and Family"). Intentional, matches her site.
2. Repo is **public** because GitHub Pages on a free personal account requires it.
3. The old site's mailto pointed at a misspelled domain (`…counciling.com`); the new site uses `emree@facilitatingfamiliescounseling.com`.
