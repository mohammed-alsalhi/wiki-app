"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const WorldMap = dynamic(() => import("@/components/map/WorldMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-muted italic text-[13px]">
      Loading map...
    </div>
  ),
});

export default function MapPage() {
  const [editMode, setEditMode] = useState(false);

  return (
    <div className="-mx-6 -my-4 flex h-[calc(100vh-40px)] flex-col">
      <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-2">
        <h1
          className="text-lg font-normal text-heading"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          World Map
        </h1>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-muted italic">
            {editMode
              ? "Click on the map to place a marker"
              : "Click markers to view locations"}
          </span>
          <button
            onClick={() => setEditMode(!editMode)}
            className={`px-3 py-1 text-[12px] transition-colors ${
              editMode
                ? "bg-accent text-white"
                : "border border-border bg-surface-hover text-foreground hover:bg-surface"
            }`}
          >
            {editMode ? "Done editing" : "Edit map"}
          </button>
        </div>
      </div>

      <div className="flex-1">
        <WorldMap
          mapImage="/maps/world.webp"
          editMode={editMode}
        />
      </div>
    </div>
  );
}
