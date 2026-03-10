import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { resolveWikiLinks } from "@/lib/wikilinks";
import { expandMacros } from "@/lib/macros";
import { config } from "@/lib/config";
import Link from "next/link";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ a?: string; b?: string }> };

export default async function CompareArticlesPage({ searchParams }: Props) {
  const { a, b } = await searchParams;

  if (!a || !b) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <h1 className="text-xl font-semibold mb-4">Compare Articles</h1>
        <p className="text-muted-foreground mb-6">
          Provide two article slugs to compare side by side.
        </p>
        <p className="text-sm text-muted-foreground font-mono">
          /compare?a=first-article&b=second-article
        </p>
      </div>
    );
  }

  const [artA, artB] = await Promise.all([
    prisma.article.findUnique({ where: { slug: a }, select: { id: true, title: true, slug: true, content: true, updatedAt: true, category: { select: { name: true } } } }),
    prisma.article.findUnique({ where: { slug: b }, select: { id: true, title: true, slug: true, content: true, updatedAt: true, category: { select: { name: true } } } }),
  ]);

  if (!artA || !artB) notFound();

  const [htmlA, htmlB] = await Promise.all([
    expandMacros(artA.content).then(resolveWikiLinks),
    expandMacros(artB.content).then(resolveWikiLinks),
  ]);

  return (
    <div className="px-4 py-6">
      <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">{config.name}</Link>
        <span>/</span>
        <span className="text-foreground font-medium">Compare</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Header row */}
        {[{ art: artA, html: htmlA }, { art: artB, html: htmlB }].map(({ art }) => (
          <div key={art.id} className="border border-border rounded-t px-4 py-3 bg-muted/20">
            <Link href={`/articles/${art.slug}`} className="text-lg font-semibold text-wiki-link hover:underline">
              {art.title}
            </Link>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              {art.category?.name && <span>{art.category.name} · </span>}
              Last edited {new Date(art.updatedAt).toLocaleDateString()}
            </div>
          </div>
        ))}

        {/* Content columns */}
        {[{ art: artA, html: htmlA }, { art: artB, html: htmlB }].map(({ art, html }) => (
          <div
            key={art.id}
            className="border border-t-0 border-border rounded-b px-4 py-4 overflow-auto max-h-[70vh] text-sm article-content"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ))}
      </div>
    </div>
  );
}
