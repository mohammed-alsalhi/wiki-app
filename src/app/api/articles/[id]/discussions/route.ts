import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isAdmin, requireAdmin } from "@/lib/auth";
import { logAudit } from "@/lib/audit";

async function createMentionNotifications(
  content: string,
  articleId: string,
  authorUsername: string
) {
  const mentionRegex = /@([\w-]+)/g;
  const mentioned = [...new Set([...content.matchAll(mentionRegex)].map((m) => m[1]))];
  if (mentioned.length === 0) return;

  const users = await prisma.user.findMany({
    where: { username: { in: mentioned } },
    select: { id: true, username: true },
  });

  await prisma.notification.createMany({
    data: users.map((u) => ({
      userId: u.id,
      articleId,
      type: "mention",
      message: `${authorUsername} mentioned you in a discussion comment`,
    })),
    skipDuplicates: true,
  });
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const discussions = await prisma.discussion.findMany({
    where: { articleId: id, parentId: null },
    orderBy: { createdAt: "asc" },
    include: {
      replies: {
        orderBy: { createdAt: "asc" },
        include: {
          replies: {
            orderBy: { createdAt: "asc" },
          },
        },
      },
    },
  });
  return NextResponse.json(discussions);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { author, content, parentId } = body;

  if (!content?.trim()) {
    return NextResponse.json({ error: "Content is required" }, { status: 400 });
  }

  const trimmedAuthor = author?.trim() || "Anonymous";
  const trimmedContent = content.trim();

  const discussion = await prisma.discussion.create({
    data: {
      articleId: id,
      author: trimmedAuthor,
      content: trimmedContent,
      parentId: parentId ?? null,
    },
    include: {
      replies: true,
    },
  });

  await createMentionNotifications(trimmedContent, id, trimmedAuthor);

  return NextResponse.json(discussion, { status: 201 });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = requireAdmin(await isAdmin());
  if (denied) return denied;

  const { searchParams } = request.nextUrl;
  const discussionId = searchParams.get("discussionId");

  if (!discussionId) {
    return NextResponse.json({ error: "discussionId is required" }, { status: 400 });
  }

  await prisma.discussion.delete({ where: { id: discussionId } });
  await logAudit("discussion.delete", { type: "discussion", id: discussionId });
  return NextResponse.json({ success: true });
}

export const dynamic = "force-dynamic";
