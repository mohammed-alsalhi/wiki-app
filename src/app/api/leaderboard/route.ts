import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      displayName: true,
      createdAt: true,
      _count: { select: { revisions: true } },
    },
    orderBy: { revisions: { _count: "desc" } },
    take: 50,
  });

  return NextResponse.json(users);
}
