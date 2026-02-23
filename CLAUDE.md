# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (Next.js 16 + Turbopack)
npm run build        # prisma db push && next build
npm run lint         # ESLint
npx prisma generate  # Regenerate Prisma client after schema changes
npx prisma db push   # Push schema changes to database
node prisma/seed.mjs # Seed default categories
```

After changing `prisma/schema.prisma`, always run `npx prisma generate` and delete `.next/` to avoid stale client errors.

## Architecture

**Stack:** Next.js 16 (App Router) + React 19 + TypeScript + Prisma 7 + PostgreSQL (Neon) + Tailwind CSS 4 + Tiptap editor

**Two remotes:** `origin` (private personal wiki) and `public` (public product repo). The public repo has clean history without personal data.

### Key Patterns

**Configuration:** All branding is driven by `NEXT_PUBLIC_*` env vars read through `src/lib/config.ts`. Defaults produce a generic wiki; personal branding is set via Vercel env vars.

**Auth:** Single admin password via `ADMIN_SECRET` env var. Cookie-based (`admin_token`). If `ADMIN_SECRET` is empty, all users are admin (local dev). Check with `isAdmin()` from `src/lib/auth.ts`. API routes use `requireAdmin(await isAdmin())` guard pattern.

**Prisma:** Uses `@prisma/adapter-pg` with raw `pg` pool (required for Neon). Singleton in `src/lib/prisma.ts` with `globalThis` caching for dev hot-reload.

**Wiki Links:** Articles cross-reference via `[[Article Name]]` syntax. Custom Tiptap extension (`src/components/editor/WikiLinkExtension.ts`) renders them as `data-wiki-link` anchors. At display time, `resolveWikiLinks()` in `src/lib/wikilinks.ts` checks the DB and marks broken links with CSS class. `getBacklinks()` finds reverse references.

**Revisions:** Every article PUT auto-snapshots the current state into `ArticleRevision` before applying changes. History page shows timeline; diff page compares two revisions.

**Content Storage:** Articles store `content` (HTML from Tiptap) and `contentRaw` (optional Markdown). The HTML is what gets displayed; Markdown is for export.

**Theming:** CSS variables defined in `src/app/globals.css` under `@theme` block. Dark mode via `html[data-theme="dark"]` overrides. Important: use `@theme` not `@theme inline` — the latter inlines hex values into Tailwind utilities, breaking CSS variable overrides.

**Map:** Disabled by default (`NEXT_PUBLIC_MAP_ENABLED`). Uses Leaflet with `CRS.Simple` (pixel coords, not geographic). Dynamically imported (no SSR). Markers stored in `MapMarker` table and optionally linked to articles.

### Data Flow for Articles

1. Create/edit via Tiptap editor → HTML + optional Markdown
2. POST/PUT to `/api/articles/[id]` → Prisma creates/updates + auto-revision
3. Display: server component fetches article → `resolveWikiLinks(content)` → render HTML
4. Backlinks computed via `getBacklinks(slug)` querying other articles' content

### Search

`/api/search` and `/app/search/page.tsx` both implement relevance-ranked search. Multi-word queries use AND logic (every word must appear in title/content/excerpt). Results sorted by: exact title match (100) > starts with (80) > title contains (60) > content only (0).

## Database Models

- **Article** — main content with slug, HTML content, category, tags, revisions
- **Category** — hierarchical (self-referential `parentId`), ordered by `sortOrder`
- **Tag** — flat labels, many-to-many with articles via `ArticleTag`
- **ArticleRevision** — immutable snapshots created on every edit
- **MapMarker** — coordinates + optional article link, grouped by `mapId`
