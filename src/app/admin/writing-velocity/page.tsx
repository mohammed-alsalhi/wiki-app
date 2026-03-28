"use client";

import { useEffect, useState } from "react";

type Week = { week: string; words: number };

export default function WritingVelocityPage() {
  const [data, setData] = useState<Week[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/writing-velocity")
      .then((r) => r.json())
      .then((d) => { setData(Array.isArray(d) ? d : []); setLoading(false); });
  }, []);

  if (loading) return <p className="text-[13px] text-muted">Loading…</p>;

  const maxWords = Math.max(...data.map((w) => w.words), 1);
  const totalWords = data.reduce((sum, w) => sum + w.words, 0);
  const avgWords = Math.round(totalWords / (data.length || 1));

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold text-heading mb-1">Writing Velocity</h1>
      <p className="text-[13px] text-muted mb-4">Words added to the wiki per week (last 12 weeks, from revision history).</p>

      <div className="flex gap-4 mb-4 text-[12px]">
        <div className="border border-border rounded px-3 py-2 bg-surface">
          <div className="text-muted">Total (12 weeks)</div>
          <div className="text-lg font-semibold text-heading">{totalWords.toLocaleString()}</div>
        </div>
        <div className="border border-border rounded px-3 py-2 bg-surface">
          <div className="text-muted">Weekly average</div>
          <div className="text-lg font-semibold text-heading">{avgWords.toLocaleString()}</div>
        </div>
      </div>

      <div className="border border-border rounded p-4 bg-surface">
        <div className="flex items-end gap-1.5 h-32">
          {data.map((w) => {
            const pct = maxWords > 0 ? (w.words / maxWords) * 100 : 0;
            const label = new Date(w.week + "T00:00:00Z").toLocaleDateString(undefined, { month: "short", day: "numeric" });
            return (
              <div key={w.week} className="flex-1 flex flex-col items-center gap-1" title={`${label}: ${w.words.toLocaleString()} words`}>
                <div
                  className="w-full rounded-t bg-accent/70 hover:bg-accent transition-colors"
                  style={{ height: `${Math.max(pct, 2)}%` }}
                />
                <span className="text-[9px] text-muted rotate-45 origin-left hidden sm:block">{label}</span>
              </div>
            );
          })}
        </div>
        <div className="mt-2 text-[11px] text-muted text-center">Each bar = one week</div>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
