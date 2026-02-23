import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const mapId = request.nextUrl.searchParams.get("mapId") || "default";

  const markers = await prisma.mapMarker.findMany({
    where: { mapId },
    include: {
      article: { select: { id: true, title: true, slug: true, coverImage: true } },
    },
  });

  return NextResponse.json(markers);
}

export async function POST(request: NextRequest) {
  const { label, x, y, icon, mapId, articleId } = await request.json();

  if (!label || x === undefined || y === undefined) {
    return NextResponse.json({ error: "Label, x, and y are required" }, { status: 400 });
  }

  const marker = await prisma.mapMarker.create({
    data: {
      label,
      x,
      y,
      icon: icon || null,
      mapId: mapId || "default",
      articleId: articleId || null,
    },
    include: {
      article: { select: { id: true, title: true, slug: true } },
    },
  });

  return NextResponse.json(marker, { status: 201 });
}
