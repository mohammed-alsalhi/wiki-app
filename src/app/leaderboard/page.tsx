import prisma from "@/lib/prisma";
import Link from "next/link";
import { config } from "@/lib/config";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  // Group revisions by userId and count
  const topContributors = await prisma.articleRevision.groupBy({
    by: ["userId"],
    where: { userId: { not: null } },
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: 50,
  });

  // Fetch user details
  const userIds = topContributors.map((r) => r.userId as string);
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, username: true, displayName: true },
  });
  const userMap = new Map(users.map((u) => [u.id, u]));

  const rows = topContributors.map((r) => ({
    user: userMap.get(r.userId as string),
    revisions: r._count.id,
  }));

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">{config.name}</Link>
        <span>/</span>
        <span className="text-foreground font-medium">Contributor Leaderboard</span>
      </div>

      <h1 className="text-2xl font-semibold mb-1">Contributor Leaderboard</h1>
      <p className="text-sm text-muted-foreground mb-6">Top editors by total revision count.</p>

      {rows.length === 0 ? (
        <p className="text-muted-foreground italic">No contributions recorded yet.</p>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground w-12">Rank</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Contributor</th>
                <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">Revisions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((row, i) => (
                <tr key={row.user?.id ?? i} className="hover:bg-muted/10 transition-colors">
                  <td className="px-4 py-2.5 text-muted-foreground font-medium">
                    {i === 0 && <span className="text-yellow-500">1</span>}
                    {i === 1 && <span className="text-slate-400">2</span>}
                    {i === 2 && <span className="text-orange-400">3</span>}
                    {i > 2 && <span>{i + 1}</span>}
                  </td>
                  <td className="px-4 py-2.5">
                    {row.user ? (
                      <Link href={`/users/${row.user.username}`} className="text-wiki-link hover:underline">
                        {row.user.displayName || row.user.username}
                      </Link>
                    ) : (
                      <span className="text-muted-foreground italic">Anonymous</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-right font-medium">{row.revisions.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
