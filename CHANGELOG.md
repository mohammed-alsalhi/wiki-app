# Changelog

All notable changes to this project are documented here.

## [1.0.2] - 2026-02-25

- Fixed markdown-to-rich-text conversion eating paragraphs into headings
- Headings now always produce separate blocks (double newline after headings in markdown output)
- Rewrote basicMarkdownToHtml to parse line-by-line instead of splitting by double newlines
- Single newline after a heading no longer merges the following paragraph into the heading

## [1.0.1] - 2026-02-23

- Added delete button with confirmation dialog on article edit page
- Added editable slug field with live URL path preview
- API now validates slug uniqueness on update and returns error if taken

## [1.0.0] - 2026-02-23

- Added article import feature with CLI and UI
- Drag-and-drop multi-file import page at /import (admin only)
- CLI bulk import script with --draft, --category, --dry-run flags
- Supports Markdown (.md), Text (.txt), HTML (.html), JSON (.json)
- Markdown frontmatter support for title extraction
- JSON supports single objects or arrays for multi-article import
- Added `marked` dependency for Markdown-to-HTML conversion
- Added `npm run import` convenience script

## [0.9.0] - 2026-02-23

- Added version label at bottom of sidebar, reading from package.json at build time
- Exposed `NEXT_PUBLIC_APP_VERSION` via next.config.ts

## [0.8.0] - 2026-02-23

- Added custom display text for wiki links (`[[Title|Display Text]]` syntax)
- Added InputRules for auto-converting `[[Title]]` and `[[Title|Label]]` while typing
- Fixed wiki link round-trip between rich text and markdown modes
- Fixed Link extension conflict by excluding `a[data-wiki-link]` from parseHTML
- Added text selection support for wiki link toolbar button and keyboard shortcut
- Changed wiki link keyboard shortcut to Ctrl+Shift+L

## [0.7.2] - 2026-02-23

- Fixed wiki link typing: `[[Article Name]]` now auto-creates wiki link nodes via InputRule
- Fixed markdown mode: wiki links preserved when switching between rich text and markdown

## [0.7.1] - 2026-02-23

- Added Vercel Web Analytics integration

## [0.7.0] - 2026-02-23

- Replaced map pin markers with clickable polygon areas
- Areas are invisible overlays; tooltip appears on hover, click navigates to linked article
- Edit mode: draw polygon vertices on map, finish with double-click or button
- Existing areas shown with dashed outlines in edit mode with delete option
- Removed emoji icon system (map image provides visual symbols)

## [0.6.3] - 2026-02-23

- Updated favicon

## [0.6.2] - 2026-02-23

- Updated world map image

## [0.6.1] - 2026-02-23

- Added MIT License
- Added README with deploy instructions
- Added CLAUDE.md with architecture documentation

## [0.6.0] - 2026-02-23

- Productized wiki with environment variable configuration
- All branding driven by `NEXT_PUBLIC_*` env vars with sensible defaults
- Made article templates generic (Person, Place, Event, Thing, Group)
- Made seed categories generic (People, Places, Organizations, Events, Things, Concepts)
- Added empty-state onboarding page for fresh deployments
- Map feature hidden by default, enabled via `NEXT_PUBLIC_MAP_ENABLED`
- Created .env.example documenting all environment variables

## [0.5.0] - 2026-02-23

- Added sub-category management with parent assignment
- Category tree display with indented subcategories
- Admin-only category creation with parent selector

## [0.4.0] - 2026-02-23

- Improved search with relevance-based ranking (exact title > starts with > contains > content-only)
- Multi-word queries use AND logic (each word must appear somewhere)
- Trimmed whitespace from search queries
- Clear search input on navigation and result clicks

## [0.3.2] - 2026-02-23

- Fixed dark mode: changed `@theme inline` to `@theme` so CSS variable overrides work

## [0.3.1] - 2026-02-23

- Fixed dark mode by replacing ~13 hardcoded `bg-white` instances with `bg-surface`
- Replaced hardcoded colors in SearchBar and admin page with theme variables

## [0.3.0] - 2026-02-23

- Added article revision history with content snapshots and diff viewer
- Added nested sub-categories with collapsible sidebar tree
- Added dark mode with CSS variable theming and localStorage persistence
- Added Recent Changes page with timeline grouped by date
- Added disambiguation pages with similar title detection
- Added 6 article templates (Character, Location, Event, Item, Faction, Blank)
- Added Export to PDF (browser print) and Export to Markdown (file download)

## [0.2.0] - 2026-02-23

- Added cookie-based admin authentication with `ADMIN_SECRET` env var
- Protected all write API routes with admin check
- Created login/logout/check API endpoints and /admin page
- Hidden edit UI for non-admin users
- No auth required in local dev when `ADMIN_SECRET` is unset

## [0.1.1] - 2026-02-23

- Switched image uploads from local filesystem to @vercel/blob cloud storage
- Added postinstall script for Prisma generate during Vercel build
- Updated build script to run prisma db push before next build

## [0.1.0] - 2026-02-23

- Initial release
- Next.js 16 App Router with React 19, TypeScript, Prisma 7, PostgreSQL
- Tiptap rich text editor with wiki link support (`[[Article Name]]`)
- Article CRUD with slug-based routing
- Category system for organizing articles
- Full-text search
- Interactive world map with Leaflet (CRS.Simple pixel coordinates)
- Map markers linked to articles
