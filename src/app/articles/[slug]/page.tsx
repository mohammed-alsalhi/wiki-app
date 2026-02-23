import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { resolveWikiLinks, getBacklinks } from "@/lib/wikilinks";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;

  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      category: true,
      tags: { include: { tag: true } },
    },
  });

  if (!article) notFound();

  const [resolvedContent, backlinks] = await Promise.all([
    resolveWikiLinks(article.content),
    getBacklinks(slug),
  ]);

  return (
    <div>
      {/* Article tabs */}
      <div className="wiki-tabs">
        <span className="wiki-tab wiki-tab-active">Article</span>
        <Link href={`/articles/${slug}/edit`} className="wiki-tab">
          Edit
        </Link>
      </div>

      {/* Article body in bordered content area */}
      <div className="border border-t-0 border-border bg-surface px-5 py-4">
        {/* Article title */}
        <h1
          className="text-[1.7rem] font-normal text-heading border-b border-border pb-1 mb-0.5"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {article.title}
        </h1>

        {/* From World Wiki line */}
        <p className="text-[11px] text-muted mb-3">
          From World Wiki &mdash; Last edited {formatDate(article.updatedAt)}
        </p>

        {/* Infobox */}
        {(article.category || article.tags.length > 0 || article.coverImage) && (
          <div className="wiki-infobox">
            <div className="wiki-infobox-header">
              {article.title}
            </div>
            {article.coverImage && (
              <div className="wiki-infobox-image">
                <img src={article.coverImage} alt={article.title} />
              </div>
            )}
            {article.category && (
              <div className="wiki-infobox-row">
                <div className="wiki-infobox-label">Category</div>
                <div className="wiki-infobox-value">
                  <Link href={`/categories/${article.category.slug}`}>
                    {article.category.icon} {article.category.name}
                  </Link>
                </div>
              </div>
            )}
            {article.tags.length > 0 && (
              <div className="wiki-infobox-row">
                <div className="wiki-infobox-label">Tags</div>
                <div className="wiki-infobox-value">
                  {article.tags.map(({ tag }, i) => (
                    <span key={tag.id}>
                      {i > 0 && ", "}
                      <Link href={`/tags/${tag.slug}`}>{tag.name}</Link>
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="wiki-infobox-row">
              <div className="wiki-infobox-label">Created</div>
              <div className="wiki-infobox-value">{formatDate(article.createdAt)}</div>
            </div>
            <div className="wiki-infobox-row">
              <div className="wiki-infobox-label">Updated</div>
              <div className="wiki-infobox-value">{formatDate(article.updatedAt)}</div>
            </div>
          </div>
        )}

        {/* Article content */}
        <div
          className="wiki-content"
          dangerouslySetInnerHTML={{ __html: resolvedContent }}
        />

        {/* Clear float from infobox */}
        <div className="clear-both" />

        {/* Categories bar at bottom */}
        <div className="wiki-categories">
          <strong>Categories: </strong>
          {article.category ? (
            <Link href={`/categories/${article.category.slug}`}>
              {article.category.name}
            </Link>
          ) : (
            <span className="italic">Uncategorized</span>
          )}
          {article.tags.length > 0 && (
            <>
              {" | "}
              {article.tags.map(({ tag }, i) => (
                <span key={tag.id}>
                  {i > 0 && " | "}
                  <Link href={`/tags/${tag.slug}`}>{tag.name}</Link>
                </span>
              ))}
            </>
          )}
        </div>

        {/* What links here */}
        {backlinks.length > 0 && (
          <div className="mt-4">
            <h2
              className="text-base font-normal text-heading border-b border-border pb-1 mb-2"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              What links here
            </h2>
            <ul className="list-disc pl-6 text-[13px] space-y-0.5">
              {backlinks.map((link) => (
                <li key={link.id}>
                  <Link href={`/articles/${link.slug}`}>
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
