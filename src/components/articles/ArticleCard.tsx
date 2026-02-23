import Link from "next/link";
import { formatDate } from "@/lib/utils";

type ArticleCardProps = {
  article: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    coverImage: string | null;
    updatedAt: Date;
    category: { name: string; slug: string; icon: string | null } | null;
    tags: { tag: { id: string; name: string; slug: string; color: string | null } }[];
  };
};

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group flex flex-col border border-border bg-surface transition-colors hover:bg-surface-hover"
    >
      {article.coverImage && (
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={article.coverImage}
            alt={article.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-4">
        <h3
          className="font-semibold text-wiki-link group-hover:underline"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="mt-1.5 line-clamp-2 text-sm text-muted leading-relaxed">
            {article.excerpt}
          </p>
        )}
        <div className="mt-auto pt-3 flex items-center justify-between text-[11px] text-muted">
          <span>
            {article.category && (
              <>{article.category.icon} {article.category.name}</>
            )}
          </span>
          <span>{formatDate(article.updatedAt)}</span>
        </div>
      </div>
    </Link>
  );
}
