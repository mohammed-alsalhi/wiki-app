import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const marker = await prisma.mapMarker.update({
    where: { id },
    data: {
      ...(body.label !== undefined && { label: body.label }),
      ...(body.x !== undefined && { x: body.x }),
      ...(body.y !== undefined && { y: body.y }),
      ...(body.icon !== undefined && { icon: body.icon }),
      ...(body.articleId !== undefined && { articleId: body.articleId || null }),
    },
    include: {
      article: { select: { id: true, title: true, slug: true } },
    },
  });

  return NextResponse.json(marker);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.mapMarker.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
