"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAdmin } from "@/components/AdminContext";

type Discussion = {
  id: string;
  author: string;
  content: string;
  createdAt: string;
};

type ArticleInfo = {
  id: string;
  title: string;
  slug: string;
};

export default function DiscussionPage() {
  const isAdmin = useAdmin();
  const params = useParams();
  const slug = params.slug as string;

  const [article, setArticle] = useState<ArticleInfo | null>(null);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/articles?slug=${slug}`);
      if (!res.ok) return;
      const data = await res.json();
      const found = data.articles?.find((a: ArticleInfo) => a.slug === slug);
      if (!found) {
        setLoading(false);
        return;
      }
      setArticle(found);

      const discRes = await fetch(`/api/articles/${found.id}/discussions`);
      if (discRes.ok) {
        setDiscussions(await discRes.json());
      }
      setLoading(false);
    }
    load();
  }, [slug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!article || !content.trim()) return;

    setSubmitting(true);
    const res = await fetch(`/api/articles/${article.id}/discussions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        author: author.trim() || "Anonymous",
        content: content.trim(),
      }),
    });

    if (res.ok) {
      const newComment = await res.json();
      setDiscussions((prev) => [...prev, newComment]);
      setContent("");
    }
    setSubmitting(false);
  }

  async function handleDelete(discussionId: string) {
    if (!article) return;
    if (!confirm("Delete this comment?")) return;

    const res = await fetch(
      `/api/articles/${article.id}/discussions?discussionId=${discussionId}`,
      { method: "DELETE" }
    );
    if (res.ok) {
      setDiscussions((prev) => prev.filter((d) => d.id !== discussionId));
    }
  }

  if (loading) {
    return <div className="py-8 text-center text-muted italic text-[13px]">Loading...</div>;
  }

  if (!article) {
    return <div className="py-8 text-center text-muted italic text-[13px]">Article not found.</div>;
  }

  return (
    <div>
      {/* Tabs */}
      <div className="wiki-tabs">
        <Link href={`/articles/${slug}`} className="wiki-tab">
          Article
        </Link>
        {isAdmin && (
          <Link href={`/articles/${slug}/edit`} className="wiki-tab">
            Edit
          </Link>
        )}
        <Link href={`/articles/${slug}/history`} className="wiki-tab">
          History
        </Link>
        <span className="wiki-tab wiki-tab-active">Discussion</span>
      </div>

      <div className="border border-t-0 border-border bg-surface px-5 py-4">
        <h1
          className="text-[1.5rem] font-normal text-heading border-b border-border pb-1 mb-3"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Discussion: {article.title}
        </h1>

        {/* Comments list */}
        {discussions.length === 0 ? (
          <p className="text-[13px] text-muted italic mb-4">
            No comments yet. Be the first to start a discussion.
          </p>
        ) : (
          <div className="space-y-3 mb-4">
            {discussions.map((d) => (
              <div key={d.id} className="border border-border bg-surface-hover px-4 py-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[13px] font-bold text-heading">{d.author}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-muted">
                      {new Date(d.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(d.id)}
                        className="text-[11px] text-red-500 hover:underline"
                      >
                        delete
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-[13px] text-foreground whitespace-pre-wrap">{d.content}</p>
              </div>
            ))}
          </div>
        )}

        {/* Add comment form */}
        <div className="border-t border-border pt-3">
          <h2
            className="text-base font-normal text-heading mb-2"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Add a comment
          </h2>
          <form onSubmit={handleSubmit} className="space-y-2">
            <div>
              <label className="block text-[13px] font-bold text-heading mb-1">Name:</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Anonymous"
                className="w-full max-w-xs border border-border bg-surface px-3 py-1.5 text-[13px] text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-heading mb-1">Comment:</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={4}
                placeholder="Share your thoughts..."
                className="w-full border border-border bg-surface px-3 py-2 text-[13px] text-foreground placeholder:text-muted focus:border-accent focus:outline-none resize-y"
              />
            </div>
            <button
              type="submit"
              disabled={submitting || !content.trim()}
              className="bg-accent px-4 py-1.5 text-[13px] font-bold text-white hover:bg-accent-hover disabled:opacity-50"
            >
              {submitting ? "Posting..." : "Post comment"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
