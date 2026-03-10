import prisma from "./prisma";
import { generateSlug } from "./utils";

export async function resolveWikiLinks(html: string): Promise<string> {
  // Find all wiki links in the HTML
  const regex = /data-wiki-link="([^"]+)"/g;
  const titles: string[] = [];
  let match;

  while ((match = regex.exec(html)) !== null) {
    titles.push(match[1]);
  }

  if (titles.length === 0) return html;

  // Get all slugs for these titles
  const slugs = titles.map(generateSlug);
  const existingArticles = await prisma.article.findMany({
    where: { slug: { in: slugs } },
    select: { slug: true },
  });

  const existingSlugs = new Set(existingArticles.map((a) => a.slug));

  // Mark broken links
  let resolved = html;
  for (const title of titles) {
    const slug = generateSlug(title);
    if (!existingSlugs.has(slug)) {
      resolved = resolved.replace(
        `class="wiki-link" data-wiki-link="${title}"`,
        `class="wiki-link wiki-link-broken" data-wiki-link="${title}"`
      );
    }
  }

  return resolved;
}

/**
 * Expand {{embed:slug}} transclusion syntax in article content.
 * Replaces each occurrence with the target article's HTML wrapped in a styled block.
 * Only resolves one level (no recursive transclusion).
 */
export async function resolveTransclusions(content: string): Promise<string> {
  const regex = /\{\{embed:([a-z0-9-]+)\}\}/gi;
  const matches = [...content.matchAll(regex)];
  if (matches.length === 0) return content;

  const slugs = [...new Set(matches.map((m) => m[1].toLowerCase()))];
  const articles = await prisma.article.findMany({
    where: { slug: { in: slugs } },
    select: { slug: true, title: true, content: true },
  });
  const bySlug = new Map(articles.map((a) => [a.slug, a]));

  let resolved = content;
  for (const m of matches) {
    const full = m[0];
    const slug = m[1].toLowerCase();
    const article = bySlug.get(slug);
    const replacement = article
      ? `<div class="transclusion my-6 border border-border rounded-lg overflow-hidden">` +
        `<div class="transclusion-header px-4 py-2 bg-muted/50 border-b border-border text-sm font-medium">` +
        `<a href="/articles/${article.slug}" class="hover:underline">${article.title}</a></div>` +
        `<div class="transclusion-body px-4 py-3 prose prose-sm max-w-none">${article.content}</div>` +
        `</div>`
      : `<span class="wiki-link wiki-link-broken" title="Embedded article not found">${full}</span>`;
    resolved = resolved.replace(full, replacement);
  }
  return resolved;
}

export async function getBacklinks(slug: string): Promise<{ id: string; title: string; slug: string }[]> {
  // Find articles whose content contains a wiki link to this article
  const articles = await prisma.article.findMany({
    where: {
      content: { contains: `data-wiki-link=` },
    },
    select: { id: true, title: true, slug: true, content: true },
  });

  // Filter to ones that actually link to this slug
  return articles
    .filter((a) => {
      const regex = /data-wiki-link="([^"]+)"/g;
      let m;
      while ((m = regex.exec(a.content)) !== null) {
        if (generateSlug(m[1]) === slug) return true;
      }
      return false;
    })
    .map(({ id, title, slug }) => ({ id, title, slug }));
}
