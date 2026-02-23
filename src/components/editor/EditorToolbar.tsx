"use client";

import type { Editor } from "@tiptap/react";

type Props = {
  editor: Editor | null;
  onImageUpload: () => void;
};

type ToolbarButton = {
  label: string;
  icon: string;
  action: () => void;
  isActive?: () => boolean;
};

export default function EditorToolbar({ editor, onImageUpload }: Props) {
  if (!editor) return null;

  const groups: ToolbarButton[][] = [
    [
      {
        label: "Bold",
        icon: "B",
        action: () => editor.chain().focus().toggleBold().run(),
        isActive: () => editor.isActive("bold"),
      },
      {
        label: "Italic",
        icon: "I",
        action: () => editor.chain().focus().toggleItalic().run(),
        isActive: () => editor.isActive("italic"),
      },
      {
        label: "Strike",
        icon: "S",
        action: () => editor.chain().focus().toggleStrike().run(),
        isActive: () => editor.isActive("strike"),
      },
    ],
    [
      {
        label: "H1",
        icon: "H1",
        action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
        isActive: () => editor.isActive("heading", { level: 1 }),
      },
      {
        label: "H2",
        icon: "H2",
        action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
        isActive: () => editor.isActive("heading", { level: 2 }),
      },
      {
        label: "H3",
        icon: "H3",
        action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
        isActive: () => editor.isActive("heading", { level: 3 }),
      },
    ],
    [
      {
        label: "Bullet List",
        icon: "\u2022",
        action: () => editor.chain().focus().toggleBulletList().run(),
        isActive: () => editor.isActive("bulletList"),
      },
      {
        label: "Ordered List",
        icon: "1.",
        action: () => editor.chain().focus().toggleOrderedList().run(),
        isActive: () => editor.isActive("orderedList"),
      },
      {
        label: "Blockquote",
        icon: "\u201C",
        action: () => editor.chain().focus().toggleBlockquote().run(),
        isActive: () => editor.isActive("blockquote"),
      },
      {
        label: "Code Block",
        icon: "<>",
        action: () => editor.chain().focus().toggleCodeBlock().run(),
        isActive: () => editor.isActive("codeBlock"),
      },
    ],
    [
      {
        label: "Rule",
        icon: "\u2014",
        action: () => editor.chain().focus().setHorizontalRule().run(),
      },
      {
        label: "Link",
        icon: "\u{1F517}",
        action: () => {
          const url = window.prompt("URL:");
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        },
        isActive: () => editor.isActive("link"),
      },
      {
        label: "Image",
        icon: "\u{1F5BC}",
        action: onImageUpload,
      },
      {
        label: "Wiki Link",
        icon: "[[]]",
        action: () => {
          const title = window.prompt("Article title to link:");
          if (title) {
            editor
              .chain()
              .focus()
              .insertContent({ type: "wikiLink", attrs: { title } })
              .run();
          }
        },
      },
    ],
  ];

  return (
    <div className="flex flex-wrap gap-0.5 py-0.5">
      {groups.map((group, gi) => (
        <div key={gi} className="flex gap-px">
          {group.map((btn) => (
            <button
              key={btn.label}
              type="button"
              onClick={btn.action}
              title={btn.label}
              className={`px-1.5 py-0.5 text-[11px] font-medium transition-colors ${
                btn.isActive?.()
                  ? "bg-accent text-white"
                  : "text-foreground hover:bg-surface hover:text-accent"
              }`}
            >
              {btn.icon}
            </button>
          ))}
          {gi < groups.length - 1 && (
            <div className="mx-1 w-px bg-border" />
          )}
        </div>
      ))}
    </div>
  );
}
