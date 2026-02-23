import Link from "next/link";
import prisma from "@/lib/prisma";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { articles: true } } },
  });

  return (
    <div>
      <h1
        className="text-[1.7rem] font-normal text-heading border-b border-border pb-1 mb-3"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        Categories
      </h1>

      <p className="text-[13px] text-muted mb-4">
        The following is a list of all categories in the encyclopedia.
        Select a category to browse its articles.
      </p>

      <table className="w-full max-w-xl border-collapse border border-border bg-surface text-[13px]">
        <thead>
          <tr className="bg-surface-hover">
            <th className="border border-border px-3 py-1.5 text-left font-bold text-heading">Category</th>
            <th className="border border-border px-3 py-1.5 text-right font-bold text-heading w-24">Articles</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id} className="hover:bg-surface-hover">
              <td className="border border-border px-3 py-1.5">
                <Link href={`/categories/${cat.slug}`} className="font-medium">
                  {cat.icon} {cat.name}
                </Link>
                {cat.description && (
                  <span className="text-muted text-[12px]"> &ndash; {cat.description}</span>
                )}
              </td>
              <td className="border border-border px-3 py-1.5 text-right text-muted">
                {cat._count.articles}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
