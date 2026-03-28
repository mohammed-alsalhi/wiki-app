import prisma from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function SeriesIndexPage() {
  const allSeries = await prisma.articleSeries.findMany({
    orderBy: { name: "asc" },
    include: {
      members: {
        orderBy: { position: "asc" },
        take: 1,
        include: { article: { select: { slug: true } } },
      },
      _count: { select: { members: true } },
    },
  });

  return (
    <div>
      <h1
        className="text-[1.7rem] font-normal text-heading border-b border-border pb-1 mb-4"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        Article Series
      </h1>
      {allSeries.length === 0 ? (
        <p className="text-[13px] text-muted italic">No series yet.</p>
      ) : (
        <div className="space-y-3">
          {allSeries.map((s) => (
            <div key={s.id} className="border border-border rounded-lg p-4 hover:bg-muted/30">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Link href={`/series/${s.slug}`} className="font-medium hover:underline">
                    {s.name}
                  </Link>
                  {s.description && (
                    <p className="text-sm text-muted mt-0.5">{s.description}</p>
                  )}
                </div>
                <span className="text-xs text-muted flex-shrink-0">
                  {s._count.members} article{s._count.members !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
