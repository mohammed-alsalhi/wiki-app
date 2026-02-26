# Changelog

All notable changes to this project are documented here.

## [1.7.0](https://github.com/mohammed-alsalhi/wiki-app/commit/eb6f0a8) - 2026-02-25

- Added category-specific infobox fields: each root category (People, Places, Organizations, Events, Things, Concepts) has its own field schema
- Infobox fields include text, textarea, number, wikilink, and list types with placeholders
- Subcategories inherit their parent's infobox schema via parent chain walk
- InfoboxEditor component shows relevant fields when a category is selected on new/edit pages
- InfoboxDisplay component renders filled fields above standard rows (Category, Tags, Created, Updated)
- Wikilink fields render as clickable article links; list fields display as comma-separated items
- Added `infobox` JSON field to Article and ArticleRevision models in Prisma schema
- API routes (POST/PUT) now accept and store infobox data; revisions snapshot infobox state
- CategorySelect now accepts optional external `categories` prop to avoid duplicate fetches
- Added 24 subcategories across all 6 root categories in seed file (Leaders, Cities, Guilds, Battles, Weapons, Magic, etc.)
- Fixed "Detect Links" potential link marks persisting in saved content and showing to viewers
- Existing articles without infobox data continue to display correctly (backward compatible)

## [1.6.0](https://github.com/mohammed-alsalhi/wiki-app/commit/3890f0f) - 2026-02-25

- Redesigned home page with improved layout and visual hierarchy
- Added stat badges showing article/category/tag counts with links
- Added styled action buttons (Create, Browse, Search, Map)
- Added "Featured article" section highlighting the longest published article with excerpt
- Recent changes list now shows excerpts, category badges, and better spacing
- Replaced plain Statistics table and Getting started notice with "Explore" quick-links grid
- Added "View all" links in portal headers for Recent changes and Categories
- Home page now only counts published articles in stats
- Added CSS for `.home-stat-badge` and `.home-action-btn` components

## [1.5.0](https://github.com/mohammed-alsalhi/wiki-app/commit/33312e4) - 2026-02-25

- Added full map area editing: select existing areas, edit label/article/color, and save changes
- Added draggable polygon vertex handles for reshaping areas in real-time
- Added color picker with 8 preset colors and custom color input for map areas
- New area form also supports color selection
- Hover tint on map areas in view mode uses stored area color
- Click-to-select areas in edit mode replaces popups with a side panel form
- Click empty map space to deselect current area
- Fixed link editing bubble: now appears on hover instead of requiring a click
- Added NodeSelection detection for wiki link atoms in the editor
- Prevented accidental navigation when clicking links inside the editor
- Dismiss timer with 200ms delay allows moving mouse from link to bubble
- Updated help page and help.md with map editing and link hover documentation

## [1.4.0](https://github.com/mohammed-alsalhi/wiki-app/commit/4308e71) - 2026-02-25

- Added link editing bubble: floating Edit/Remove tooltip appears when cursor is on a link
- Edit mode for regular links (change URL) and wiki links (change target article title)
- Remove option keeps text in place but strips the link
- Updated help page and help.md with documentation for tables, link editing, redirects, discussions, and batch operations
- Added Table button to editor toolbar documentation

## [1.3.0](https://github.com/mohammed-alsalhi/wiki-app/commit/ba616cd) - 2026-02-25

- Added batch operations on articles list page (admin only)
- Checkbox column for selecting articles, with select-all toggle
- Batch action bar with Set Category, Publish, Unpublish, and Delete actions
- Category dropdown appears when "Set Category" is selected
- Delete requires confirmation dialog before proceeding
- Converted articles page from server component to client component
- New `/api/articles/batch` endpoint for bulk PUT (category/publish) and DELETE
- Wrapped page in Suspense boundary for `useSearchParams` compatibility

## [1.2.0](https://github.com/mohammed-alsalhi/wiki-app/commit/f507fdf) - 2026-02-25

- Added table support in Tiptap editor using TableKit extension
- Toolbar shows Insert Table button, plus row/col add/delete when cursor is inside a table
- Added table CSS styles for both editor and article display (borders, header highlighting, selected cell)
- Added redirect pages: articles can redirect to another article via `redirectTo` field
- Redirect field in article edit page with slug input and preview
- Server-side redirect in article display page when `redirectTo` is set
- Added per-article discussion/talk pages with comment threads
- Discussion tab added to all article sub-pages (article, edit, history, diff)
- Anyone can post comments with optional author name; admin can delete comments
- New Discussion model in Prisma schema with article relation
- New API endpoint `/api/articles/[id]/discussions` (GET, POST, DELETE)

