"use client";

import { useState, useEffect } from "react";

const REACTIONS = [
  { key: "helpful", emoji: "👍", label: "Helpful" },
  { key: "insightful", emoji: "💡", label: "Insightful" },
  { key: "outdated", emoji: "⏰", label: "Outdated" },
  { key: "confusing", emoji: "❓", label: "Confusing" },
] as const;

interface Props {
  articleId: string;
}

type Counts = Record<string, number>;

export default function ArticleReactionBar({ articleId }: Props) {
  const [counts, setCounts] = useState<Counts>({});
  const [voted, setVoted] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/articles/${articleId}/react`)
      .then((r) => r.json())
      .then((data) => setCounts(data || {}))
      .catch(() => {});
  }, [articleId]);

  async function react(reaction: string) {
    if (voted === reaction) return;
    setVoted(reaction);
    setCounts((prev) => ({ ...prev, [reaction]: (prev[reaction] ?? 0) + 1 }));
    await fetch(`/api/articles/${articleId}/react`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reaction }),
    });
  }

  return (
    <div className="flex items-center gap-1 mt-4 flex-wrap">
      <span className="text-xs text-muted mr-1">Was this helpful?</span>
      {REACTIONS.map(({ key, emoji, label }) => (
        <button
          key={key}
          onClick={() => react(key)}
          title={label}
          className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs transition-colors ${
            voted === key
              ? "border-accent bg-accent/10 text-accent"
              : "border-border text-muted hover:border-accent/40 hover:text-foreground"
          }`}
        >
          {emoji}
          {counts[key] ? <span>{counts[key]}</span> : null}
        </button>
      ))}
    </div>
  );
}
