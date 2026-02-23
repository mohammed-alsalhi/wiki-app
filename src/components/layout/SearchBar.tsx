"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type SearchResult = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: { name: string; icon: string | null } | null;
};

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=5`);
      if (res.ok) {
        const data = await res.json();
        setResults(data);
        setOpen(true);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setOpen(false);
    }
  }

  return (
    <div ref={ref} className="relative flex items-center gap-2">
      <label className="text-[11px] text-muted">Search:</label>
      <form onSubmit={handleSubmit} className="flex gap-1">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-48 border border-border bg-white px-2 py-0.5 text-[12px] text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
        />
        <button
          type="submit"
          className="border border-border bg-[#eaecf0] px-2 py-0.5 text-[11px] text-foreground hover:bg-[#dadde3]"
        >
          Go
        </button>
      </form>

      {open && results.length > 0 && (
        <div className="absolute right-0 top-full z-50 mt-1 w-72 border border-border bg-white shadow-md">
          {results.map((result) => (
            <Link
              key={result.id}
              href={`/articles/${result.slug}`}
              onClick={() => { setOpen(false); setQuery(""); }}
              className="flex flex-col border-b border-border-light px-3 py-1.5 last:border-0 hover:bg-surface-hover"
            >
              <span className="text-[13px] text-wiki-link">
                {result.title}
              </span>
              {result.excerpt && (
                <span className="mt-0.5 line-clamp-1 text-[11px] text-muted">
                  {result.excerpt}
                </span>
              )}
            </Link>
          ))}
          <Link
            href={`/search?q=${encodeURIComponent(query)}`}
            onClick={() => setOpen(false)}
            className="block border-t border-border px-3 py-1.5 text-center text-[11px] text-wiki-link hover:bg-surface-hover"
          >
            See all results &rarr;
          </Link>
        </div>
      )}
    </div>
  );
}
