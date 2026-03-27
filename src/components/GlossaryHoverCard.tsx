"use client";

import { useState, useRef, useEffect } from "react";

interface Props {
  term: string;
  definition: string;
  children: React.ReactNode;
}

export default function GlossaryHoverCard({ term, definition, children }: Props) {
  const [show, setShow] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const cardRef = useRef<HTMLSpanElement>(null);

  function enter() {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setShow(true), 300);
  }

  function leave() {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setShow(false), 150);
  }

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <span className="relative inline" onMouseEnter={enter} onMouseLeave={leave}>
      <span className="border-b border-dotted border-accent cursor-help">{children}</span>
      {show && (
        <span
          ref={cardRef}
          className="absolute z-50 bottom-full left-0 mb-1 w-64 rounded border border-border bg-surface shadow-lg text-[12px] p-2.5"
          onMouseEnter={enter}
          onMouseLeave={leave}
        >
          <span className="block font-semibold text-heading mb-1">{term}</span>
          <span className="text-foreground leading-snug">{definition}</span>
        </span>
      )}
    </span>
  );
}
