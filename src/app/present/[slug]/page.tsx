"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";

interface Slide {
  title: string;
  content: string;
}

export default function PresentModePage() {
  const { slug } = useParams<{ slug: string }>();
  const [slides, setSlides] = useState<Slide[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [articleId, setArticleId] = useState<string | null>(null);

  useEffect(() => {
    // Fetch article by slug to get id
    fetch(`/api/articles?slug=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then(async (data) => {
        // Find the article with matching slug
        const articles = Array.isArray(data) ? data : (data.articles || []);
        const article = articles.find((a: { slug: string; id: string }) => a.slug === slug);
        if (!article) {
          setLoading(false);
          return;
        }
        setArticleId(article.id);
        const res = await fetch(`/api/articles/${article.id}/present`);
        if (res.ok) {
          const { slides: s } = await res.json();
          setSlides(s);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const prev = useCallback(() => setCurrent((c) => Math.max(0, c - 1)), []);
  const next = useCallback(() => setCurrent((c) => Math.min(slides.length - 1, c + 1)), [slides.length]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === " ") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "Escape") window.location.href = `/articles/${slug}`;
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [next, prev, slug]);

  if (loading) return <div className="fixed inset-0 bg-black flex items-center justify-center text-white">Loading…</div>;

  if (slides.length === 0) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center text-white gap-4">
        <p>No slides could be generated from this article.</p>
        <Link href={`/articles/${slug}`} className="underline text-blue-300">Back to article</Link>
      </div>
    );
  }

  const slide = slides[current];

  return (
    <div className="fixed inset-0 bg-slate-900 text-white flex flex-col select-none">
      {/* Exit bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-black/40 text-sm">
        <Link href={`/articles/${slug}`} className="text-slate-400 hover:text-white">
          ✕ Exit presentation
        </Link>
        <span className="text-slate-400">{current + 1} / {slides.length}</span>
      </div>

      {/* Slide content */}
      <div className="flex-1 flex flex-col items-center justify-center px-16 py-12 overflow-auto">
        <h1 className="text-4xl font-bold mb-8 text-center" style={{ fontFamily: "Georgia, serif" }}>
          {slide.title}
        </h1>
        {slide.content && (
          <div
            className="prose prose-invert prose-lg max-w-3xl w-full"
            dangerouslySetInnerHTML={{ __html: slide.content }}
          />
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-8 pb-8">
        <button
          onClick={prev}
          disabled={current === 0}
          className="px-6 py-3 bg-white/10 rounded-lg hover:bg-white/20 disabled:opacity-30 transition-colors text-lg"
        >
          ← Prev
        </button>

        {/* Dot indicators */}
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-white w-4" : "bg-white/40"}`}
            />
          ))}
        </div>

        <button
          onClick={next}
          disabled={current === slides.length - 1}
          className="px-6 py-3 bg-white/10 rounded-lg hover:bg-white/20 disabled:opacity-30 transition-colors text-lg"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
