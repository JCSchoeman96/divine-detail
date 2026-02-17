# AGENTS.md

## Project Overview
- Framework: SvelteKit 2
- Adapter: `@sveltejs/adapter-cloudflare`
- Package manager and runner: `bun` (do not use `npm` commands)

## Local Commands
- Install deps: `bun install`
- Dev server: `bun run dev`
- Production build: `bun run build`
- Preview build: `bun run preview`

## Routing and Content
- Main routes:
  - `/` in `src/routes/+page.svelte`
  - `/services` in `src/routes/services/+page.svelte`
  - `/contact` in `src/routes/contact/+page.svelte`
  - Service detail pages in `src/routes/services/[slug]/+page.svelte`

## SEO Requirements
- Keep per-page `<title>` and `meta description` in each route head.
- Keep social tags (Open Graph + Twitter) on key pages.
- Keep canonical URL handling in `src/routes/+layout.svelte`.
- Keep structured data:
  - Site-wide `LocalBusiness` schema in layout
  - Service/FAQ/Breadcrumb schema on service detail pages
- Keep sitemap and robots in sync:
  - `src/routes/sitemap.xml/+server.ts`
  - `static/robots.txt`

## Before Finishing Changes
- Run `bun run build` and fix any errors.
