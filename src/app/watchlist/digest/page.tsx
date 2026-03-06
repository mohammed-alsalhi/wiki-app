"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

type DigestEntry = {
  articleId: string;
  articleTitle: string;
  articleSlug: string;
  editCount: number;
  editors: string[];
  lastEdit: string;
};

export default function WatchlistDigestPage() {
  const [entries, setEntries] = useState<DigestEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [runResult, setRunResult] = useState<string | null>(null);

  useEffect(() => {
    loadDigest();
  }, []);

  async function loadDigest() {
    setLoading(true);
    const res = await fetch("/api/watchlist/digest");
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) setEntries(data);
    }
    setLoading(false);
  }

  async function runDigest() {
    setRunning(true);
    setRunResult(null);
    const res = await fetch("/api/cron/digest", { method: "POST" });
    const data = await res.json();
    setRunResult(`Sent ${data.notified ?? 0} notification${data.notified !== 1 ? "s" : ""} across ${data.articlesProcessed ?? 0} articles.`);
    setRunning(false);
  }

  return (
    <div>
      <h1
        className="text-[1.7rem] font-normal text-heading border-b border-border pb-1 mb-1"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        Watchlist digest
      </h1>
      <p className="text-[12px] text-muted mb-4">
        Changes to your watched articles in the past 7 days.
      </p>

      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={runDigest}
          disabled={running}
          className="h-6 px-2 text-[11px] border border-border rounded hover:bg-surface-hover disabled:opacity-50"
        >
          {running ? "Running…" : "Generate digest now"}
        </button>
        {runResult && <span className="text-[12px] text-muted">{runResult}</span>}
      </div>

      {loading ? (
        <p className="text-[13px] text-muted italic">Loading…</p>
      ) : entries.length === 0 ? (
        <div className="wiki-notice">
          No changes to your watched articles in the past 7 days.{" "}
          <Link href="/watchlist">View your watchlist.</Link>
        </div>
      ) : (
        <table className="w-full border-collapse border border-border bg-surface text-[13px]">
          <thead>
            <tr className="bg-surface-hover">
              <th className="border border-border px-3 py-1.5 text-left font-bold text-heading">Article</th>
              <th className="border border-border px-3 py-1.5 text-left font-bold text-heading w-16">Edits</th>
              <th className="border border-border px-3 py-1.5 text-left font-bold text-heading">Editors</th>
              <th className="border border-border px-3 py-1.5 text-left font-bold text-heading w-28">Last edit</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e.articleId} className="hover:bg-surface-hover">
                <td className="border border-border px-3 py-1.5">
                  <Link href={`/articles/${e.articleSlug}`} className="font-medium">
                    {e.articleTitle}
                  </Link>
                </td>
                <td className="border border-border px-3 py-1.5 text-center">{e.editCount}</td>
                <td className="border border-border px-3 py-1.5 text-muted text-[12px]">
                  {e.editors.slice(0, 3).join(", ")}
                  {e.editors.length > 3 && ` +${e.editors.length - 3} more`}
                </td>
                <td className="border border-border px-3 py-1.5 text-muted text-[12px]">
                  {new Date(e.lastEdit).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <p className="mt-4 text-[13px]">
        <Link href="/watchlist">&larr; Watchlist</Link>
      </p>
    </div>
  );
}

export const dynamic = "force-dynamic";
