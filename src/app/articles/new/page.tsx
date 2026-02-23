"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import TiptapEditor, { type TiptapEditorHandle } from "@/components/editor/TiptapEditor";
import TagPicker from "@/components/TagPicker";
import CategorySelect from "@/components/CategorySelect";

export default function NewArticlePage() {
  const router = useRouter();
  const editorRef = useRef<TiptapEditorHandle>(null);
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !editorRef.current) return;

    setSaving(true);
    const content = editorRef.current.getHTML();
    const contentRaw = editorRef.current.getMarkdown();

    const res = await fetch("/api/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title.trim(),
        content,
        contentRaw: contentRaw || null,
        categoryId: categoryId || null,
        tagIds,
      }),
    });

    if (res.ok) {
      const article = await res.json();
      router.push(`/articles/${article.slug}`);
    } else {
      setSaving(false);
      alert("Failed to create article");
    }
  }

  return (
    <div>
      {/* Tabs */}
      <div className="wiki-tabs">
        <span className="wiki-tab wiki-tab-active">Creating</span>
      </div>

      {/* Edit form in bordered area */}
      <div className="border border-t-0 border-border bg-surface px-5 py-4">
        <h1
          className="text-[1.5rem] font-normal text-heading border-b border-border pb-1 mb-3"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Create new article
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[13px] font-bold text-heading mb-1">Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Article title..."
              required
              className="w-full border border-border bg-white px-3 py-1.5 text-[14px] text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-[13px] font-bold text-heading mb-1">Category:</label>
              <CategorySelect value={categoryId} onChange={setCategoryId} />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-heading mb-1">Tags:</label>
              <TagPicker selectedTagIds={tagIds} onChange={setTagIds} />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-bold text-heading mb-1">Content:</label>
            <TiptapEditor
              ref={editorRef}
              placeholder="Begin writing your article... Use [[Article Name]] to create wiki links."
            />
          </div>

          <div className="flex gap-2 border-t border-border pt-3">
            <button
              type="submit"
              disabled={saving}
              className="bg-accent px-4 py-1.5 text-[13px] font-bold text-white hover:bg-accent-hover disabled:opacity-50"
            >
              {saving ? "Saving..." : "Publish article"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="border border-border bg-surface-hover px-4 py-1.5 text-[13px] text-foreground hover:bg-surface"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
