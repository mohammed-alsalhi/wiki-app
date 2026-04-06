"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  categoryId: string;
  categoryName: string;
  articleCount: number;
};

export default function SynthesizeButton({ categoryId, categoryName, articleCount }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ title: string; html: string; articleTitles: string[] } | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSynthesize = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    setOpen(true);
    try {
      const res = await fetch("/api/ai/synthesize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryId }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setError(d.error || "Synthesis failed");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setResult(data);
    } catch {
      setError("Network error");
    }
    setLoading(false);
  };

  const handleCreateArticle = () => {
    if (!result) return;
    try {
      sessionStorage.setItem(
        "wiki_synthesize_draft",
        JSON.stringify({ title: result.title, html: result.html })
      );
    } catch { /* noop */ }
    router.push("/articles/new?from=synthesize");
  };

  if (articleCount < 2) return null;

  return (
    <>
      <button
        onClick={handleSynthesize}
        className="h-6 px-2 text-[11px] border border-border rounded text-foreground hover:bg-surface-hover hover:text-accent transition-colors"
        title={`AI synthesizes all ${articleCount} articles in this category into a new overview article`}
      >
        Synthesize
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-surface border border-border rounded-lg shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-3 border-b border-border shrink-0">
              <div>
                <h2 className="text-[15px] font-semibold text-heading">Knowledge Synthesis</h2>
                <p className="text-[11px] text-muted mt-0.5">
                  AI is synthesising {articleCount} articles in &ldquo;{categoryName}&rdquo;
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-muted hover:text-foreground text-sm"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {loading && (
                <div className="flex flex-col items-center justify-center h-48 gap-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-accent rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-2 h-2 bg-accent rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-2 h-2 bg-accent rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                  <p className="text-[13px] text-muted">Reading and synthesising articles…</p>
                </div>
              )}

              {error && (
                <div className="text-red-500 text-[13px] p-4 bg-red-50 rounded border border-red-200">
                  {error}
                </div>
              )}

              {result && (
                <div className="space-y-4">
                  <div>
                    <p className="text-[11px] text-muted uppercase tracking-wide font-medium mb-1">
                      Sources used ({result.articleTitles.length} articles)
                    </p>
                    <p className="text-[12px] text-muted">
                      {result.articleTitles.join(" · ")}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-muted uppercase tracking-wide font-medium mb-2">
                      Generated article: {result.title}
                    </p>
                    <div
                      className="prose prose-sm max-w-none border border-border rounded p-4 bg-background text-[13px] leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: result.html }}
                    />
                  </div>
                </div>
              )}
            </div>

            {result && (
              <div className="shrink-0 px-5 py-3 border-t border-border flex items-center gap-2">
                <button
                  onClick={handleCreateArticle}
                  className="bg-accent text-white px-4 py-1.5 text-[13px] font-medium rounded hover:bg-accent-hover transition-colors"
                >
                  Create as new article
                </button>
                <button
                  onClick={handleSynthesize}
                  className="px-4 py-1.5 text-[13px] border border-border rounded hover:bg-surface-hover transition-colors"
                >
                  Regenerate
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="px-4 py-1.5 text-[13px] text-muted hover:text-foreground transition-colors ml-auto"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
