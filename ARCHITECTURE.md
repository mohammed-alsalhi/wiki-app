# Architecture

This document describes the technical architecture of Wiki App for contributors and maintainers.

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, TypeScript |
| Styling | Tailwind CSS 4 with CSS variable theming |
| Editor | Tiptap (ProseMirror-based) |
| Database | PostgreSQL via Prisma 7 ORM |
| Auth | Cookie-based single admin password |
| Hosting | Vercel (recommended), any Node.js host |
| Image Storage | Vercel Blob |

## Directory Structure

```
src/
  app/                    # Next.js App Router pages and API routes
    api/
      articles/           # CRUD + batch + import + search + titles
      categories/         # Category CRUD
      tags/               # Tag CRUD
      auth/               # Login/logout/check
      map-markers/        # Map area CRUD
      search/             # Full-text search
      upload/             # Image upload to Vercel Blob
    articles/
      [slug]/             # Article display, edit, history, diff, discussion
      new/                # Create article page
    categories/           # Category listing and individual category pages
    tags/                 # Tag-based article listing
    map/                  # Interactive map page
    help/                 # In-app documentation
    import/               # Bulk article import (admin)
    admin/                # Admin login page
  components/
    editor/               # Tiptap editor and extensions
      TiptapEditor.tsx    # Main rich text editor component
      EditorToolbar.tsx   # Formatting toolbar
      WikiLinkExtension.ts    # [[Article Name]] node extension
      PotentialLinkExtension.ts # Detected link mark extension
      WikiLinkSuggester.tsx    # Autocomplete dropdown for wiki links
      LinkBubble.tsx      # Floating edit/remove tooltip for links
    layout/               # Sidebar, header, footer
    map/                  # Leaflet map components (dynamically imported)
    InfoboxEditor.tsx     # Category-specific field editor
    InfoboxDisplay.tsx    # Category-specific field display
    CategorySelect.tsx    # Hierarchical category dropdown
    TagPicker.tsx         # Multi-select tag picker
    TemplatePicker.tsx    # Article template selector
    ThemeToggle.tsx       # Dark/light mode toggle
  lib/
    prisma.ts             # Prisma client singleton
    auth.ts               # Admin authentication helpers
    config.ts             # Environment-driven branding config
    wikilinks.ts          # Wiki link resolution and backlink queries
    infobox-schema.ts     # Category-specific infobox field definitions
    templates.ts          # Article starter templates
    utils.ts              # Slug generation, date formatting
    import.ts             # Article import parsing utilities
prisma/
  schema.prisma           # Database schema
  seed.mjs                # Category and subcategory seeder
```

## Database Models

### Article
The central content model. Stores HTML content from Tiptap, optional raw Markdown, excerpt, cover image, and category-specific infobox data as JSON. Supports redirects (`redirectTo`) and disambiguation pages.

### Category
Hierarchical with self-referencing `parentId`. Six root categories (People, Places, Organizations, Events, Things, Concepts) each with subcategories. Categories drive which infobox fields are shown for articles.

### ArticleRevision
Immutable snapshots created automatically on every article edit. Stores the content, title, and infobox state before the edit was applied. Powers the history timeline and diff viewer.

### Tag
Flat labels with many-to-many relationship to articles via `ArticleTag` join table.

### Discussion
Per-article comment threads. Anyone can post; admin can delete.

### MapMarker
Polygon areas on an interactive map. Each area has coordinates (JSON array), optional color, and an optional link to an article.

## Key Patterns

### Configuration
All branding is driven by `NEXT_PUBLIC_*` environment variables read through `src/lib/config.ts`. Defaults produce a generic wiki; personal branding is set via environment variables.

### Authentication
Single admin password via `ADMIN_SECRET` env var. Cookie-based using `admin_token`. When `ADMIN_SECRET` is unset, all users have admin access (useful for local development). API routes guard with `requireAdmin(await isAdmin())`.

### Wiki Links
Articles cross-reference using `[[Article Name]]` syntax. The custom Tiptap `WikiLink` extension (an atom node) renders these as `<a data-wiki-link="Title">` in the editor. At display time, `resolveWikiLinks()` queries the database to verify targets exist and marks broken links with a CSS class. `getBacklinks()` finds articles that reference a given slug.

### Content Storage
Articles store `content` (HTML from Tiptap) and optionally `contentRaw` (Markdown for export). HTML is the canonical format displayed to users.

### Revision System
Every PUT to an article endpoint first snapshots the current state into `ArticleRevision`, then applies the update. This provides a complete edit history without explicit user action.

### Category-Specific Infoboxes
Each root category defines a field schema in `src/lib/infobox-schema.ts`. Subcategories inherit their parent's schema via a parent chain walk. Fields support types: text, textarea, number, wikilink (renders as article link), and list (comma-separated). Infobox data is stored as JSON on the Article model.

### Theming
CSS variables in `src/app/globals.css` under a `@theme` block. Dark mode applies overrides via `html[data-theme="dark"]`. Uses `@theme` (not `@theme inline`) so CSS variable overrides work correctly with Tailwind.

### Search
Relevance-ranked full-text search. Multi-word queries use AND logic. Results scored by: exact title match (100) > starts with (80) > title contains (60) > content only (0).

### Map
Disabled by default (`NEXT_PUBLIC_MAP_ENABLED=true` to enable). Uses Leaflet with `CRS.Simple` for pixel coordinates on a custom image. Dynamically imported to avoid SSR issues. Areas are clickable polygons that link to articles.

## API Routes

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/articles` | GET, POST | List/create articles |
| `/api/articles/[id]` | GET, PUT, DELETE | Single article CRUD |
| `/api/articles/[id]/revisions` | GET | Article revision history |
| `/api/articles/[id]/discussions` | GET, POST, DELETE | Article comments |
| `/api/articles/batch` | PUT, DELETE | Bulk operations on articles |
| `/api/articles/import` | POST | Import articles from files |
| `/api/articles/similar` | GET | Find articles with similar titles |
| `/api/articles/titles` | GET | Lightweight list of all article titles |
| `/api/categories` | GET, POST | List/create categories |
| `/api/tags` | GET, POST | List/create tags |
| `/api/search` | GET | Full-text search |
| `/api/map-markers` | GET, POST | List/create map areas |
| `/api/map-markers/[id]` | PUT, DELETE | Update/delete map areas |
| `/api/upload` | POST | Upload images to Vercel Blob |
| `/api/auth/*` | POST | Login, logout, auth check |
