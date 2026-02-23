import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) notFound();

  const articles = await prisma.article.findMany({
    where: { categoryId: category.id },
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
        Category: {category.icon} {category.name}
      </h1>
      {category.description && (
        <p className="text-[13px] text-muted italic mb-2">{category.description}</p>
      )}
      <p className="text-[12px] text-muted mb-3">
        {articles.length} article{articles.length !== 1 ? "s" : ""} in this category
      </p>

      {articles.length === 0 ? (
        <div className="wiki-notice">
          This category has no articles yet. <Link href="/articles/new">Create one.</Link>
        </div>
      ) : (
        <div>
          <h2
            className="text-base font-normal text-heading border-b border-border pb-0.5 mb-2"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Articles in this category
          </h2>
          <table className="w-full border-collapse border border-border bg-surface text-[13px]">
            <thead>
              <tr className="bg-surface-hover">
                <th className="border border-border px-3 py-1.5 text-left font-bold text-heading">Article</th>
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
                  <td className="border border-border px-3 py-1.5 text-muted text-[12px]">
                    {formatDate(article.updatedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-4 text-[13px]">
        <Link href="/categories">&larr; All categories</Link>
      </p>
    </div>
  );
}
