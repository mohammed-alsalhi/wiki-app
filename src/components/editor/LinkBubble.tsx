"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import type { Editor } from "@tiptap/react";

type LinkInfo = {
  type: "link" | "wikiLink";
  href?: string;
  title?: string;
  label?: string | null;
  from: number;
  to: number;
};

type Props = {
  editor: Editor | null;
};

export default function LinkBubble({ editor }: Props) {
  const [linkInfo, setLinkInfo] = useState<LinkInfo | null>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const detectLink = useCallback(() => {
    if (!editor) {
      setLinkInfo(null);
      return;
    }

    const { state } = editor;
    const { from, to, empty } = state.selection;

    // Check if cursor is inside a wikiLink node
    const $from = state.doc.resolve(from);
    if ($from.parent.type.name === "wikiLink") {
      const nodePos = $from.before($from.depth);
      const node = $from.parent;
      const coords = editor.view.coordsAtPos(nodePos);
      const editorRect = editor.view.dom.closest(".border.border-border")?.getBoundingClientRect();
      if (editorRect) {
        setPosition({
          top: coords.bottom - editorRect.top + 4,
          left: coords.left - editorRect.left,
        });
      }
      setLinkInfo({
        type: "wikiLink",
        title: node.attrs.title,
        label: node.attrs.label,
        from: nodePos,
        to: nodePos + node.nodeSize,
      });
      return;
    }

    // Check if cursor is on a link mark
    if (!empty) {
      setLinkInfo(null);
      return;
    }

    const marks = $from.marks();
    const linkMark = marks.find((m) => m.type.name === "link");
    if (linkMark) {
      // Find the full range of this mark
      let markFrom = from;
      let markTo = from;

      // Walk backwards to find start
      const parent = $from.parent;
      const parentOffset = $from.start();
      parent.forEach((node, offset) => {
        const nodeFrom = parentOffset + offset;
        const nodeTo = nodeFrom + node.nodeSize;
        if (node.marks.some((m) => m.type.name === "link" && m.attrs.href === linkMark.attrs.href)) {
          if (from >= nodeFrom && from <= nodeTo) {
            markFrom = nodeFrom;
            markTo = nodeTo;
          }
        }
      });

      const coords = editor.view.coordsAtPos(markFrom);
      const editorRect = editor.view.dom.closest(".border.border-border")?.getBoundingClientRect();
      if (editorRect) {
        setPosition({
          top: coords.bottom - editorRect.top + 4,
          left: coords.left - editorRect.left,
        });
      }
      setLinkInfo({
        type: "link",
        href: linkMark.attrs.href,
        from: markFrom,
        to: markTo,
      });
      return;
    }

    setLinkInfo(null);
    setEditing(false);
  }, [editor]);

  useEffect(() => {
    if (!editor) return;

    editor.on("selectionUpdate", detectLink);
    editor.on("transaction", detectLink);
    return () => {
      editor.off("selectionUpdate", detectLink);
      editor.off("transaction", detectLink);
    };
  }, [editor, detectLink]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  if (!linkInfo || !editor) return null;

  function handleEdit() {
    if (!linkInfo) return;
    if (linkInfo.type === "link") {
      setEditValue(linkInfo.href || "");
    } else {
      setEditValue(linkInfo.title || "");
    }
    setEditing(true);
  }

  function handleSave() {
    if (!linkInfo || !editor) return;

    if (linkInfo.type === "link") {
      // Update the link URL
      const { tr } = editor.state;
      const linkType = editor.schema.marks.link;
      tr.removeMark(linkInfo.from, linkInfo.to, linkType);
      tr.addMark(linkInfo.from, linkInfo.to, linkType.create({ href: editValue.trim() }));
      editor.view.dispatch(tr);
    } else {
      // Replace the wiki link node with a new one with updated title
      const newTitle = editValue.trim();
      if (newTitle) {
        editor
          .chain()
          .focus()
          .deleteRange({ from: linkInfo.from, to: linkInfo.to })
          .insertContentAt(linkInfo.from, {
            type: "wikiLink",
            attrs: { title: newTitle, label: linkInfo.label },
          })
          .run();
      }
    }
    setEditing(false);
    setLinkInfo(null);
  }

  function handleRemove() {
    if (!linkInfo || !editor) return;

    if (linkInfo.type === "link") {
      // Remove the link mark, keeping the text
      editor.chain().focus().unsetLink().run();
    } else {
      // Replace wiki link node with plain text
      const text = linkInfo.label || linkInfo.title || "";
      const { tr } = editor.state;
      tr.replaceWith(linkInfo.from, linkInfo.to, editor.state.schema.text(text));
      editor.view.dispatch(tr);
    }
    setLinkInfo(null);
    setEditing(false);
  }

  const container = editor.view.dom.closest(".border.border-border") as HTMLElement;
  if (!container) return null;

  return createPortal(
    <div
      className="absolute z-50 border border-border bg-surface shadow-sm text-[12px]"
      style={{ top: position.top, left: position.left, minWidth: "200px" }}
    >
      {editing ? (
        <div className="flex items-center gap-1 p-1.5">
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") {
                setEditing(false);
                editor?.commands.focus();
              }
            }}
            className="flex-1 border border-border bg-surface px-2 py-0.5 text-[12px] text-foreground focus:border-accent focus:outline-none"
          />
          <button
            type="button"
            onClick={handleSave}
            className="px-2 py-0.5 text-[11px] font-bold bg-accent text-white hover:bg-accent-hover"
          >
            Save
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 px-2 py-1.5">
          <span className="text-muted truncate max-w-[200px]">
            {linkInfo.type === "link"
              ? linkInfo.href
              : `[[${linkInfo.title}]]`}
          </span>
          <button
            type="button"
            onClick={handleEdit}
            className="text-wiki-link hover:underline whitespace-nowrap"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={handleRemove}
            className="text-red-500 hover:underline whitespace-nowrap"
          >
            Remove
          </button>
        </div>
      )}
    </div>,
    container
  );
}
