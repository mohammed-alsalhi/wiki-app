import Link from "next/link";
import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

type Props = {
  searchParams: Promise<{ category?: string; tag?: string; page?: string }>;
};

export default async function ArticlesPage({ searchParams }: Props) {
  const { category, tag, page: pageStr } = await searchParams;
  const page = parseInt(pageStr || "1");
  const limit = 20;

  const where: Record<string, unknown> = {};
  if (category) where.category = { slug: category };
  if (tag) where.tags = { some: { tag: { slug: tag } } };

  const [articles, total, categories, tags] = await Promise.all([
    prisma.article.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { updatedAt: "desc" },
      include: {
        category: true,
        tags: { include: { tag: true } },
      },
    }),
    prisma.article.count({ where }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <h1
        className="text-[1.7rem] font-normal text-heading border-b border-border pb-1 mb-1"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        All articles
      </h1>
      <p className="text-[12px] text-muted mb-3">
        {total} article{total !== 1 ? "s" : ""} in the encyclopedia
        {category && <> &mdash; filtered by category</>}
        {tag && <> &mdash; filtered by tag</>}
      </p>

      {/* Filters */}
      <div className="wiki-notice mb-3">
        <strong>Filter by category: </strong>
        <Link
          href="/articles"
          className={!category && !tag ? "font-bold" : ""}
        >
          All
        </Link>
        {categories.map((cat) => (
          <span key={cat.id}>
            {" | "}
            <Link
              href={`/articles?category=${cat.slug}`}
              className={category === cat.slug ? "font-bold" : ""}
            >
              {cat.icon} {cat.name}
            </Link>
          </span>
        ))}
        {tags.length > 0 && (
          <>
            <br />
            <strong>Filter by tag: </strong>
            {tags.map((t, i) => (
              <span key={t.id}>
                {i > 0 && " | "}
                <Link
                  href={`/articles?tag=${t.slug}`}
                  className={tag === t.slug ? "font-bold" : ""}
                >
                  {t.name}
                </Link>
              </span>
            ))}
          </>
        )}
      </div>

      {/* Article list — wiki-style table */}
      {articles.length === 0 ? (
        <div className="border border-border bg-surface p-8 text-center text-muted italic">
          No articles found. <Link href="/articles/new">Create one.</Link>
        </div>
      ) : (
        <table className="w-full border-collapse border border-border bg-surface text-[13px]">
          <thead>
            <tr className="bg-surface-hover">
              <th className="border border-border px-3 py-1.5 text-left font-bold text-heading">Article</th>
              <th className="border border-border px-3 py-1.5 text-left font-bold text-heading w-32">Category</th>
              <th className="border border-border px-3 py-1.5 text-left font-bold text-heading w-28">Last edited</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id} className="hover:bg-surface-hover">
                <td className="border border-border px-3 py-1.5">
                  <Link href={`/articles/${article.slug}`} className="font-medium">
                    {article.title}
                  </Link>
                  {article.excerpt && (
                    <span className="text-muted text-[12px]">
                      {" "}&ndash; {article.excerpt.substring(0, 100)}{article.excerpt.length > 100 ? "..." : ""}
                    </span>
                  )}
                </td>
                <td className="border border-border px-3 py-1.5 text-muted">
                  {article.category ? (
                    <Link href={`/categories/${article.category.slug}`}>
                      {article.category.icon} {article.category.name}
                    </Link>
                  ) : (
                    <span className="italic">None</span>
                  )}
                </td>
                <td className="border border-border px-3 py-1.5 text-muted text-[12px]">
                  {formatDate(article.updatedAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-3 text-[13px] text-muted">
          Pages:{" "}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <span key={p}>
              {p > 1 && " | "}
              <Link
                href={`/articles?${new URLSearchParams({
                  ...(category ? { category } : {}),
                  ...(tag ? { tag } : {}),
                  page: p.toString(),
                })}`}
                className={p === page ? "font-bold" : ""}
              >
                {p}
              </Link>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
