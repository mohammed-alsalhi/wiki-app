import { redirect } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function MentionsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const username = session.username;

  // Find all discussions where content contains @username
  const mentions = await prisma.discussion.findMany({
    where: { content: { contains: `@${username}`, mode: "insensitive" } },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      article: { select: { title: true, slug: true } },
      user: { select: { username: true, displayName: true } },
    },
  });

  return (
    <div>
      <h1
        className="text-[1.7rem] font-normal text-heading border-b border-border pb-1 mb-4"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        Mentions
      </h1>
      <p className="text-[12px] text-muted mb-4">
        Discussions that mention <strong>@{username}</strong>
      </p>

      {mentions.length === 0 ? (
        <p className="text-[13px] text-muted italic">No mentions yet.</p>
      ) : (
        <div className="space-y-3">
          {mentions.map((m) => (
            <div key={m.id} className="border border-border bg-surface rounded p-3">
              <div className="flex items-start justify-between gap-3 mb-1.5">
                <div className="text-[12px] text-muted">
                  <span className="font-semibold text-fg">
                    {m.user?.displayName || m.user?.username || m.author}
                  </span>
                  {" mentioned you in "}
                  <Link
                    href={`/articles/${m.article.slug}/discussion`}
                    className="text-wiki-link hover:underline"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {m.article.title}
                  </Link>
                </div>
                <span className="text-[11px] text-muted shrink-0">{formatDate(m.createdAt)}</span>
              </div>
              <p className="text-[13px] text-muted line-clamp-3 whitespace-pre-wrap">{m.content}</p>
              <Link
                href={`/articles/${m.article.slug}/discussion`}
                className="text-[11px] text-wiki-link hover:underline mt-1.5 inline-block"
              >
                View discussion &rarr;
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
