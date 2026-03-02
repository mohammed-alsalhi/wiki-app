"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ArticleStatusBadge from "@/components/ArticleStatusBadge";

type ReviewArticle = {
  id: string;
  title: string;
  slug: string;
  status: string;
  updatedAt: string;
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reviewArticles, setReviewArticles] = useState<ReviewArticle[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      const r = await fetch("/api/auth/check");
      const data = await r.json();
      setIsAdmin(data.admin);
      setLoading(false);
      if (data.admin) {
        const [draftRes, reviewRes] = await Promise.all([
          fetch("/api/articles?status=draft&limit=50"),
          fetch("/api/articles?status=review&limit=50"),
        ]);
        const items: ReviewArticle[] = [];
        if (draftRes.ok) {
          const d = await draftRes.json();
          items.push(...d.articles);
        }
        if (reviewRes.ok) {
          const d = await reviewRes.json();
          items.push(...d.articles);
        }
        items.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        setReviewArticles(items);
      }
    }
    checkAuth();
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      setIsAdmin(true);
      setPassword("");
      router.refresh();
    } else {
      setError("Invalid password");
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setIsAdmin(false);
    router.refresh();
  }

  if (loading) {
    return <div className="py-8 text-center text-muted italic text-[13px]">Loading...</div>;
  }

  return (
    <div>
      <h1
        className="text-[1.5rem] font-normal text-heading border-b border-border pb-1 mb-4"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        Admin
      </h1>

      {isAdmin ? (
        <div>
          <div className="wiki-notice mb-4">
            You are logged in as admin. You can create, edit, and delete articles.
          </div>
          <button
            onClick={handleLogout}
            className="border border-border bg-surface-hover px-4 py-1.5 text-[13px] text-foreground hover:bg-surface"
          >
            Log out
          </button>

          {/* Articles needing review */}
          {reviewArticles.length > 0 && (
            <div className="mt-6">
              <h2
                className="text-base font-normal text-heading border-b border-border pb-1 mb-2"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Articles needing review ({reviewArticles.length})
              </h2>
              <table className="w-full border-collapse border border-border bg-surface text-[13px]">
                <thead>
                  <tr className="bg-surface-hover">
                    <th className="border border-border px-3 py-1.5 text-left font-bold text-heading">Article</th>
                    <th className="border border-border px-3 py-1.5 text-left font-bold text-heading w-24">Status</th>
                    <th className="border border-border px-3 py-1.5 text-left font-bold text-heading w-28">Last edited</th>
                  </tr>
                </thead>
                <tbody>
                  {reviewArticles.map((article) => (
                    <tr key={article.id} className="hover:bg-surface-hover">
                      <td className="border border-border px-3 py-1.5">
                        <Link href={`/articles/${article.slug}/edit`} className="font-medium">
                          {article.title}
                        </Link>
                      </td>
                      <td className="border border-border px-3 py-1.5">
                        <ArticleStatusBadge status={article.status} />
                      </td>
                      <td className="border border-border px-3 py-1.5 text-muted text-[12px]">
                        {new Date(article.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div>
          <p className="text-[13px] text-foreground mb-4">
            Enter the admin password to enable editing.
          </p>
          <form onSubmit={handleLogin} className="max-w-sm space-y-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password..."
              required
              className="w-full border border-border bg-surface px-3 py-1.5 text-[14px] text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
            />
            {error && (
              <p className="text-[12px] text-wiki-link-broken">{error}</p>
            )}
            <button
              type="submit"
              className="bg-accent px-4 py-1.5 text-[13px] font-bold text-white hover:bg-accent-hover"
            >
              Log in
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
