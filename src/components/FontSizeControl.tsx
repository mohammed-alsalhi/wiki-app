"use client";

import { useEffect, useState } from "react";

const SIZES = [
  { label: "S", value: "text-sm", title: "Small text" },
  { label: "M", value: "text-base", title: "Medium text (default)" },
  { label: "L", value: "text-lg", title: "Large text" },
  { label: "XL", value: "text-xl", title: "Extra large text" },
];

const STORAGE_KEY = "wiki_font_size";
const ARTICLE_SELECTOR = "#article-content";

export default function FontSizeControl() {
  const [current, setCurrent] = useState("text-base");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) ?? "text-base";
    setCurrent(saved);
    applySize(saved);
  }, []);

  function applySize(size: string) {
    const el = document.querySelector(ARTICLE_SELECTOR) as HTMLElement | null;
    if (!el) return;
    SIZES.forEach((s) => el.classList.remove(s.value));
    el.classList.add(size);
  }

  function select(size: string) {
    setCurrent(size);
    localStorage.setItem(STORAGE_KEY, size);
    applySize(size);
  }

  return (
    <span className="flex items-center gap-0.5">
      {SIZES.map((s) => (
        <button
          key={s.value}
          onClick={() => select(s.value)}
          title={s.title}
          className={`h-6 w-6 text-[11px] border rounded transition-colors ${
            current === s.value
              ? "border-accent text-accent bg-accent/10"
              : "border-border text-muted hover:text-foreground hover:bg-surface-hover"
          }`}
        >
          {s.label}
        </button>
      ))}
    </span>
  );
}
