import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

// POST — stamp lastVerifiedAt on an article
export async function POST(_req: NextRequest, { params }: Params) {
  const admin = await isAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const article = await prisma.article.update({
    where: { id },
    data: { lastVerifiedAt: new Date() },
    select: { lastVerifiedAt: true },
  });

  return NextResponse.json({ lastVerifiedAt: article.lastVerifiedAt });
}
