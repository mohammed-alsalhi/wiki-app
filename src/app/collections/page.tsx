import Link from "next/link";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export default async function CollectionsPage() {
  const user = await getSession();

  const collections = await prisma.smartCollection.findMany({
    where: user
      ? { OR: [{ isPublic: true }, { userId: user.id }] }
      : { isPublic: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between border-b border-border pb-1 mb-4">
        <h1
          className="text-[1.7rem] font-normal text-heading"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Smart Collections
        </h1>
        {user && (
          <Link
            href="/collections/new"
            className="flex items-center gap-1 h-6 px-2 text-[11px] border border-border rounded text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
          >
            New Collection
          </Link>
        )}
      </div>

      {collections.length === 0 ? (
        <p className="text-[13px] text-muted">No collections yet.</p>
      ) : (
        <div className="grid gap-3">
          {collections.map((col) => (
            <div key={col.id} className="border border-border rounded p-3 hover:border-accent/40 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <Link href={`/collections/${col.id}`} className="text-wiki-link font-medium hover:underline">
                    {col.name}
                  </Link>
                  {col.isPublic && (
                    <span className="ml-2 text-[10px] bg-surface px-1.5 py-0.5 rounded border border-border text-muted">
                      Public
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export const dynamic = "force-dynamic";
