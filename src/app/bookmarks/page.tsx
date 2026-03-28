"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Bookmark {
  id: string;
  note: string | null;
  createdAt: string;
  article: { id: string; title: string; slug: string; excerpt: string | null };
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/bookmarks")
      .then((r) => r.json())
      .then((data) => { setBookmarks(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = bookmarks.filter(
    (b) =>
      b.article.title.toLowerCase().includes(search.toLowerCase()) ||
      (b.note && b.note.toLowerCase().includes(search.toLowerCase()))
  );

  function removeBookmark(articleId: string) {
    fetch(`/api/bookmarks?articleId=${articleId}`, { method: "DELETE" })
      .then(() => setBookmarks((prev) => prev.filter((b) => b.article.id !== articleId)));
  }

  return (
    <div>
      <div className="flex items-center justify-between border-b border-border pb-1 mb-4">
        <h1
          className="text-[1.7rem] font-normal text-heading"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Bookmarks
        </h1>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search bookmarks…"
          className="border border-border rounded px-3 py-1 text-[12px] w-48 bg-transparent"
        />
      </div>

      {loading ? (
        <p className="text-[13px] text-muted">Loading…</p>
      ) : filtered.length === 0 ? (
        <p className="text-[13px] text-muted">No bookmarks yet.</p>
      ) : (
          <ul className="space-y-2">
            {filtered.map((b) => (
              <li key={b.id} className="border border-border rounded p-3 flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <Link href={`/articles/${b.article.slug}`} className="text-wiki-link font-medium hover:underline">
                    {b.article.title}
                  </Link>
                  {b.note && <p className="text-[11px] text-muted mt-0.5 italic">{b.note}</p>}
                  {b.article.excerpt && !b.note && (
                    <p className="text-[11px] text-muted mt-0.5 line-clamp-2">{b.article.excerpt}</p>
                  )}
                </div>
                <button
                  onClick={() => removeBookmark(b.article.id)}
                  className="text-[11px] text-red-500 hover:underline shrink-0"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
    </div>
  );
}
