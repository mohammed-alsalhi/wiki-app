# Features Backlog

500 planned features organised by theme. Items are not in priority order within a theme.
Completed features are marked `[x]`. All others are `[ ]`.

---

## Editor

- [ ] Find & replace in editor
- [ ] Editor focus / zen mode (hide all chrome, widen content)
- [ ] Auto-save indicator ("Saving…" / "Saved" / "Unsaved changes")
- [ ] Character count alongside word count
- [ ] Word frequency cloud per article
- [ ] Paste Markdown → rich text (detect and convert on paste)
- [ ] Smart URL paste → auto-link
- [ ] Copy article as Markdown button on article page
- [ ] Copy article as plain text button
- [ ] Typewriter scrolling mode (cursor stays centred vertically)
- [ ] Editor outline panel (headings tree in left panel)
- [ ] Pull quote / callout blocks
- [ ] Tabbed content blocks
- [ ] Accordion / FAQ blocks
- [ ] Vertical timeline blocks
- [ ] Gallery grid blocks
- [ ] Button / CTA blocks
- [ ] Divider with label blocks
- [ ] Multi-column layout blocks (2-col, 3-col)
- [ ] Math / LaTeX inline support (KaTeX)
- [ ] Chemical formula support (mhchem)
- [ ] Music notation blocks (ABC notation → rendered score)
- [ ] Chess board diagram blocks (FEN string)
- [ ] Vega-Lite chart blocks
- [ ] D3 embed blocks
- [ ] Sandboxed iframe embed blocks
- [ ] YouTube / Vimeo embed blocks
- [ ] Twitter / X embed blocks
- [ ] Spotify embed blocks
- [ ] GitHub Gist embed blocks
- [ ] CodePen embed blocks
- [ ] JSFiddle embed blocks
- [ ] Replit embed blocks
- [ ] Custom HTML blocks (admin only)
- [ ] Article merge (combine two articles at cursor)
- [ ] Article split (split article into two at selection)
- [ ] Paragraph-level version history (blame view)
- [ ] Smart typography (auto em-dash, ellipsis, smart quotes)
- [ ] Superscript / subscript toolbar buttons
- [ ] Text highlighting in multiple colours
- [ ] Custom CSS class assignment on any block
- [ ] Drag-and-drop block reordering
- [ ] Inline table of contents (anchor links auto-updated)
- [ ] Block-level comments (leave a comment on a paragraph)
- [ ] Article "last read position" memory (scroll restoration)
- [ ] Editor line numbers for code blocks
- [ ] Custom editor themes (light / dark / sepia / high-contrast)
- [ ] Distraction-free writing with word-count goal
- [ ] Sentence-level undo/redo (not just character-level)

---

## Content Organisation

- [ ] Multi-category articles (article belongs to multiple categories)
- [ ] Category ordering modes (alphabetical / manual / by date / by popularity)
- [ ] Category statistics panel (article count, avg word count, last edited)
- [ ] Tag cloud with date range filter
- [x] Tag merge tool
- [ ] Tag rename with automatic redirect
- [ ] Bulk tag operations (apply / remove tag from N articles at once)
- [ ] Smart / auto-suggested tags (NLP-based from content)
- [ ] Article series with ordered navigation
- [ ] Series table of contents
- [ ] Series progress tracker (X of N read)
- [ ] Virtual categories (tag-based, not tree-positioned)
- [ ] Category templates (pre-fill structure for new articles)
- [ ] Cross-wiki article linking
- [ ] Namespace support (Article:, Talk:, File:, Help:, User:)
- [ ] Article aliases (multiple slugs → one article)
- [ ] Canonical URL management
- [ ] Article expiry / archival workflow
- [ ] Content certification workflow (admin marks article as verified)
- [ ] Good-article / featured-article badges
- [ ] Quality completeness score per article
- [ ] Citation tracker
- [ ] Reference list auto-generation from footnotes
- [ ] Bibliography export (BibTeX, RIS, APA, MLA)
- [ ] "See Also" auto-suggestions (similarity-based)
- [ ] Disambiguation page builder UI
- [ ] Redirect chain resolver (detect and flatten long redirect chains)
- [ ] Broken redirect detector in admin lint
- [ ] Category tree visualiser (interactive expandable tree)
- [ ] Orphan article finder (enhanced — also suggests parent categories)
- [ ] Dead-end article finder (no outgoing wiki-links)
- [ ] Long-article splitter suggestions (flag articles > 5 000 words)
- [ ] Short-article merger suggestions (flag stubs < 100 words)
- [ ] Duplicate content detector (beyond title — content similarity)
- [ ] Glossary management page
- [ ] Term hover-cards (preview definition inline on hover)
- [ ] Article todo list (per-article internal checklist for editors)
- [ ] Wiki project pages (coordinate editing efforts on a topic)
- [ ] Editorial calendar (plan and schedule upcoming articles)
- [ ] Content ownership / watchlist digest

