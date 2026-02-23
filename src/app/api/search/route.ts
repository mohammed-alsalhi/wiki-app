import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim();
  const limit = parseInt(request.nextUrl.searchParams.get("limit") || "20");

  if (!query || query.length < 2) {
    return NextResponse.json([]);
  }

  const select = {
    id: true,
    title: true,
    slug: true,
    excerpt: true,
    category: { select: { name: true, icon: true } },
  };

  // Split into words for multi-word search (each word must appear somewhere)
  const words = query.split(/\s+/).filter((w) => w.length >= 2);

  const where =
    words.length > 1
      ? {
          // Every word must appear in title, content, or excerpt
          AND: words.map((word) => ({
            OR: [
              { title: { contains: word, mode: "insensitive" as const } },
              { content: { contains: word, mode: "insensitive" as const } },
              { excerpt: { contains: word, mode: "insensitive" as const } },
            ],
          })),
        }
      : {
          OR: [
            { title: { contains: query, mode: "insensitive" as const } },
            { content: { contains: query, mode: "insensitive" as const } },
            { excerpt: { contains: query, mode: "insensitive" as const } },
          ],
        };

  // Fetch more than needed so we can re-sort by relevance
  const articles = await prisma.article.findMany({
    where,
    take: limit * 3,
    select,
  });

  // Rank by relevance: exact title > title starts with > title contains > content only
  const queryLower = query.toLowerCase();
  articles.sort((a, b) => {
    return relevanceScore(b.title, queryLower) - relevanceScore(a.title, queryLower);
  });

  return NextResponse.json(articles.slice(0, limit));
}

function relevanceScore(title: string, query: string): number {
  const t = title.toLowerCase();
  if (t === query) return 100;           // exact match
  if (t.startsWith(query)) return 80;    // title starts with query
  if (t.includes(query)) return 60;      // title contains query
  return 0;                              // content-only match
}
