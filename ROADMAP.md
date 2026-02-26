# Roadmap

This document outlines planned features and improvements for Wiki App. Contributions toward any of these are welcome.

## Near-Term

### Editor Improvements
- [ ] Footnotes and citations
- [ ] Code block syntax highlighting
- [ ] Drag-and-drop image placement within content
- [ ] Undo/redo keyboard shortcut indicators in toolbar
- [ ] Better table editing (merge cells, resize columns)

### Content Features
- [ ] Article templates per category (auto-fill infobox + content skeleton)
- [ ] Multi-language support for article content
- [ ] Article versioning comparison improvements (inline diff view)
- [ ] Related articles section (auto-suggested based on shared categories/tags)
- [ ] Table of contents generation from headings

### Organization
- [ ] Nested tags (tag hierarchy like categories)
- [ ] Custom sort order for articles within categories
- [ ] Article status workflow (draft → review → published)
- [ ] Pinned/featured articles per category

## Medium-Term

### Search & Discovery
- [ ] Full-text search with PostgreSQL `tsvector` for better performance
- [ ] Search filters (by category, tag, date range)
- [ ] Search result highlighting
- [ ] Random article button

### User System
- [ ] Multi-user authentication (sign up / sign in)
- [ ] User profiles with contribution history
- [ ] Role-based permissions (admin, editor, viewer)
- [ ] Edit watchlist and notifications

### API & Integration
- [ ] Public REST API with documentation
- [ ] Webhooks for article create/update/delete events
- [ ] RSS/Atom feed for recent changes
- [ ] Import from MediaWiki XML dumps

## Long-Term

### Advanced Features
- [ ] Real-time collaborative editing (CRDT or OT-based)
- [ ] Semantic wiki links with relationship types
- [ ] Graph visualization of article connections
- [ ] Full-text PDF/EPUB export of entire wiki or category
- [ ] Plugin/extension system for custom functionality

### Infrastructure
- [ ] Automated test suite (unit, integration, e2e)
- [ ] CI/CD pipeline with GitHub Actions
- [ ] Database migration system (instead of `db push`)
- [ ] Docker Compose setup for one-command local deployment
- [ ] Performance monitoring and analytics dashboard

### Map Enhancements
- [ ] Multiple maps per wiki
- [ ] Map layer toggling (political boundaries, terrain, etc.)
- [ ] Map area search and filtering
- [ ] Zoomable map with different detail levels

---

Have an idea that's not listed here? Open a [GitHub Issue](https://github.com/mohammed-alsalhi/wiki-app/issues) to discuss it.
