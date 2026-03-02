"use client";

import { useState, useEffect } from "react";

const shortcuts = [
  { keys: ["?"], description: "Show this dialog" },
  { keys: ["g", "h"], description: "Go to home page" },
  { keys: ["g", "a"], description: "Go to all articles" },
  { keys: ["g", "n"], description: "Create new article" },
  { keys: ["g", "s"], description: "Go to search" },
  { keys: ["g", "r"], description: "Go to recent changes" },
  { keys: ["g", "g"], description: "Go to graph" },
  { keys: ["/"], description: "Focus search bar" },
  { keys: ["Esc"], description: "Close dialog / blur input" },
];

export default function KeyboardShortcuts() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let pending = "";
    let timer: ReturnType<typeof setTimeout>;

    function handler(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) return;

      if (e.key === "?" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setOpen((o) => !o);
        return;
      }

      if (e.key === "Escape") {
        setOpen(false);
        return;
      }

      if (e.key === "/") {
        e.preventDefault();
        const search = document.querySelector<HTMLInputElement>('input[type="search"], input[placeholder*="Search"]');
        search?.focus();
        return;
      }

      clearTimeout(timer);
      pending += e.key.toLowerCase();
      timer = setTimeout(() => { pending = ""; }, 500);

      const nav: Record<string, string> = {
        gh: "/",
        ga: "/articles",
        gn: "/articles/new",
        gs: "/search",
        gr: "/recent-changes",
        gg: "/graph",
      };

      if (nav[pending]) {
        window.location.href = nav[pending];
        pending = "";
      }
    }

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={() => setOpen(false)}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 420 }}>
        <div className="modal-header">Keyboard Shortcuts</div>
        <div className="modal-body">
          <table className="w-full text-[13px]">
            <tbody>
              {shortcuts.map((s, i) => (
                <tr key={i} className="border-b border-border-light last:border-0">
                  <td className="py-1.5 pr-4">
                    {s.keys.map((k, j) => (
                      <span key={j}>
                        {j > 0 && <span className="text-muted mx-1">then</span>}
                        <kbd>{k}</kbd>
                      </span>
                    ))}
                  </td>
                  <td className="py-1.5 text-muted">{s.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="modal-footer">
          <button onClick={() => setOpen(false)} className="border border-border bg-surface-hover px-3 py-1.5 text-[13px] hover:bg-surface">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
