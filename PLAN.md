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
| `/about` | NEW | `src/content/pages/about.md` (placeholders only) |
| `/services` | /scope-of-practice | `src/content/pages/services.md` + services collection |
| `/services/eating-disorders` | /scope-of-practice/eating-disorders | `src/content/services/eating-disorders.md` |
| `/services/couples-and-family` | /scope-of-practice/couples-and-family | `src/content/services/couples-and-family.md` |
| `/services/individual-support` | /scope-of-practice/individual-support | `src/content/services/individual-support.md` |
| `/services/trauma` | /scope-of-practice/trauma | `src/content/services/trauma.md` |
| `/licenses-payments` | /licenses-payments | `src/content/pages/licenses-payments.md` |
| `/contact` | (Connect With Me block) | `src/content/pages/contact.md` |
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
│   ├── favicon.svg, og-default.png, robots.txt
│   └── images/placeholders/*.svg  # sized placeholders with alt text
├── scripts/make-og.mjs            # regenerates og-default.png with sharp
└── src/
    ├── content.config.ts          # collections: services, pages
    ├── content/
    │   ├── source-copy.md         # VERBATIM primary source (raw, uncorrected)
    │   ├── older-version-copy.md  # VERBATIM secondary source
    │   ├── site.json              # name, email, phone, crisis line
    │   ├── pages/*.md             # home, about, services, licenses-payments, contact
    │   └── services/*.md          # one file per service area
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
| `Header` | logo lockup, desktop nav with active state, accessible mobile menu, skip link |
| `Footer` | contact info, site links, 988 crisis line, legal name |
| `Button` | primary / secondary / accent / ghost link buttons |
| `Section` | vertical rhythm + surface tone (cream / linen / sand / teal), optional linen texture |
| `SectionHeading` | eyebrow + heading |
| `PageHero` | inner-page header (eyebrow, h1, intro slot) |
| `ServiceCard`, `ServiceGrid` | the four service cards, driven by the services collection |
| `ContactCTA` | email + phone band used on most pages |
| `Placeholder` | visible `[TODO: ...]` marker for content Emree still owes |
| `PlaceholderImage` | correctly sized placeholder `<img>` with alt text + TODO caption |

## 4. Design tokens (`src/styles/global.css`)

Every value lives in one `@theme` block. Tailwind v4 turns each one into a utility
*and* a CSS variable, so `bg-teal` and `var(--color-teal)` are the same token.

**Palette** (all text pairings checked at WCAG AA, most well above 4.5:1)

| Token | Hex | Use |
| --- | --- | --- |
| cream | `#f8f4ed` | page background |
| linen | `#f1eae0` | alternate sections, cards |
| sand / sand-deep | `#e6dacb` / `#cdbba3` | fills, borders |
| ink / ink-soft | `#2a2724` / `#5e5750` | body / secondary text |
| teal / teal-deep / teal-soft | `#1e4d48` / `#153a36` / `#d9e5e1` | headings, buttons, Core Belief block |
| terracotta / terracotta-soft | `#a04e31` / `#f1dfd4` | eyebrows, links, highlights |

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

Primary source wins everywhere. Verbatim captures: `src/content/source-copy.md`
(primary) and `src/content/older-version-copy.md` (secondary).

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
| 9 | Home, card blurb | `Conscious transformations` + line break + `identifying…` | joined into one sentence on the card |

**Left as written (not obvious enough to touch, flagged for Emree):**
`patients who;` (semicolon), `ie choking allergies, or medical issues` (likely
"i.e. choking, allergies, or medical issues"), `You have Strengths.` (capital S),
`Regents, Blue Cross Blue Shield` (likely "Regence"), `Select Health` (brand spells it
"SelectHealth"), `Eating Disorder` / `Couple & Family` card titles (singular on the old
site; the cards now use the page names "Eating Disorders" / "Couples & Family" — the
blurbs are untouched).

### Where the older version was used

Only once: the correct spellings **Minnesota** and **Wisconsin** (fixes 4 and 5
above). Nothing else from the older version is on the site. Note the older version
has a completely different, softer Core Belief paragraph. Per the rules the primary
wins, but it is worth asking Emree which one she wants.

### Emree's sentences reused as display text (all verbatim)

- Hero headline: "I believe in change." Subhead: "Our choice is not if we change but how we change." (Core Belief)
- Trauma card blurb (the old site had only dots): "Trauma does not have to keep playing out in your brain or in your life or in your relationships." (Trauma page)
- Home About teaser quote and About page "Approach" quote: from Individual Support
- Services overview intro: "My hope is that together we can identify ineffective interactions and the patterns that keep them alive." (Core Belief)
- Contact page intro: "Together, we validate those patterns and identify the best way to invite change." (Individual Support)
- Service page sidebar: "We are working together to bring about the change you deserve." (Individual Support)

### Text that is NOT Emree's (utility copy I wrote; swap freely)

Nav labels, button labels ("Connect with me", "Explore services", "Learn more"),
section headings "How I can help", "Hello, I'm Emree.", "Training & licensure",
"How I work", "Ready when you are", "More ways I can help", the About page's
"Licensed therapist" line, the footer's states line, the 988 crisis line, the 404
page, and all meta descriptions.

### Thin or empty pages (not filled)

- **Trauma**: one paragraph. Left as is, with a TODO asking if she wants to say more.
- **Scope of Practice → Trauma blurb**: was literally "....................." on the old site.
- **About**: no copy exists. Layout built with placeholders only.
- **Contact**: nothing beyond email/phone exists. Placeholders for hours, location, response time.
- **Licenses & Payments**: no fees, policies, or license numbers exist. Placeholders added.

## 6. Placeholders to collect from Emree

Every `[TODO]` on the site, grouped by page. Also listed in `CONTENT-TODO.md`.

**About Me**
1. Full name as she wants it displayed
2. Credentials / license type(s) (e.g. LMFT), and whether to show license numbers
3. Headshot (portrait, 4:5 or square, ≥1200px short side)
4. Bio
5. Approach: how she works, what a first session is like, modalities
6. Education, memberships, certifications (e.g. Lifespan Integration training)

**Home**
7. Last name next to "Emree" in the About teaser
8. A 2–3 sentence About teaser (can be cut from the bio)

**Licenses & Payments**
9. Private pay session fee, sliding scale yes/no
10. How to pay and when (card on file, portal, invoice)
11. Cancellation / no-show policy
12. License numbers per state (optional)
13. In person, telehealth, or both; office address if in person
14. Confirm "Regents" → Regence? and exact insurer spellings

**Contact**
15. Office hours / availability
16. Typical response time
17. Location (telehealth only or address)

**Services**
18. Trauma: anything more she wants to say
19. One real image for each service page (landscape, ~3:2): Eating Disorders, Couples & Family, Individual Support, Trauma

**Images summary**: headshot (About + home teaser), 4 service page images. The home
hero intentionally has no photo (abstract warm treatment). A real Open Graph image can
replace the generated `public/og-default.png` later.

## 7. Deployment

- Push to `main` → `.github/workflows/deploy.yml` builds and deploys to GitHub Pages.
- Until DNS is set up, the site builds for `https://lukewoodstech.github.io/facilitating-families-counseling/` (Astro `base` is set from `DEPLOY_TARGET=github`).
- When DNS for facilitatingfamiliescounseling.com points at GitHub Pages: set the repo
  Actions **variable** `CUSTOM_DOMAIN_ENABLED=true`. The workflow then builds for the
  root path and copies `CNAME` into `dist/`. GitHub Pages picks up the domain from it.
- DNS to set at the registrar: `A` records for the apex → 185.199.108.153,
  185.199.109.153, 185.199.110.153, 185.199.111.153, and `CNAME www` →
  `lukewoodstech.github.io`. Then tick "Enforce HTTPS" in repo Settings → Pages.

## 8. Things I'm unsure about / decisions to confirm

1. **Which Core Belief?** Primary (used) vs the older version's rewritten paragraph.
2. **"Regents"** insurer: Regence BlueCross BlueShield? Also whether "Blue Cross Blue Shield" is a separate line.
3. **Card titles**: cards use the page names (plural "Eating Disorders", "Couples & Family"). The old home page used "Eating Disorder" and "Couple & Family". Easy to revert.
4. **Orthoxia → Orthorexia**: confident, but it is a heading on her page.
5. **Repo visibility**: created **public** because GitHub Pages on a free personal account requires a public repo. All content is already public on the Google Site. Flip to private if the account gets upgraded.
6. The old site's mailto link pointed at a misspelled domain (`…counciling.com`). The new site uses `emree@facilitatingfamiliescounseling.com` as specified.
7. Footer tagline "Therapy is not a substitute for emergency care." is mine; remove if she dislikes it.
