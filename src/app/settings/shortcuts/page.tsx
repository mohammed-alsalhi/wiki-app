"use client";

import { useState, useEffect } from "react";
import {
  loadShortcuts,
  saveShortcuts,
  resetShortcuts,
  DEFAULT_SHORTCUTS,
  SHORTCUT_LABELS,
  type ShortcutMap,
} from "@/lib/shortcuts";

export default function ShortcutsPage() {
  const [shortcuts, setShortcuts] = useState<ShortcutMap>(DEFAULT_SHORTCUTS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setShortcuts(loadShortcuts());
  }, []);

  function handleChange(key: keyof ShortcutMap, value: string) {
    setShortcuts((prev) => ({ ...prev, [key]: value.toLowerCase().replace(/\s/g, "") }));
    setSaved(false);
  }

  function handleSave() {
    saveShortcuts(shortcuts);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleReset() {
    resetShortcuts();
    setShortcuts(DEFAULT_SHORTCUTS);
    setSaved(false);
  }

  return (
    <div>
      <h1
        className="text-xl font-normal text-heading mb-4 pb-1 border-b border-border"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        Keyboard Shortcuts
      </h1>

      <div className="max-w-xl">
        <div className="wiki-notice mb-4 text-[13px]">
          Customise the two-key navigation chords. Type the desired keys (e.g.{" "}
          <code className="bg-surface-hover px-1">gh</code> means press{" "}
          <kbd>g</kbd> then <kbd>h</kbd>). Changes are saved to your browser.
        </div>

        <section className="border border-border bg-surface mb-4">
          <div className="bg-infobox-header px-4 py-2 text-[13px] font-bold text-foreground border-b border-border">
            Navigation chords
          </div>
          <div className="px-4 py-3 space-y-3">
            {(Object.keys(shortcuts) as (keyof ShortcutMap)[]).map((key) => (
              <div key={key} className="flex items-center gap-3">
                <label className="w-44 text-[13px] text-foreground shrink-0">
                  {SHORTCUT_LABELS[key]}
                </label>
                <input
                  type="text"
                  value={shortcuts[key]}
                  onChange={(e) => handleChange(key, e.target.value)}
                  maxLength={4}
                  className="w-20 px-2 py-1 text-[13px] border border-border bg-background text-foreground font-mono focus:border-accent focus:outline-none"
                />
                {shortcuts[key] !== DEFAULT_SHORTCUTS[key] && (
                  <span className="text-[11px] text-muted">
                    default: <code className="bg-surface-hover px-1">{DEFAULT_SHORTCUTS[key]}</code>
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className="home-action-btn home-action-btn-primary"
          >
            {saved ? "Saved!" : "Save shortcuts"}
          </button>
          <button
            onClick={handleReset}
            className="home-action-btn"
            type="button"
          >
            Reset to defaults
          </button>
        </div>
      </div>
    </div>
  );
}
