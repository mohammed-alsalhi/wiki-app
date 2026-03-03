/**
 * renderSpecialBlocks
 *
 * Splits rendered article HTML into segments, replacing special block
 * placeholders with lazy-loaded React client components:
 *  - <div data-mermaid="...">       → <MermaidBlock>
 *  - <div data-katex-block="...">   → <KaTeXBlock>
 *  - <span data-katex-inline="..."> → <KaTeXBlock inline>
 *  - <div data-table="...">         → <DataTable>
 *  - <div data-decision-tree="..."> → <DecisionTreeDisplay>
 *
 * Returns an array of React nodes that can be rendered in a Server Component.
 */

import React from "react";
import dynamic from "next/dynamic";

const MermaidBlock = dynamic(() => import("@/components/MermaidBlock"), { ssr: false });
const KaTeXBlock = dynamic(() => import("@/components/KaTeXBlock"), { ssr: false });
const DataTable = dynamic(() => import("@/components/DataTable"), { ssr: false });
const DecisionTreeDisplay = dynamic(() => import("@/components/DecisionTreeDisplay"), { ssr: false });

// Matches a special opening tag and captures its data attribute value
const SPECIAL_BLOCK_RE =
  /<(div|span)\s+data-(mermaid|katex-block|katex-inline|table|decision-tree)="([^"]*)"/gi;

export function renderSpecialBlocks(html: string): React.ReactNode {
  const segments: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let keyCounter = 0;

  SPECIAL_BLOCK_RE.lastIndex = 0;

  while ((match = SPECIAL_BLOCK_RE.exec(html)) !== null) {
    const matchStart = match.index;
    const tag = match[1]; // div | span
    const type = match[2]; // mermaid | katex-block | katex-inline | table | decision-tree
    const value = match[3];

    // Find the closing tag for this element
    const closeTag = `</${tag}>`;
    const closeIdx = html.indexOf(closeTag, SPECIAL_BLOCK_RE.lastIndex);
    const blockEnd = closeIdx !== -1 ? closeIdx + closeTag.length : SPECIAL_BLOCK_RE.lastIndex;

    // Push the HTML segment before this block
    if (matchStart > lastIndex) {
      segments.push(
        <div
          key={`html-${keyCounter++}`}
          className="wiki-content"
          dangerouslySetInnerHTML={{ __html: html.slice(lastIndex, matchStart) }}
        />
      );
    }

    // Push the appropriate client component
    const key = `block-${keyCounter++}`;
    if (type === "mermaid") {
      segments.push(<MermaidBlock key={key} code={decodeURIComponent(value)} />);
    } else if (type === "katex-block") {
      segments.push(<KaTeXBlock key={key} latex={decodeURIComponent(value)} block />);
    } else if (type === "katex-inline") {
      segments.push(<KaTeXBlock key={key} latex={decodeURIComponent(value)} />);
    } else if (type === "table") {
      segments.push(<DataTable key={key} source={decodeURIComponent(value)} />);
    } else if (type === "decision-tree") {
      segments.push(<DecisionTreeDisplay key={key} treeJson={decodeURIComponent(value)} />);
    }

    lastIndex = blockEnd;
    SPECIAL_BLOCK_RE.lastIndex = blockEnd;
  }

  // Push any remaining HTML after the last special block
  if (lastIndex < html.length) {
    segments.push(
      <div
        key={`html-${keyCounter++}`}
        className="wiki-content"
        dangerouslySetInnerHTML={{ __html: html.slice(lastIndex) }}
      />
    );
  }

  // If no special blocks were found, return the whole thing as a single div
  if (segments.length === 0) {
    return (
      <div
        className="wiki-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return <>{segments}</>;
}