---

## Discovery & Navigation

- [ ] Advanced search: date range, author, word-count range, has-images
- [ ] Saved search alerts (notify when new matches appear)
- [ ] Per-user search history
- [ ] Did-you-mean / spell-correct suggestions
- [ ] Faceted search (filter by category + tag + status simultaneously)
- [ ] Article similarity score display on search results
- [ ] "People who read this also read" widget
- [ ] Reading journey map (user's own reading path visualised)
- [ ] Article popularity trends (rising / falling this week)
- [ ] Hot articles widget (most viewed in last 7 days)
- [ ] New articles feed widget
- [ ] Random article with category/tag filter
- [ ] Article quiz mode (flashcard-style review of article content)
- [ ] Spaced repetition reading scheduler
- [ ] Knowledge graph exploration mode
- [ ] Citation graph (article A references article B)
- [ ] Influence map (track intellectual lineage between articles)
- [ ] Geographic browse (articles with map coordinates)
- [ ] Language / locale browse
- [ ] Author browse (all articles by a contributor)
- [ ] Contributor profile pages
- [ ] Reading level estimator (Flesch-Kincaid grade level)
- [ ] Content warning tags (CW: violence, spoilers, etc.)
- [ ] Long / short article toggle filter
- [ ] Print queue (batch-print multiple articles)
- [ ] Speed-read mode (word-by-word rapid display)
- [ ] Focus-paragraph mode (dim non-active paragraphs)
- [ ] Text-only mode (strip images for focused reading)
- [ ] High-contrast accessibility mode
- [ ] Dyslexia-friendly font option (OpenDyslexic)
- [ ] Font size preference (small / medium / large / XL)
- [ ] Command palette (Cmd+K fuzzy search all articles + actions)
- [ ] Recent articles in command palette history
- [ ] Quick-create article from command palette
- [ ] Breadcrumb trail on all pages
- [ ] Article progress indicator (% of article scrolled)
- [ ] Continue-reading feature (resume at last scroll position)
- [ ] "Save for later" one-click on any article list
- [ ] Night reading mode (warm dark theme, auto at sunset)
- [ ] Estimated finish time per article

---

## Collaboration

- [ ] Inline suggestions (suggest edits, accept/reject flow like Google Docs)
- [ ] Real-time collaborative editing (Yjs — full production wiring)
- [ ] Edit conflict resolution UI (merge conflicting saves)
- [ ] Change proposal workflow (editor proposes, admin approves)
- [ ] Peer review queue
- [ ] Discussion threading (nested replies)
- [ ] Discussion subscriptions (follow a single thread)
- [ ] Inline discussion permalinks
- [ ] @mention autocomplete in discussion editor
- [ ] Discussion moderation (pin, lock, delete threads)
- [ ] Discussion search
- [ ] Discussion export (CSV / Markdown)
- [ ] Article talk pages (Wikipedia-style, separate from discussions)
- [ ] Anonymous editing with CAPTCHA
- [ ] Edit rate limiting (per IP and per user)
- [ ] Editor reputation score
- [ ] Trusted editor status (bypass moderation queue)
- [ ] Contribution graph (GitHub-style heatmap on profile)
- [ ] Edit attribution in diff view
- [ ] Blame / annotate view (who wrote each paragraph)
- [ ] Content ownership transfer between users
- [ ] Article adoption (claim unmaintained articles)
- [ ] Translation workflow (assign locale-specific translation tasks)
- [ ] Translation memory (reuse previously translated phrases)
- [ ] Glossary linking (auto-link defined terms to glossary)
- [ ] Fact-check / disputed content marker
- [ ] Cleanup tags (needs images / needs expansion / needs citations)
- [ ] Citation request inline tag
- [ ] Mentorship program (pair new editors with experienced ones)

---

## Analytics & Insights

- [ ] Article section heatmap (which paragraphs get most scroll time)
- [ ] Funnel analysis (article entry → next-page exit paths)
- [ ] Referrer tracking (how users arrive at each article)
- [ ] External link click tracking
- [ ] Time-on-page per section
- [ ] Engagement score per article
- [ ] Reader retention rate (% who read past halfway)
- [ ] Bounce rate per article
- [ ] Top referrers admin dashboard
- [ ] Geographic reader distribution
- [ ] Device breakdown (mobile / desktop / tablet)
- [ ] Reading time accuracy (actual vs. estimated)
- [ ] Article completion rate (% who reach end)
- [ ] A/B test article titles
- [ ] Conversion tracking (read → edit)
- [ ] Article health trends over time charts
- [ ] Editor activity dashboard
- [ ] Content gap analysis (popular zero-result searches)
- [ ] Knowledge coverage map
- [ ] Writing velocity tracker (words added per week)
- [ ] Category growth chart
- [ ] Tag usage trends
- [ ] Article lifecycle analysis (draft → publish duration)
- [ ] Comment sentiment analysis
- [ ] Reader satisfaction quick rating (1–5 after article)
- [ ] Analytics export to CSV
- [ ] Analytics REST API endpoint
- [ ] Custom event tracking
- [ ] Reading goals tracking
- [ ] Core Web Vitals dashboard

---

## Admin Tools

- [ ] Bulk article import (JSON / CSV with field mapping)
- [ ] Bulk article export to JSON
- [ ] Content approval workflow UI
- [ ] Edit queue (pending edits waiting for admin approval)
- [ ] IP ban tool
- [ ] User suspension (time-limited)
- [ ] User activity log per user
- [ ] Content moderation dashboard
- [ ] Spam detection (auto-flag suspicious edits)
- [ ] Vandalism detector (revert to last good revision)
- [ ] Mass rollback (revert all edits by a specific user)
- [ ] Database vacuum (remove orphaned records)
- [ ] Revision pruning (keep only N revisions per article)
- [ ] Storage usage dashboard
- [ ] Full-text search re-index button
- [ ] Embedding re-generation button
- [ ] Cache invalidation controls
- [ ] Feature flags per user / group
- [ ] Rate-limit configuration UI
- [ ] Email template editor
- [ ] Notification template editor
- [ ] Custom 404 page editor
- [ ] Maintenance mode toggle
- [ ] Read-only mode toggle
- [ ] Announcement scheduling (set future go-live time for banners)
- [ ] Auto-backup to S3 / Vercel Blob
- [ ] Restore from backup
- [ ] Database health check dashboard
- [ ] Slow query log viewer
- [ ] API usage dashboard
- [ ] Webhook delivery retry button
- [ ] Dead letter queue for failed webhooks
- [ ] GDPR data export per user
- [ ] GDPR data deletion per user
- [ ] Cookie consent management
- [ ] Admin two-person approval for destructive actions
- [ ] Admin session timeout configuration
- [ ] Scheduled report emails (weekly digest to admins)
- [ ] Admin action undo (for category changes, bulk ops)

---

## User Experience

- [ ] Onboarding wizard (first-time user tour)
- [ ] Welcome checklist (complete profile, read 3 articles, make first edit)
- [ ] Achievement system (badges for contribution milestones)
- [ ] Points / XP system for contributions
- [ ] User level system (Reader → Contributor → Editor → Expert → Master)
- [ ] Profile customisation (avatar upload, bio, social links)
- [ ] User portfolio (public view of all contributions)
- [ ] Following other users
- [ ] User feed (activity updates from followed users)
- [ ] Notification centre (all notifications in one place, grouped)
- [ ] Notification grouping (batch similar notifications)
- [ ] Granular email notification preferences
- [ ] Unsubscribe link in notification emails
- [ ] Dark mode scheduled (auto-switch at configurable times)
- [ ] Custom accent colour picker
- [ ] Font choice preference (serif / sans-serif / monospace)
- [ ] Sidebar position preference (left / right)
- [ ] Article width preference (narrow / default / full)
- [ ] Image loading preference (eager / lazy / off)
- [ ] Motion reduction preference
- [ ] Keyboard-only navigation (tab-focus on all interactive elements)
- [ ] Paste history (recent clipboard items in editor)
- [ ] Global command history (undo across pages)
- [ ] Article "pin to top" of personal reading list
- [ ] Quick note on any article (private sticky note)
- [ ] Personal reading notes (private annotations per article)
- [ ] Highlight text and save as quote / note
- [ ] Share highlighted text (URL fragment with highlight)
- [ ] Print article with personal annotations
- [ ] Export personal notes as Markdown
- [ ] Calendar view of reading history
- [ ] Time-zone aware timestamps (show dates in user's local time)

---

## API & Integrations

- [ ] GraphQL subscriptions (real-time updates via WebSocket)
- [ ] Webhook retry with exponential backoff
- [ ] OAuth2 provider (this wiki as identity provider)
- [ ] SAML SSO support
- [ ] LDAP / Active Directory integration
- [ ] Google Sign-In
- [ ] GitHub Sign-In
- [ ] Microsoft / Entra Sign-In
- [ ] Discord Sign-In
- [ ] Apple Sign-In
- [ ] TOTP / Authenticator-app MFA
- [ ] Passkey / WebAuthn login
- [ ] API key scopes (read / write / admin)
- [ ] Per-key API rate limiting
- [ ] OpenAPI spec auto-generated from routes
- [ ] SDK generation (TypeScript, Python, Go)
- [ ] Zapier integration
- [ ] Make (Integromat) integration
- [ ] n8n integration
- [ ] Notion two-way sync
- [ ] Obsidian two-way sync
- [ ] Roam Research import
- [ ] LogSeq import
- [ ] Bear app import
- [ ] Craft Docs import
- [ ] Evernote import
- [ ] OneNote import
- [ ] Google Docs live import
- [ ] Dropbox Paper import
- [ ] HackMD sync
- [ ] GitHub wiki sync (two-way)
- [ ] GitLab wiki sync
- [ ] Jira issue linking
- [ ] Linear issue linking
- [ ] Asana task linking
- [ ] Slack slash command for search
- [ ] Discord slash command for search
- [ ] Microsoft Teams integration
- [ ] Telegram bot
- [ ] Email-to-article (send email → draft article)
- [ ] Calendar integration (embed events from Google/Outlook)

---

## Performance

- [ ] Incremental static regeneration for popular articles
- [ ] Edge caching configuration UI
- [ ] Image optimisation pipeline (WebP / AVIF auto-conversion)
- [ ] Image blur placeholder (LQIP)
- [ ] Prefetch article links on hover
- [ ] Service worker for offline reading
- [ ] PWA manifest (installable on home screen)
- [ ] Background sync for offline edits
- [ ] Database connection pool dashboard
- [ ] Bundle size analysis admin page
- [ ] Core Web Vitals dashboard
- [ ] Lighthouse score tracker (run on schedule)
- [ ] Performance budget alerts
- [ ] Font subsetting
- [ ] Third-party script audit
- [ ] Lazy-load all below-the-fold images
- [ ] Virtual list for long article listings
- [ ] Server-sent events for live notification count
- [ ] Response time histogram per route
- [ ] P95 latency tracking

---

## Content Types

- [ ] Interactive data tables (sortable, filterable, paginated)
- [ ] Interactive decision trees
- [ ] Polls and surveys embedded in articles
- [ ] Quizzes (multiple choice, true/false, short answer)
- [ ] Recipe format (ingredients, steps, yield, nutrition)
- [ ] Event pages (date, location, RSVP)
- [ ] Person infobox (birth/death, nationality, occupation)
- [ ] Location infobox (coordinates, country, population)
- [ ] Organisation infobox (founded, headquarters, members)
- [ ] Book review format (author, rating, genre, summary)
- [ ] Movie review format (director, cast, rating)
- [ ] Music album review (artist, tracklist, year)
- [ ] Scientific paper format (abstract, methods, citations)
- [ ] Meeting notes format (agenda, decisions, action items)
- [ ] Project page format (status, team, milestones, links)
- [ ] Tutorial format (steps, estimated time, difficulty)
- [ ] API documentation page format (endpoint cards)
- [ ] Comparison table blocks (side-by-side feature matrix)
- [ ] Image gallery with captions and lightbox zoom
- [ ] Video collections page
- [ ] Audio collections / podcast feed
- [ ] Document attachment uploads (PDF, DOCX)
- [ ] Spreadsheet embed (Google Sheets)
- [ ] Presentation embed (Google Slides)
- [ ] Changelog page format (version history entries)
- [ ] Legal document format (parties, clauses, dates)

---

## Multilingual

- [ ] Auto-translation queue (flag untranslated articles)
- [ ] Translation completeness indicator per locale
- [ ] Translation suggestion queue (suggest missing translations)
- [ ] Community translation workflow
- [ ] Language switcher in article header
- [ ] Locale-specific number / date formatting
- [ ] Full RTL layout for Arabic, Hebrew, Farsi
- [ ] Bidirectional text mixing support
- [ ] Language-specific full-text search indexes
- [ ] Cross-locale search
- [ ] Translation memory database per wiki
- [ ] Glossary translation per locale
- [ ] Machine translation post-editing workflow
- [ ] Language detection for imported content
- [ ] Traditional ↔ Simplified Chinese script conversion
- [ ] Romanisation / transliteration helper
- [ ] Per-locale category structure
- [ ] Locale-specific home page content

---

## Gamification

- [ ] Writing streaks (consecutive days of editing)
- [ ] Article quality improvement quests
- [ ] Monthly content creation challenges
- [ ] Editing marathons (timed events)
- [ ] First edit of the day bonus XP
- [ ] Milestone celebrations (popups at 10, 50, 100 articles)
- [ ] Wiki leaderboards (monthly / weekly / all-time)
- [ ] Team competitions (group vs. group editing)
- [ ] Topic expertise badges (edit N articles in a category)
- [ ] Contributor of the month
- [ ] Article spotlight (featured on home page)
- [ ] Reaction milestone badges
- [ ] Discussion participation badges
- [ ] Translation badges
- [ ] Streak freeze mechanic (use a freeze to keep streak)
- [ ] XP multiplier events (weekend double XP)
- [ ] Community goals (wiki reaches 1 000 articles)
- [ ] Wiki growth challenges
- [ ] Achievement showcase section on user profile
- [ ] Seasonal themes / events

---

## Security

- [ ] Content Security Policy configuration UI
- [ ] Rate limiting configuration per route
- [ ] CAPTCHA on registration
- [ ] Email verification required before editing
- [ ] Suspicious activity alerts (unusual login location)
- [ ] Login attempt log
- [ ] Session management page (view and revoke all active sessions)
- [ ] API key audit log
- [ ] Revision tampering detection
- [ ] Per-article read permissions (granular ACL)
- [ ] Per-category read permissions
- [ ] IP allowlist for admin panel
- [ ] Two-person approval for destructive admin actions
- [ ] Security headers audit page
- [ ] Dependency vulnerability scanner in admin
- [ ] Private / invite-only wiki mode
- [ ] Encrypted article storage option
- [ ] Canary token support for data-exfiltration detection
- [ ] Admin action signing (require re-auth for deletions)
- [ ] Audit trail for permission changes

---

## AI Features

- [ ] AI article generation from an outline
- [ ] AI image alt-text generation
- [ ] AI content moderation (flag inappropriate content)
- [ ] AI grammar and style checker
- [ ] AI title suggestions from content
- [ ] AI tagging suggestions
- [ ] AI category suggestions
- [ ] AI duplicate detection improvement
- [ ] AI question answering (ask the wiki a question)
- [ ] AI fact-checking against Wikipedia / Wikidata
- [ ] AI citation suggestions
- [ ] AI outline builder
- [ ] AI "expand this section" suggestion
- [ ] AI tone adjustment (formal / casual / technical)
- [ ] AI translation quality scoring
- [ ] AI code explanation in code blocks
- [ ] Knowledge graph auto-building from article content
- [ ] Named entity extraction and auto-linking
- [ ] Topic modelling across the whole wiki
- [ ] Predictive article creation (suggest articles based on content gaps)
- [ ] Conversational AI wiki assistant (chat sidebar)
- [ ] AI meeting-notes to article conversion
- [ ] AI PDF to article extraction
- [ ] AI video transcript to article conversion
- [ ] AI data (CSV) to prose article
- [ ] AI-powered search re-ranking
- [ ] Custom AI model fine-tuning on wiki content
- [ ] AI reading difficulty adjuster
- [ ] AI content expansion for stub articles
- [ ] AI revision summary generation

---

## Platform & Extensibility

- [ ] Plugin marketplace (browse, install, rate plugins)
- [ ] Plugin SDK documentation
- [ ] Custom block types via plugins
- [ ] Custom sidebar widgets via plugins
- [ ] Custom admin panel sections via plugins
- [ ] Theme builder (visual CSS variable editor)
- [ ] Layout builder (drag-and-drop page layouts)
- [ ] Content scheduling calendar view
- [ ] Multi-wiki management dashboard
- [ ] Wiki federation protocol
- [ ] White-label / custom domain per wiki
- [ ] Subdomain routing (team.wiki.app)
- [ ] Multi-tenant billing dashboard
- [ ] Usage quotas per tenant
- [ ] SLA monitoring per tenant
- [ ] Custom webhook payload templates
- [ ] Event bus (pub/sub for internal events)
- [ ] Headless mode (API-only, no front-end)
- [ ] Static site export (generate full HTML site)
- [ ] GitHub Pages / Netlify deploy from export
