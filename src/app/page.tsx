import Link from "next/link";
import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

async function getRecentArticles() {
  return prisma.article.findMany({
    take: 10,
    orderBy: { updatedAt: "desc" },
    include: {
      category: true,
      tags: { include: { tag: true } },
    },
  });
}

async function getStats() {
  const [articles, categories, tags] = await Promise.all([
    prisma.article.count(),
    prisma.category.count(),
    prisma.tag.count(),
  ]);
  return { articles, categories, tags };
}

async function getCategories() {
  return prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { articles: true } } },
  });
}

export default async function Home() {
  const [recentArticles, stats, categories] = await Promise.all([
    getRecentArticles(),
    getStats(),
    getCategories(),
  ]);

  return (
    <div>
      {/* Main page title */}
      <h1
        className="text-[1.7rem] font-normal text-heading border-b border-border pb-1 mb-3"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        Main Page
      </h1>

      {/* Welcome portal */}
      <div className="wiki-portal mb-4">
        <div className="wiki-portal-header">
          Welcome to the World Wiki
        </div>
        <div className="wiki-portal-body">
          <p className="leading-relaxed">
            A living compendium of all known lore, peoples, places, and histories
            of the realm. This encyclopedia currently contains{" "}
            <strong>{stats.articles}</strong> articles across{" "}
            <strong>{stats.categories}</strong> categories, with{" "}
            <strong>{stats.tags}</strong> tags.
          </p>
          <p className="mt-2">
            <Link href="/articles/new">Create a new article</Link>
            {" \u2022 "}
            <Link href="/articles">Browse all articles</Link>
            {" \u2022 "}
            <Link href="/map">View the world map</Link>
          </p>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid gap-4 md:grid-cols-5">
        {/* Main column — recent changes */}
        <div className="md:col-span-3">
          <div className="wiki-portal">
            <div className="wiki-portal-header">
              Recent changes
            </div>
            <div className="wiki-portal-body p-0">
              {recentArticles.length === 0 ? (
                <div className="px-4 py-6 text-center text-muted italic">
                  No articles have been written yet.{" "}
                  <Link href="/articles/new">Create the first one.</Link>
                </div>
              ) : (
                <ul className="divide-y divide-border text-[13px]">
                  {recentArticles.map((article) => (
                    <li key={article.id} className="flex gap-2 px-3 py-1.5 hover:bg-surface-hover">
                      <span className="text-muted whitespace-nowrap text-[12px]">
                        {formatDate(article.updatedAt)}
                      </span>
                      <span>
                        <Link
                          href={`/articles/${article.slug}`}
                          className="font-medium"
                        >
                          {article.title}
                        </Link>
                        {article.category && (
                          <span className="text-muted text-[12px]">
                            {" "}({article.category.name})
                          </span>
                        )}
                        {article.excerpt && (
                          <span className="text-muted text-[12px]">
                            {" "}&ndash; {article.excerpt.substring(0, 80)}{article.excerpt.length > 80 ? "..." : ""}
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="px-3 py-1.5 text-right border-t border-border">
                <Link href="/recent-changes" className="text-[12px]">
                  View all recent changes &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right column — portals */}
        <div className="md:col-span-2 space-y-4">
          {/* Browse by category */}
          <div className="wiki-portal">
            <div className="wiki-portal-header">
              Browse by category
            </div>
            <div className="wiki-portal-body p-0">
              <ul className="divide-y divide-border text-[13px]">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={`/categories/${cat.slug}`}
                      className="flex items-center justify-between px-3 py-1.5 hover:bg-surface-hover"
                    >
                      <span>{cat.icon} {cat.name}</span>
                      <span className="text-muted text-[11px]">{cat._count.articles} articles</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Statistics */}
          <div className="wiki-portal">
            <div className="wiki-portal-header">
              Statistics
            </div>
            <div className="wiki-portal-body text-[13px]">
              <table className="w-full">
                <tbody>
                  <tr><td className="py-0.5">Total articles</td><td className="py-0.5 text-right font-bold">{stats.articles}</td></tr>
                  <tr><td className="py-0.5">Categories</td><td className="py-0.5 text-right font-bold">{stats.categories}</td></tr>
                  <tr><td className="py-0.5">Tags</td><td className="py-0.5 text-right font-bold">{stats.tags}</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Getting started notice */}
          <div className="wiki-notice">
            <strong>Getting started:</strong>{" "}
            Use the{" "}
            <Link href="/articles/new">article editor</Link>
            {" "}to create entries. Link them together with{" "}
            <code className="bg-surface-hover px-1 text-[12px]">[[Article Name]]</code>
            {" "}wiki link syntax.
          </div>
        </div>
      </div>
    </div>
  );
}
