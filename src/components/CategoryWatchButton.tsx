"use client";

import { useState, useEffect } from "react";

export default function CategoryWatchButton({ categoryId }: { categoryId: string }) {
  const [watching, setWatching] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/category-watch?categoryId=${categoryId}`)
      .then((r) => r.json())
      .then((d) => setWatching(d.watching ?? false))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [categoryId]);

  async function toggle() {
    setLoading(true);
    const res = await fetch("/api/category-watch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categoryId }),
    });
    if (res.ok) {
      const d = await res.json();
      setWatching(d.watching);
    }
    setLoading(false);
  }

  if (loading) return null;

  return (
    <button
      onClick={toggle}
      className={`h-6 px-2 text-[11px] border rounded transition-colors ${
        watching
          ? "border-accent bg-accent/10 text-accent"
          : "border-border text-muted hover:bg-surface-hover hover:text-foreground"
      }`}
      title={watching ? "Stop watching this category" : "Watch this category for new articles"}
    >
      {watching ? "Watching" : "Watch"}
    </button>
  );
}
