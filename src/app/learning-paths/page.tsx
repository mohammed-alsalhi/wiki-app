import Link from "next/link";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export default async function LearningPathsPage() {
  const session = await getSession();
  const paths = await prisma.learningPath.findMany({
    where: { isPublic: true },
    include: {
      author: { select: { username: true, displayName: true } },
      _count: { select: { articles: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between border-b border-border pb-1 mb-4">
        <h1
          className="text-[1.7rem] font-normal text-heading"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Learning Paths
        </h1>
        {session && (
          <Link
            href="/learning-paths/new"
            className="flex items-center gap-1 h-6 px-2 text-[11px] border border-border rounded text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
          >
            Create Path
          </Link>
        )}
      </div>

      {paths.length === 0 ? (
        <p className="text-[13px] text-muted italic">No learning paths yet. Create one to guide readers through a topic.</p>
      ) : (
        <div className="space-y-4">
          {paths.map((path) => (
            <Link
              key={path.id}
              href={`/learning-paths/${path.id}`}
              className="block border border-border rounded p-4 hover:bg-surface-hover transition-colors"
            >
              <div className="font-medium text-foreground">{path.name}</div>
              {path.description && (
                <div className="text-sm text-muted mt-1 line-clamp-2">{path.description}</div>
              )}
              <div className="flex items-center gap-3 mt-2 text-xs text-muted">
                <span>{path._count.articles} articles</span>
                {path.author && <span>by {path.author.displayName || path.author.username}</span>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export const dynamic = "force-dynamic";
