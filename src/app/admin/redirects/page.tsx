import { isAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import RedirectsManager from "./RedirectsManager";

export const dynamic = "force-dynamic";

export default async function AdminRedirectsPage() {
  const admin = await isAdmin();
  if (!admin) redirect("/login");

  const redirects = await prisma.redirect.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground">
          Admin
        </Link>
        <span className="text-muted-foreground">/</span>
        <h1 className="text-xl font-semibold">Redirects</h1>
      </div>

      <p className="text-sm text-muted-foreground mb-6">
        Redirects are created automatically when an article slug is renamed. You can also add manual
        redirects here.
      </p>

      <RedirectsManager initialRedirects={redirects} />
    </div>
  );
}
