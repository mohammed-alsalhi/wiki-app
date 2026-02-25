"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { WikiLink } from "./WikiLinkExtension";
import EditorToolbar from "./EditorToolbar";
import { useRef, useState, useImperativeHandle, forwardRef } from "react";

export type TiptapEditorHandle = {
  getHTML: () => string;
  getMarkdown: () => string;
  setContent: (content: string) => void;
};

type Props = {
  content?: string;
  placeholder?: string;
};

const TiptapEditor = forwardRef<TiptapEditorHandle, Props>(
  function TiptapEditor({ content = "", placeholder = "Start writing..." }, ref) {
    const [markdownMode, setMarkdownMode] = useState(false);
    const [markdownText, setMarkdownText] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const editor = useEditor({
      immediatelyRender: false,
      extensions: [
        StarterKit,
        Image.configure({ inline: false }),
        Link.configure({ openOnClick: false }).extend({
          parseHTML() {
            return [{ tag: "a[href]:not([data-wiki-link])" }];
          },
        }),
        Placeholder.configure({ placeholder }),
        WikiLink,
      ],
      content,
      editorProps: {
        attributes: {
          class: "tiptap max-w-none",
        },
      },
    });

    useImperativeHandle(ref, () => ({
      getHTML: () => {
        if (markdownMode) {
          return editor?.getHTML() || "";
        }
        return editor?.getHTML() || "";
      },
      getMarkdown: () => markdownText,
      setContent: (content: string) => {
        editor?.commands.setContent(content);
      },
    }));

    async function handleImageUpload() {
      fileInputRef.current?.click();
    }

    async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
      const file = e.target.files?.[0];
      if (!file || !editor) return;

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
        const { url } = await res.json();
        editor.chain().focus().setImage({ src: url }).run();
      }

      e.target.value = "";
    }

    function toggleMarkdownMode() {
      if (!editor) return;

      if (!markdownMode) {
        const html = editor.getHTML();
        setMarkdownText(htmlToBasicMarkdown(html));
      } else {
        const html = basicMarkdownToHtml(markdownText);
        editor.commands.setContent(html);
      }
      setMarkdownMode(!markdownMode);
    }

    return (
      <div className="border border-border overflow-hidden">
        <div className="flex items-center justify-between border-b border-border bg-surface-hover px-2 py-1">
          <EditorToolbar editor={editor} onImageUpload={handleImageUpload} />
          <button
            type="button"
            onClick={toggleMarkdownMode}
            className={`px-2 py-0.5 text-[11px] transition-colors ${
              markdownMode
                ? "bg-accent text-white font-bold"
                : "text-muted hover:text-foreground"
            }`}
          >
            {markdownMode ? "Rich Text" : "Markdown"}
          </button>
        </div>

        {markdownMode ? (
          <textarea
            value={markdownText}
            onChange={(e) => setMarkdownText(e.target.value)}
            className="min-h-[300px] w-full bg-surface p-4 font-mono text-[13px] text-foreground focus:outline-none"
            placeholder="Write in markdown..."
          />
        ) : (
          <EditorContent editor={editor} />
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onFileChange}
          className="hidden"
        />
      </div>
    );
  }
);

function htmlToBasicMarkdown(html: string): string {
  return html
    // Convert wiki links to [[Title]] or [[Title|Label]] before stripping tags
    .replace(/<a[^>]*data-wiki-link="([^"]*)"[^>]*>([^<]*)<\/a>/gi, (_m, title, text) => {
      return text !== title ? `[[${title}|${text}]]` : `[[${title}]]`;
    })
    .replace(/<h1[^>]*>(.*?)<\/h1>/gi, "# $1\n\n")
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, "## $1\n\n")
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, "### $1\n\n")
    .replace(/<p[^>]*>(.*?)<\/p>/gi, "$1\n\n")
    .replace(/<strong[^>]*>(.*?)<\/strong>/gi, "**$1**")
    .replace(/<em[^>]*>(.*?)<\/em>/gi, "*$1*")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .trim();
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function basicMarkdownToHtml(md: string): string {
  const lines = md.split("\n");
  const result: string[] = [];
  let paragraph: string[] = [];

  function convertInline(text: string): string {
    return text
      .replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_match, title, label) => {
        const slug = slugify(title);
        const display = label || title;
        return `<a href="/articles/${slug}" class="wiki-link" data-wiki-link="${title}">${display}</a>`;
      })
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>");
  }

  function flushParagraph() {
    if (paragraph.length > 0) {
      result.push(`<p>${convertInline(paragraph.join("<br>"))}</p>`);
      paragraph = [];
    }
  }

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      continue;
    }

    if (trimmed.startsWith("### ")) {
      flushParagraph();
      result.push(`<h3>${convertInline(trimmed.slice(4))}</h3>`);
    } else if (trimmed.startsWith("## ")) {
      flushParagraph();
      result.push(`<h2>${convertInline(trimmed.slice(3))}</h2>`);
    } else if (trimmed.startsWith("# ")) {
      flushParagraph();
      result.push(`<h1>${convertInline(trimmed.slice(2))}</h1>`);
    } else {
      paragraph.push(trimmed);
    }
  }

  flushParagraph();
  return result.join("");
}

export default TiptapEditor;