## [1.1.3](https://github.com/mohammed-alsalhi/wiki-app/commit/d6938e5) - 2026-02-25

- Fixed self-referencing commit link for 1.1.2 in CHANGELOG.md

## [1.1.2](https://github.com/mohammed-alsalhi/wiki-app/commit/a529355) - 2026-02-25

- Added commit links to every version heading in CHANGELOG.md
- Version headers now link to the corresponding commit on GitHub

## [1.1.1](https://github.com/mohammed-alsalhi/wiki-app/commit/d8de900) - 2026-02-25

- Added in-app Help page (`/help`) documenting all features, editor tricks, and keyboard shortcuts
- Added `help.md` for GitHub with the same content in markdown format
- Added "Help" link to sidebar navigation

## [1.1.0](https://github.com/mohammed-alsalhi/wiki-app/commit/5d47196) - 2026-02-25

- Added wiki link suggester: typing `[[` in the editor opens an autocomplete dropdown
- Dropdown searches existing articles with debounced queries, keyboard navigation, and click selection
- Added "Detect Links" toolbar button that scans text for phrases matching existing article titles
- Detected links shown with dashed underline; clicking converts them to wiki links
- Count badge on toolbar button shows number of detected potential links
- Created PotentialLink Tiptap mark extension for detected link highlighting
- Created `/api/articles/titles` lightweight endpoint for fetching all article titles
- Longer title matches take priority; word boundary checking prevents partial matches

## [1.0.4](https://github.com/mohammed-alsalhi/wiki-app/commit/2d62cd6) - 2026-02-25

- Widened content area max-width from 1024px to 1152px
- Redesigned theme toggle as clean sun/moon icon button in header
- Added global transition class so all elements change theme at the same rate
- Cleaned up search bar: replaced label/Go button with search icon and placeholder
- Removed rounded corners from search bar to match wiki style
- Aligned header right edge with content area padding

## [1.0.3](https://github.com/mohammed-alsalhi/wiki-app/commit/e557aa8) - 2026-02-25

- Fixed bold and italic lost when switching from markdown mode back to rich text
- Added `**bold**` → `<strong>` and `*italic*` → `<em>` conversion in basicMarkdownToHtml
- Inline formatting now applied to both paragraph and heading content

## [1.0.2](https://github.com/mohammed-alsalhi/wiki-app/commit/8d4753c) - 2026-02-25

- Fixed markdown-to-rich-text conversion eating paragraphs into headings
- Headings now always produce separate blocks (double newline after headings in markdown output)
- Rewrote basicMarkdownToHtml to parse line-by-line instead of splitting by double newlines
- Single newline after a heading no longer merges the following paragraph into the heading

## [1.0.1](https://github.com/mohammed-alsalhi/wiki-app/commit/e84d1d6) - 2026-02-23

- Added delete button with confirmation dialog on article edit page
- Added editable slug field with live URL path preview
- API now validates slug uniqueness on update and returns error if taken

## [1.0.0](https://github.com/mohammed-alsalhi/wiki-app/commit/bf95767) - 2026-02-23

- Added article import feature with CLI and UI
- Drag-and-drop multi-file import page at /import (admin only)
- CLI bulk import script with --draft, --category, --dry-run flags
- Supports Markdown (.md), Text (.txt), HTML (.html), JSON (.json)
- Markdown frontmatter support for title extraction
- JSON supports single objects or arrays for multi-article import
- Added `marked` dependency for Markdown-to-HTML conversion
- Added `npm run import` convenience script

## [0.9.0](https://github.com/mohammed-alsalhi/wiki-app/commit/8617d86) - 2026-02-23

- Added version label at bottom of sidebar, reading from package.json at build time
- Exposed `NEXT_PUBLIC_APP_VERSION` via next.config.ts

## [0.8.0](https://github.com/mohammed-alsalhi/wiki-app/commit/ac6de47) - 2026-02-23

- Added custom display text for wiki links (`[[Title|Display Text]]` syntax)
- Added InputRules for auto-converting `[[Title]]` and `[[Title|Label]]` while typing
- Fixed wiki link round-trip between rich text and markdown modes
- Fixed Link extension conflict by excluding `a[data-wiki-link]` from parseHTML
- Added text selection support for wiki link toolbar button and keyboard shortcut
- Changed wiki link keyboard shortcut to Ctrl+Shift+L

## [0.7.2](https://github.com/mohammed-alsalhi/wiki-app/commit/92faed0) - 2026-02-23

