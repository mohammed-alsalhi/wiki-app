"use client";

import { useState, useEffect } from "react";

type Category = { id: string; name: string; slug: string; _count?: { articles: number } };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [sourceId, setSourceId] = useState("");
  const [targetId, setTargetId] = useState("");
  const [loading, setLoading] = useState(true);
  const [merging, setMerging] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  async function handleMerge(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);
    setError(null);
    if (!sourceId || !targetId) return;

    const source = categories.find((c) => c.id === sourceId);
    const target = categories.find((c) => c.id === targetId);
    if (
      !confirm(
        `Merge "${source?.name}" into "${target?.name}"?\n\nAll articles and sub-categories from "${source?.name}" will be reassigned to "${target?.name}", and "${source?.name}" will be permanently deleted.`
      )
    )
      return;

    setMerging(true);
    try {
      const res = await fetch("/api/admin/categories/merge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceId, targetId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Merge failed");
      } else {
        setResult(
          `Merged "${data.sourceName}" into "${data.targetName}" — ${data.articlesReassigned} article(s) reassigned.`
        );
        setSourceId("");
        setTargetId("");
        // Refresh category list
        const updated = await fetch("/api/categories").then((r) => r.json());
        setCategories(Array.isArray(updated) ? updated : []);
      }
    } catch {
      setError("Merge failed. Please try again.");
    } finally {
      setMerging(false);
    }
  }

  return (
    <div>
      <h1
        className="text-[1.4rem] font-normal text-heading border-b border-border pb-1 mb-4"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        Category Merge
      </h1>

      <div className="wiki-notice mb-4">
        Merging moves all articles and sub-categories from the source into the target, then
        permanently deletes the source category. This cannot be undone.
      </div>

      {loading ? (
        <p className="text-[13px] text-muted italic">Loading categories…</p>
      ) : (
        <form onSubmit={handleMerge} className="max-w-md space-y-4">
          <div>
            <label className="block text-[12px] text-muted mb-1">
              Source category <span className="text-red-500">(will be deleted)</span>
            </label>
            <select
              value={sourceId}
              onChange={(e) => setSourceId(e.target.value)}
              required
              className="w-full border border-border bg-background px-2 py-1.5 text-[13px] text-foreground focus:border-accent focus:outline-none"
            >
              <option value="">Select source…</option>
              {categories
                .filter((c) => c.id !== targetId)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-[12px] text-muted mb-1">
              Target category <span className="text-green-600">(articles merged into this)</span>
            </label>
            <select
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              required
              className="w-full border border-border bg-background px-2 py-1.5 text-[13px] text-foreground focus:border-accent focus:outline-none"
            >
              <option value="">Select target…</option>
              {categories
                .filter((c) => c.id !== sourceId)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={merging || !sourceId || !targetId}
            className="h-6 px-3 text-[11px] border border-red-400 rounded bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-40"
          >
            {merging ? "Merging…" : "Merge categories"}
          </button>

          {result && (
            <p className="text-[13px] text-green-700 border border-green-200 bg-green-50 px-3 py-2 rounded">
              {result}
            </p>
          )}
          {error && (
            <p className="text-[13px] text-red-700 border border-red-200 bg-red-50 px-3 py-2 rounded">
              {error}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
