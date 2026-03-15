"use client";

import { useState, useEffect } from "react";

const SHORTCUT_GROUPS = [
  {
    category: "Navigation",
    items: [
      { keys: ["g", "h"], description: "Go to home page" },
      { keys: ["g", "a"], description: "Go to all articles" },
      { keys: ["g", "n"], description: "New article" },
      { keys: ["g", "s"], description: "Go to search" },
      { keys: ["g", "r"], description: "Go to recent changes" },
      { keys: ["g", "g"], description: "Go to graph" },
      { keys: ["/"], description: "Focus search bar" },
    ],
  },
  {
    category: "Article Page",
    items: [
      { keys: ["R"], description: "Toggle reading mode" },
      { keys: ["E"], description: "Edit article (admin/editor)" },
    ],
  },
  {
    category: "Editor",
    items: [
      { keys: ["Ctrl+B"], description: "Bold" },
      { keys: ["Ctrl+I"], description: "Italic" },
      { keys: ["Ctrl+K"], description: "Insert link" },
      { keys: ["Ctrl+Z"], description: "Undo" },
      { keys: ["Ctrl+Shift+Z"], description: "Redo" },
      { keys: ["Ctrl+S"], description: "Save article" },
      { keys: ["/"], description: "Slash command menu" },
    ],
  },
  {
    category: "General",
    items: [
      { keys: ["?"], description: "Show this dialog" },
      { keys: ["Esc"], description: "Close dialog / blur input" },
    ],
  },
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
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 640, maxHeight: "80vh", overflowY: "auto" }}
      >
        <div className="modal-header">Keyboard Shortcuts</div>
        <div className="modal-body">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {SHORTCUT_GROUPS.map(({ category, items }) => (
              <div key={category}>
                <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted mb-2">
                  {category}
                </h3>
                <table className="w-full text-[12px]">
                  <tbody>
                    {items.map((s, i) => (
                      <tr key={i} className="border-b border-border-light last:border-0">
                        <td className="py-1.5 pr-4 whitespace-nowrap">
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
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <span className="text-[11px] text-muted mr-auto">Press <kbd>?</kbd> again to close</span>
          <button onClick={() => setOpen(false)} className="border border-border bg-surface-hover px-3 py-1.5 text-[13px] hover:bg-surface">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
