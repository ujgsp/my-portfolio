# AGENTS.md

## Project Overview

Astro 6.x personal blog (Indonesian) deployed to GitHub Pages. SSG with Tailwind CSS v4, content collections in Markdown, and Cloudflare Turnstile for bot protection.

## Quick Commands

```bash
# Dev server (port 4321)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

**Package manager:** npm with `legacy-peer-deps=true` (in `.npmrc`). Do NOT use pnpm or yarn.

**Node version:** `>=22.12.0` (enforced in `package.json` engines).

## Environment Variables

Required in `.env` for local dev (copy from `.env.example`):

```
PUBLIC_CLOUDINARY_CLOUD_NAME=dellp9a4z
PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
PUBLIC_GAS_WEBAPP_URL=https://script.google.com/macros/s/.../exec
```

GitHub Actions sets these in `.github/workflows/deploy.yml` env block for CI builds.

## Content Collections

All content lives in `src/content/`. Schema defined in `src/content.config.ts` (Zod).

| Collection | Directory | Key Fields |
|---|---|---|
| `blog` | `src/content/blog/` | title, description, pubDate, license (required ref), tags, image |
| `projects` | `src/content/projects/` | Same as blog + repoUrl, demoUrl, status |
| `services` | `src/content/services/` | title, description, pubDate, image, icon, isLandingPage, whatsappNumber, ctaText, price |
| `legal` | `src/content/legal/` | title, description, lastUpdated |
| `about` | `src/content/about/` | title, description |

**Frontmatter gotchas:**
- `license` field references a JSON file in `src/content/licenses/` (e.g., `license: cc-by-nc-sa-4.0`). Services collection makes it optional.
- `featured` accepts `"none"`, `"1"`, `"2"`, `"3"` — transforms to `undefined` or integer.
- `draft: true` hides content from collections.
- `ogImage` is optional/nullable; omit or use `{ src, alt }` format.
- `image.src` can be absolute URL (Unsplash) or local path (`/images/...`).

## Architecture

**Routing:** File-based in `src/pages/`. Dynamic routes use `[id].astro` pattern (e.g., `src/pages/services/[id].astro`).

**Layouts** (`src/layouts/`):
- `BaseLayout.astro` — standard page layout
- `PostLayout.astro` — blog posts with ToC, navigation
- `ListLayout.astro` — collection listing pages
- `LandingLayout.astro` — services landing pages
- `ErrorLayout.astro` — 404/500 pages

**Content config:** `src/site.config.ts` holds site metadata, header/footer navigation, social links.

**Utility functions:** `src/utils/` — `styles.ts` (cn helper using clsx + tailwind-merge), `meta.ts` (attachMeta for reading time/plain text), `cloudinary.ts`, `toc.ts`, `readingTime.ts`.

## Styling

- Tailwind CSS v4 via `@tailwindcss/vite` plugin
- Typography via `@tailwindcss/typography` plugin
- Dark mode: class-based variant (`@custom-variant dark`)
- Global styles: `src/styles/global.css`
- Inline Tailwind classes on components (no CSS modules)

## Key Integrations

- **Cloudinary** (`astro-cloudinary`): Image optimization. Cloud name: `dellp9a4z`
- **Cloudflare Turnstile**: Bot protection on forms. Site key in env.
- **Google Apps Script**: Lead funnel form (`LeadFunnelForm.astro`) submits to GAS Web App URL
- **Pagefind** (`astro-pagefind`): Client-side search
- **Expressive Code** (`astro-expressive-code`): Code block syntax highlighting with line numbers, aurora-x theme
- **astro-icon**: Icons from Lucide and FA6 Brands sets

## CSP (Content Security Policy)

Configured in `astro.config.mjs` under `security.csp`. Allowed external domains:
- `connect-src`: cloudflare.com, images.unsplash.com, script.google.com
- `img-src`: res.cloudinary.com/dellp9a4z/, images.unsplash.com
- `frame-src`: cloudflare.com (Turnstile)

When adding new external resources, update CSP directives accordingly.

## Deployment

GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`):
- Triggers on push to `master` branch
- Uses `withastro/action@v3` for build
- Node 22, npm package manager
- Env vars hardcoded in workflow (public values, not secrets)

## Content Editing

- **New blog post:** Create `.md` in `src/content/blog/`
- **New project:** Create `.md` in `src/content/projects/`
- **New service:** Create `.md` in `src/content/services/`
- **Edit FAQ:** Modify the data array in `src/pages/faq.astro`
- **Edit site metadata/socials:** Edit `src/site.config.ts`

## TypeScript

Strict mode (`extends: astro/tsconfigs/strict`). Auto-generated types in `.astro/types.d.ts`. Component types use `CollectionEntry<"collection-name">` from `astro:content`.
