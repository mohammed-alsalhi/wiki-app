import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin, isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const denied = requireAdmin(await isAdmin());
  if (denied) return denied;

  const articles = await prisma.article.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      content: true,
      contentRaw: true,
      excerpt: true,
      status: true,
      isPinned: true,
      isFeatured: true,
      coverImage: true,
      infobox: true,
      redirectTo: true,
      createdAt: true,
      updatedAt: true,
      category: { select: { name: true, slug: true } },
      tags: { select: { tag: { select: { name: true, slug: true } } } },
    },
    orderBy: { title: "asc" },
  });

  const payload = articles.map((a) => ({
    ...a,
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
    tags: a.tags.map((t) => t.tag),
  }));

  return new NextResponse(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="wiki-export-${new Date().toISOString().slice(0, 10)}.json"`,
    },
  });
}
