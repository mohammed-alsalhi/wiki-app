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
