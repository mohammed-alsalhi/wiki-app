import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateSlug } from "@/lib/utils";
import { isAdmin, requireAdmin } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const article = await prisma.article.findUnique({
    where: { id },
    include: {
      category: true,
      tags: { include: { tag: true } },
      mapMarkers: true,
    },
  });

  if (!article) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(article);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = requireAdmin(await isAdmin());
  if (denied) return denied;

  const { id } = await params;
  const body = await request.json();
  const { title, slug: newSlug, content, contentRaw, excerpt, coverImage, categoryId, tagIds, editSummary } = body;

  // Snapshot current content as a revision before updating
  const current = await prisma.article.findUnique({
    where: { id },
    select: { title: true, content: true, contentRaw: true },
  });
  if (current) {
    await prisma.articleRevision.create({
      data: {
        articleId: id,
        title: current.title,
        content: current.content,
        contentRaw: current.contentRaw,
        editSummary: editSummary || null,
      },
    });
  }

  // Delete existing tags and recreate
  if (tagIds !== undefined) {
    await prisma.articleTag.deleteMany({ where: { articleId: id } });
  }

  // Handle slug change
  let slugUpdate: { slug: string } | Record<string, never> = {};
  if (newSlug !== undefined) {
    const slug = generateSlug(newSlug);
    if (slug) {
      const existing = await prisma.article.findFirst({
        where: { slug, NOT: { id } },
      });
      if (existing) {
        return NextResponse.json(
          { error: "An article with that slug already exists" },
          { status: 409 }
        );
      }
      slugUpdate = { slug };
    }
  }

  const article = await prisma.article.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...slugUpdate,
      ...(content !== undefined && { content }),
      ...(contentRaw !== undefined && { contentRaw }),
      ...(excerpt !== undefined && { excerpt }),
      ...(coverImage !== undefined && { coverImage }),
      ...(categoryId !== undefined && { categoryId: categoryId || null }),
      ...(tagIds !== undefined && {
        tags: { create: tagIds.map((tagId: string) => ({ tagId })) },
      }),
    },
    include: {
      category: true,
      tags: { include: { tag: true } },
    },
  });

  return NextResponse.json(article);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = requireAdmin(await isAdmin());
  if (denied) return denied;

  const { id } = await params;
  await prisma.article.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
