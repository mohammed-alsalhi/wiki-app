import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help",
};

export default function HelpPage() {
  return (
    <div>
      <h1
        className="text-[1.7rem] font-normal text-heading border-b border-border pb-1 mb-3"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        Help
      </h1>

      <p className="text-[13px] text-muted mb-4">
        This page covers all the features and tricks available in this wiki. Use the sections below to learn how to create, edit, and organize your articles.
      </p>

      {/* Getting Started */}
      <div className="wiki-portal mb-4">
        <div className="wiki-portal-header">Getting Started</div>
        <div className="wiki-portal-body text-[13px]">
          <p className="mb-2">
            To create a new article, click{" "}
            <Link href="/articles/new">Create new article</Link> in the sidebar
            or navigate directly to{" "}
            <Link href="/articles/new">/articles/new</Link>.
          </p>
          <p className="mb-2">Each article has:</p>
          <ul className="list-disc pl-5 mb-2 space-y-0.5">
            <li><strong>Title</strong> &mdash; the article name, also used to generate the URL slug</li>
            <li><strong>Content</strong> &mdash; rich text body written in the Tiptap editor</li>
            <li><strong>Category</strong> &mdash; optional, for organizing articles into groups</li>
            <li><strong>Tags</strong> &mdash; optional labels for cross-cutting topics</li>
            <li><strong>Excerpt</strong> &mdash; short summary shown in search results and article lists</li>
          </ul>
          <p>
            Articles can be saved as <strong>drafts</strong> (unpublished) or <strong>published</strong>.
            Draft articles are only visible to admins.
          </p>
        </div>
      </div>

      {/* The Editor */}
      <div className="wiki-portal mb-4">
        <div className="wiki-portal-header">The Editor</div>
        <div className="wiki-portal-body text-[13px]">
          <p className="mb-2">
            The rich text editor provides a toolbar with formatting options:
          </p>
          <ul className="list-disc pl-5 mb-2 space-y-0.5">
            <li><strong>B</strong> / <strong>I</strong> / <strong>S</strong> &mdash; Bold, Italic, Strikethrough</li>
            <li><strong>H1</strong> / <strong>H2</strong> / <strong>H3</strong> &mdash; Heading levels</li>
            <li><strong>&bull;</strong> / <strong>1.</strong> &mdash; Bullet and ordered lists</li>
            <li><strong>&ldquo;</strong> &mdash; Blockquote</li>
            <li><strong>&lt;&gt;</strong> &mdash; Code block</li>
            <li><strong>&mdash;</strong> &mdash; Horizontal rule</li>
            <li><strong>Link icon</strong> &mdash; Insert a URL link</li>
            <li><strong>Image icon</strong> &mdash; Upload an image</li>
            <li><strong>[[]]</strong> &mdash; Insert a wiki link (see below)</li>
            <li><strong>Detect Links</strong> &mdash; Scan text for potential wiki links (see below)</li>
          </ul>
          <p className="mb-2">
            <strong>Markdown mode:</strong> Click the{" "}
            <code className="bg-surface-hover px-1 text-[12px]">Markdown</code>{" "}
            button in the top-right corner of the editor to switch to raw markdown editing. Click{" "}
            <code className="bg-surface-hover px-1 text-[12px]">Rich Text</code>{" "}
            to switch back. Wiki links, bold, italic, and headings are preserved across modes.
          </p>
          <p>
            <strong>Templates:</strong> When creating a new article, you can choose from predefined templates
            (Person, Place, Event, Thing, Group) that provide a starting structure with an infobox and sections.
          </p>
        </div>
      </div>

      {/* Wiki Links */}
      <div className="wiki-portal mb-4">
        <div className="wiki-portal-header">Wiki Links</div>
        <div className="wiki-portal-body text-[13px]">
          <p className="mb-2">
            Wiki links connect articles together. There are several ways to create them:
          </p>

          <p className="mb-1 font-bold text-heading">Typing syntax</p>
          <ul className="list-disc pl-5 mb-3 space-y-0.5">
            <li>
              Type{" "}
              <code className="bg-surface-hover px-1 text-[12px]">[[Article Name]]</code>{" "}
              &mdash; auto-converts to a wiki link when you close the brackets
            </li>
            <li>
              Type{" "}
              <code className="bg-surface-hover px-1 text-[12px]">[[Article Name|Display Text]]</code>{" "}
              &mdash; creates a link to &ldquo;Article Name&rdquo; but displays &ldquo;Display Text&rdquo;
            </li>
          </ul>

          <p className="mb-1 font-bold text-heading">Link suggester</p>
          <p className="mb-3">
            When you type{" "}
            <code className="bg-surface-hover px-1 text-[12px]">[[</code>,
            an autocomplete dropdown appears showing matching articles. Use{" "}
            <strong>Arrow keys</strong> to navigate, <strong>Enter</strong> to select,
            or <strong>Escape</strong> to dismiss. The dropdown searches as you type.
          </p>

          <p className="mb-1 font-bold text-heading">Toolbar &amp; keyboard</p>
          <ul className="list-disc pl-5 mb-3 space-y-0.5">
            <li>
              Click the <strong>[[]]</strong> toolbar button &mdash; prompts for an article title.
              If text is selected, it becomes the display text.
            </li>
            <li>
              Press{" "}
              <code className="bg-surface-hover px-1 text-[12px]">Ctrl+Shift+L</code>{" "}
              (or <code className="bg-surface-hover px-1 text-[12px]">Cmd+Shift+L</code> on Mac)
              &mdash; same as the toolbar button.
            </li>
          </ul>

          <p className="mb-1 font-bold text-heading">Link status</p>
          <p>
            Wiki links to existing articles appear in <span className="text-wiki-link">blue</span>.
            Links to articles that don&apos;t exist yet appear in{" "}
            <span className="text-wiki-link-broken">red</span> (broken links),
            which is a visual cue to create that article.
          </p>
        </div>
      </div>

      {/* Link Detection */}
      <div className="wiki-portal mb-4">
        <div className="wiki-portal-header">Link Detection</div>
        <div className="wiki-portal-body text-[13px]">
          <p className="mb-2">
            The <strong>Detect Links</strong> button in the editor toolbar scans your article text
            for phrases that match existing article titles.
          </p>
          <ul className="list-disc pl-5 mb-2 space-y-0.5">
            <li>Matching phrases are highlighted with a <span style={{ borderBottom: "2px dashed var(--color-accent)" }}>dashed underline</span></li>
            <li>Hover over a highlight to see it, then <strong>click</strong> to convert it into a wiki link</li>
            <li>The toolbar button shows a count badge (e.g. &ldquo;Detect Links (5)&rdquo;) with remaining matches</li>
            <li>Text inside headings and existing wiki links is skipped</li>
            <li>Longer article titles take priority over shorter ones to avoid partial matches</li>
          </ul>
        </div>
      </div>

      {/* Search */}
      <div className="wiki-portal mb-4">
        <div className="wiki-portal-header">Search</div>
        <div className="wiki-portal-body text-[13px]">
          <p className="mb-2">
            The search bar in the top-right corner provides instant results as you type.
            Press <strong>Enter</strong> or click &ldquo;See all results&rdquo; for the{" "}
            <Link href="/search">full search page</Link>.
          </p>
          <ul className="list-disc pl-5 space-y-0.5">
            <li>Multi-word queries use <strong>AND</strong> logic &mdash; every word must appear somewhere in the article</li>
            <li>
              Results are ranked: exact title match &gt; title starts with query &gt; title contains query &gt; content-only match
            </li>
            <li>Search covers article titles, content, and excerpts</li>
          </ul>
        </div>
      </div>

      {/* Categories & Tags */}
      <div className="wiki-portal mb-4">
        <div className="wiki-portal-header">Categories &amp; Tags</div>
        <div className="wiki-portal-body text-[13px]">
          <p className="mb-2">
            <strong>Categories</strong> are hierarchical groups shown in the sidebar. Each article can belong to one category.
            Categories can have sub-categories for deeper organization.
            Browse all categories on the{" "}
            <Link href="/categories">Categories page</Link>.
          </p>
          <p>
            <strong>Tags</strong> are flat labels that can be assigned freely. An article can have multiple tags.
            Tags appear at the bottom of articles and link to a tag page listing all articles with that tag.
          </p>
        </div>
      </div>

      {/* Revision History */}
      <div className="wiki-portal mb-4">
        <div className="wiki-portal-header">Revision History</div>
        <div className="wiki-portal-body text-[13px]">
          <p className="mb-2">
            Every time you save an article, the previous version is automatically preserved as a revision.
          </p>
          <ul className="list-disc pl-5 space-y-0.5">
            <li>Click the <strong>History</strong> tab on any article to see all past revisions</li>
            <li>Each revision shows the date, time, and content at that point</li>
            <li>Select any two revisions and click <strong>Compare</strong> to see a side-by-side diff</li>
            <li>Added text is highlighted in <span className="bg-diff-added px-1">green</span> and removed text in <span className="bg-diff-removed px-1">red</span></li>
          </ul>
        </div>
      </div>

      {/* Navigation & Organization */}
      <div className="wiki-portal mb-4">
        <div className="wiki-portal-header">Navigation &amp; Organization</div>
        <div className="wiki-portal-body text-[13px]">
          <ul className="list-disc pl-5 space-y-0.5">
            <li>
              <strong>Backlinks:</strong> At the bottom of each article, a &ldquo;Pages that link here&rdquo;
              section lists all articles that reference the current one via wiki links.
            </li>
            <li>
              <strong>Table of contents:</strong> Articles with multiple headings automatically get
              a table of contents at the top.
            </li>
            <li>
              <strong>Recent changes:</strong> The{" "}
              <Link href="/recent-changes">Recent changes</Link> page shows a timeline
              of all article edits grouped by date.
            </li>
            <li>
              <strong>Disambiguation:</strong> When you create an article with a title similar to
              existing ones, a notice appears linking to the similar articles.
            </li>
          </ul>
        </div>
      </div>

      {/* Import & Export */}
      <div className="wiki-portal mb-4">
        <div className="wiki-portal-header">Import &amp; Export</div>
        <div className="wiki-portal-body text-[13px]">
          <p className="mb-1 font-bold text-heading">Import</p>
          <ul className="list-disc pl-5 mb-3 space-y-0.5">
            <li>
              <strong>Web UI:</strong> Go to the{" "}
              <Link href="/import">Import page</Link> and drag-and-drop files
              (.md, .txt, .html, .json)
            </li>
            <li>
              <strong>CLI:</strong> Run{" "}
              <code className="bg-surface-hover px-1 text-[12px]">npm run import -- path/to/files</code>{" "}
              for bulk import with{" "}
              <code className="bg-surface-hover px-1 text-[12px]">--draft</code>,{" "}
              <code className="bg-surface-hover px-1 text-[12px]">--category</code>,{" "}
              <code className="bg-surface-hover px-1 text-[12px]">--dry-run</code> flags
            </li>
            <li>Markdown files with frontmatter extract the title automatically</li>
            <li>JSON files can contain a single article object or an array of articles</li>
          </ul>

          <p className="mb-1 font-bold text-heading">Export</p>
          <ul className="list-disc pl-5 space-y-0.5">
            <li><strong>PDF:</strong> Click &ldquo;Export PDF&rdquo; on any article &mdash; uses your browser&apos;s print dialog</li>
            <li><strong>Markdown:</strong> Click &ldquo;Export Markdown&rdquo; to download the article as a .md file</li>
          </ul>
        </div>
      </div>

      {/* Map */}
      <div className="wiki-portal mb-4">
        <div className="wiki-portal-header">Interactive Map</div>
        <div className="wiki-portal-body text-[13px]">
          <p className="mb-2">
            The interactive map feature is optional and disabled by default. When enabled
            (via the{" "}
            <code className="bg-surface-hover px-1 text-[12px]">NEXT_PUBLIC_MAP_ENABLED=true</code>{" "}
            environment variable), it adds a map page with:
          </p>
          <ul className="list-disc pl-5 space-y-0.5">
            <li>A custom map image as the background</li>
            <li>Clickable polygon areas linked to articles</li>
            <li>Hover tooltips showing area names</li>
            <li>Edit mode for drawing new polygon areas (admin only)</li>
          </ul>
        </div>
      </div>

      {/* Administration */}
      <div className="wiki-portal mb-4">
        <div className="wiki-portal-header">Administration</div>
        <div className="wiki-portal-body text-[13px]">
          <ul className="list-disc pl-5 space-y-0.5">
            <li>
              <strong>Login:</strong> Go to{" "}
              <Link href="/admin">Admin</Link> and enter the admin password
              (set via{" "}
              <code className="bg-surface-hover px-1 text-[12px]">ADMIN_SECRET</code>{" "}
              environment variable)
            </li>
            <li>
              <strong>Local development:</strong> If{" "}
              <code className="bg-surface-hover px-1 text-[12px]">ADMIN_SECRET</code>{" "}
              is empty, everyone has admin access automatically
            </li>
            <li>
              <strong>Theme:</strong> Toggle between light and dark mode using the sun/moon
              icon in the top-right corner of the header
            </li>
            <li>
              <strong>Customization:</strong> Wiki name, tagline, welcome text, footer, and more
              are all configurable via{" "}
              <code className="bg-surface-hover px-1 text-[12px]">NEXT_PUBLIC_*</code>{" "}
              environment variables. See{" "}
              <code className="bg-surface-hover px-1 text-[12px]">.env.example</code>{" "}
              for the full list.
            </li>
          </ul>
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="wiki-portal mb-4">
        <div className="wiki-portal-header">Keyboard Shortcuts</div>
        <div className="wiki-portal-body text-[13px]">
          <p className="mb-2 text-muted text-[12px]">
            These shortcuts work inside the rich text editor. Replace Ctrl with Cmd on Mac.
          </p>
          <table className="w-full">
            <tbody>
              <tr className="border-b border-border-light">
                <td className="py-1 pr-4"><code className="bg-surface-hover px-1 text-[12px]">Ctrl+B</code></td>
                <td className="py-1">Bold</td>
              </tr>
              <tr className="border-b border-border-light">
                <td className="py-1 pr-4"><code className="bg-surface-hover px-1 text-[12px]">Ctrl+I</code></td>
                <td className="py-1">Italic</td>
              </tr>
              <tr className="border-b border-border-light">
                <td className="py-1 pr-4"><code className="bg-surface-hover px-1 text-[12px]">Ctrl+Shift+X</code></td>
                <td className="py-1">Strikethrough</td>
              </tr>
              <tr className="border-b border-border-light">
                <td className="py-1 pr-4"><code className="bg-surface-hover px-1 text-[12px]">Ctrl+Shift+L</code></td>
                <td className="py-1">Insert wiki link</td>
              </tr>
              <tr className="border-b border-border-light">
                <td className="py-1 pr-4"><code className="bg-surface-hover px-1 text-[12px]">Ctrl+Shift+7</code></td>
                <td className="py-1">Ordered list</td>
              </tr>
              <tr className="border-b border-border-light">
                <td className="py-1 pr-4"><code className="bg-surface-hover px-1 text-[12px]">Ctrl+Shift+8</code></td>
                <td className="py-1">Bullet list</td>
              </tr>
              <tr className="border-b border-border-light">
                <td className="py-1 pr-4"><code className="bg-surface-hover px-1 text-[12px]">Ctrl+Shift+B</code></td>
                <td className="py-1">Blockquote</td>
              </tr>
              <tr className="border-b border-border-light">
                <td className="py-1 pr-4"><code className="bg-surface-hover px-1 text-[12px]">Ctrl+Shift+E</code></td>
                <td className="py-1">Code block</td>
              </tr>
              <tr>
                <td className="py-1 pr-4"><code className="bg-surface-hover px-1 text-[12px]">Ctrl+Z</code> / <code className="bg-surface-hover px-1 text-[12px]">Ctrl+Shift+Z</code></td>
                <td className="py-1">Undo / Redo</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="wiki-notice">
        <strong>Tip:</strong> You can also type{" "}
        <code className="bg-surface-hover px-1 text-[12px]">[[</code>{" "}
        anywhere in the editor to quickly search and link to existing articles without
        leaving the keyboard.
      </div>
    </div>
  );
}
