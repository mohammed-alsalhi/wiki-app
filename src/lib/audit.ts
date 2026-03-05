import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export type AuditAction =
  | "article.create"
  | "article.delete"
  | "article.status_change"
  | "article.restore"
  | "category.create"
  | "category.delete"
  | "user.role_change"
  | "user.delete"
  | "revision.revert"
  | "discussion.delete";

export async function logAudit(
  action: AuditAction,
  entity: { type: string; id?: string; label?: string },
  metadata?: Record<string, unknown>
) {
  try {
    const session = await getSession();
    await prisma.auditLog.create({
      data: {
        userId: session?.id ?? null,
        username: session?.username ?? null,
        action,
        entityType: entity.type,
        entityId: entity.id ?? null,
        entityLabel: entity.label ?? null,
        metadata: metadata ? (metadata as import("@prisma/client").Prisma.InputJsonValue) : undefined,
      },
    });
  } catch {
    // Audit logging must never break the main operation
  }
}
