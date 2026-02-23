import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const COOKIE_NAME = "admin_token";

export async function isAdmin(): Promise<boolean> {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return true; // No secret configured = no auth required (local dev)

  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value === secret;
}

export function requireAdmin(isAuthed: boolean): NextResponse | null {
  if (!isAuthed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
