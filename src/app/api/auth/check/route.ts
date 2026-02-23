import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";

export async function GET() {
  const admin = await isAdmin();
  return NextResponse.json({ admin });
}
