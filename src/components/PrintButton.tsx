"use client";

export default function PrintButton({ className = "" }: { className?: string }) {
  return (
    <button
      onClick={() => window.print()}
      className={`border border-border bg-surface-hover px-2 py-1 text-[12px] hover:bg-surface transition-colors ${className}`}
      title="Print this page"
    >
      Print
    </button>
  );
}