- Fixed wiki link typing: `[[Article Name]]` now auto-creates wiki link nodes via InputRule
- Fixed markdown mode: wiki links preserved when switching between rich text and markdown

## [0.7.1](https://github.com/mohammed-alsalhi/wiki-app/commit/ec5bc04) - 2026-02-23

- Added Vercel Web Analytics integration

## [0.7.0](https://github.com/mohammed-alsalhi/wiki-app/commit/f6d63ad) - 2026-02-23

- Replaced map pin markers with clickable polygon areas
- Areas are invisible overlays; tooltip appears on hover, click navigates to linked article
- Edit mode: draw polygon vertices on map, finish with double-click or button
- Existing areas shown with dashed outlines in edit mode with delete option
- Removed emoji icon system (map image provides visual symbols)

## [0.6.3](https://github.com/mohammed-alsalhi/wiki-app/commit/019a861) - 2026-02-23

- Updated favicon

## [0.6.2](https://github.com/mohammed-alsalhi/wiki-app/commit/c35a2cd) - 2026-02-23

- Updated world map image

## [0.6.1](https://github.com/mohammed-alsalhi/wiki-app/commit/c000fa1) - 2026-02-23

- Added MIT License
- Added README with deploy instructions
- Added CLAUDE.md with architecture documentation

## [0.6.0](https://github.com/mohammed-alsalhi/wiki-app/commit/acc5709) - 2026-02-23

- Productized wiki with environment variable configuration
- All branding driven by `NEXT_PUBLIC_*` env vars with sensible defaults
- Made article templates generic (Person, Place, Event, Thing, Group)
- Made seed categories generic (People, Places, Organizations, Events, Things, Concepts)
- Added empty-state onboarding page for fresh deployments
- Map feature hidden by default, enabled via `NEXT_PUBLIC_MAP_ENABLED`
- Created .env.example documenting all environment variables

## [0.5.0](https://github.com/mohammed-alsalhi/wiki-app/commit/196a80a) - 2026-02-23

- Added sub-category management with parent assignment
- Category tree display with indented subcategories
- Admin-only category creation with parent selector

## [0.4.0](https://github.com/mohammed-alsalhi/wiki-app/commit/2205b82) - 2026-02-23

- Improved search with relevance-based ranking (exact title > starts with > contains > content-only)
- Multi-word queries use AND logic (each word must appear somewhere)
- Trimmed whitespace from search queries
- Clear search input on navigation and result clicks

## [0.3.2](https://github.com/mohammed-alsalhi/wiki-app/commit/10ac684) - 2026-02-23

- Fixed dark mode: changed `@theme inline` to `@theme` so CSS variable overrides work

## [0.3.1](https://github.com/mohammed-alsalhi/wiki-app/commit/7aafdbb) - 2026-02-23

- Fixed dark mode by replacing ~13 hardcoded `bg-white` instances with `bg-surface`
- Replaced hardcoded colors in SearchBar and admin page with theme variables

## [0.3.0](https://github.com/mohammed-alsalhi/wiki-app/commit/a9bd57b) - 2026-02-23

- Added article revision history with content snapshots and diff viewer
- Added nested sub-categories with collapsible sidebar tree
- Added dark mode with CSS variable theming and localStorage persistence
- Added Recent Changes page with timeline grouped by date
- Added disambiguation pages with similar title detection
- Added 6 article templates (Character, Location, Event, Item, Faction, Blank)
- Added Export to PDF (browser print) and Export to Markdown (file download)

## [0.2.0](https://github.com/mohammed-alsalhi/wiki-app/commit/b7eaf40) - 2026-02-23

- Added cookie-based admin authentication with `ADMIN_SECRET` env var
- Protected all write API routes with admin check
- Created login/logout/check API endpoints and /admin page
- Hidden edit UI for non-admin users
- No auth required in local dev when `ADMIN_SECRET` is unset

## [0.1.1](https://github.com/mohammed-alsalhi/wiki-app/commit/b3d87be) - 2026-02-23

- Switched image uploads from local filesystem to @vercel/blob cloud storage
- Added postinstall script for Prisma generate during Vercel build
- Updated build script to run prisma db push before next build

## [0.1.0](https://github.com/mohammed-alsalhi/wiki-app/commit/e6bfb5b) - 2026-02-23

- Initial release
- Next.js 16 App Router with React 19, TypeScript, Prisma 7, PostgreSQL
- Tiptap rich text editor with wiki link support (`[[Article Name]]`)
- Article CRUD with slug-based routing
- Category system for organizing articles
- Full-text search
- Interactive world map with Leaflet (CRS.Simple pixel coordinates)
- Map markers linked to articles
