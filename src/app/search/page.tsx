import Link from "next/link";
import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;

  if (!q || q.length < 2) {
    return (
      <div>
        <h1
          className="text-[1.7rem] font-normal text-heading border-b border-border pb-1 mb-3"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Search
        </h1>
        <p className="text-[13px] text-muted italic">
          Enter a search query (at least 2 characters) to search the encyclopedia.
        </p>
      </div>
    );
  }

  const articles = await prisma.article.findMany({
    where: {
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { content: { contains: q, mode: "insensitive" } },
        { excerpt: { contains: q, mode: "insensitive" } },
      ],
    },
    orderBy: { updatedAt: "desc" },
    include: {
      category: true,
      tags: { include: { tag: true } },
    },
  });

  return (
    <div>
      <h1
        className="text-[1.7rem] font-normal text-heading border-b border-border pb-1 mb-1"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        Search results
      </h1>
      <p className="text-[12px] text-muted mb-3">
        {articles.length} result{articles.length !== 1 ? "s" : ""} for &ldquo;{q}&rdquo;
      </p>

      {articles.length === 0 ? (
        <div className="wiki-notice">
          There were no results matching the query. You can{" "}
          <Link href="/articles/new">create an article</Link> with this title.
        </div>
      ) : (
        <ul className="text-[13px] space-y-2">
          {articles.map((article) => (
            <li key={article.id} className="border-b border-border pb-2">
              <div>
                <Link
                  href={`/articles/${article.slug}`}
                  className="font-bold text-[15px]"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {article.title}
                </Link>
                {article.category && (
                  <span className="text-muted text-[12px] ml-2">
                    ({article.category.name})
                  </span>
                )}
              </div>
              {article.excerpt && (
                <p className="text-muted mt-0.5 leading-relaxed">
                  {article.excerpt}
                </p>
              )}
              <p className="text-muted text-[11px] mt-0.5">
                Last edited {formatDate(article.updatedAt)}
                {article.tags.length > 0 && (
                  <> &mdash; Tags: {article.tags.map(({ tag }) => tag.name).join(", ")}</>
                )}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
