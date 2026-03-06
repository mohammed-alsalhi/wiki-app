"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

type Board = { id: string; title: string; slug: string; updatedAt: string };

export default function WhiteboardsPage() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/whiteboards");
    const data = await res.json();
    if (Array.isArray(data)) setBoards(data);
    setLoading(false);
  }

  async function create() {
    if (!newTitle.trim()) return;
    const res = await fetch("/api/whiteboards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle }),
    });
    if (res.ok) {
      const board = await res.json();
      window.location.href = `/whiteboards/${board.slug}`;
    }
  }

  return (
    <div>
      <h1
        className="text-[1.7rem] font-normal text-heading border-b border-border pb-1 mb-3"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        Whiteboards
      </h1>

      <div className="flex gap-2 mb-4">
        {creating ? (
          <>
            <input
              autoFocus
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") create(); if (e.key === "Escape") setCreating(false); }}
              placeholder="Whiteboard title"
              className="border border-border bg-surface px-2 py-1 text-[12px] focus:border-accent focus:outline-none"
            />
            <button onClick={create} className="h-6 px-2 text-[11px] border border-border rounded hover:bg-surface-hover">
              Create
            </button>
            <button onClick={() => setCreating(false)} className="h-6 px-2 text-[11px] border border-border rounded hover:bg-surface-hover">
              Cancel
            </button>
          </>
        ) : (
          <button onClick={() => setCreating(true)} className="h-6 px-2 text-[11px] border border-border rounded hover:bg-surface-hover">
            + New whiteboard
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-[13px] text-muted italic">Loading…</p>
      ) : boards.length === 0 ? (
        <div className="wiki-notice">No whiteboards yet. Create one above.</div>
      ) : (
        <ul className="space-y-1 text-[13px]">
          {boards.map((b) => (
            <li key={b.id} className="border-b border-border pb-1">
              <Link href={`/whiteboards/${b.slug}`} className="font-medium hover:underline">
                {b.title}
              </Link>
              <span className="text-muted text-[11px] ml-2">
                Updated {new Date(b.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export const dynamic = "force-dynamic";
