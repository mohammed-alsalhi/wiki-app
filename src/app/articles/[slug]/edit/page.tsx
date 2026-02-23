"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import TiptapEditor, { type TiptapEditorHandle } from "@/components/editor/TiptapEditor";
import TagPicker from "@/components/TagPicker";
import CategorySelect from "@/components/CategorySelect";

type Article = {
  id: string;
  title: string;
  slug: string;
  content: string;
  categoryId: string | null;
  tags: { tag: { id: string } }[];
};

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const editorRef = useRef<TiptapEditorHandle>(null);
  const [article, setArticle] = useState<Article | null>(null);
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/articles?slug=${params.slug}`);
      if (!res.ok) return;
      const data = await res.json();
      const found = data.articles?.find((a: Article) => a.slug === params.slug);
      if (!found) {
        const searchRes = await fetch(`/api/search?q=${params.slug}&limit=1`);
        if (searchRes.ok) {
          const results = await searchRes.json();
          if (results.length > 0) {
            const detailRes = await fetch(`/api/articles/${results[0].id}`);
            if (detailRes.ok) {
              const articleData = await detailRes.json();
              setArticle(articleData);
              setTitle(articleData.title);
              setCategoryId(articleData.categoryId || "");
              setTagIds(articleData.tags.map((t: { tag: { id: string } }) => t.tag.id));
            }
          }
        }
        setLoading(false);
        return;
      }
      const detailRes = await fetch(`/api/articles/${found.id}`);
      if (detailRes.ok) {
        const articleData = await detailRes.json();
        setArticle(articleData);
        setTitle(articleData.title);
        setCategoryId(articleData.categoryId || "");
        setTagIds(articleData.tags.map((t: { tag: { id: string } }) => t.tag.id));
      }
      setLoading(false);
    }
    load();
  }, [params.slug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!article || !editorRef.current) return;

    setSaving(true);
    const content = editorRef.current.getHTML();
    const contentRaw = editorRef.current.getMarkdown();

    const res = await fetch(`/api/articles/${article.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title.trim(),
        content,
        contentRaw: contentRaw || null,
        excerpt: content.replace(/<[^>]*>/g, "").substring(0, 200),
        categoryId: categoryId || null,
        tagIds,
      }),
    });

    if (res.ok) {
      const updated = await res.json();
      router.push(`/articles/${updated.slug}`);
    } else {
      setSaving(false);
      alert("Failed to update article");
    }
  }

  if (loading) {
    return <div className="py-8 text-center text-muted italic text-[13px]">Loading...</div>;
  }

  if (!article) {
    return <div className="py-8 text-center text-muted italic text-[13px]">Article not found.</div>;
  }

  return (
    <div>
      {/* Tabs */}
      <div className="wiki-tabs">
        <Link href={`/articles/${article.slug}`} className="wiki-tab">
          Article
        </Link>
        <span className="wiki-tab wiki-tab-active">Editing</span>
      </div>

      {/* Edit form */}
      <div className="border border-t-0 border-border bg-surface px-5 py-4">
        <h1
          className="text-[1.5rem] font-normal text-heading border-b border-border pb-1 mb-3"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Editing: {article.title}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[13px] font-bold text-heading mb-1">Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border border-border bg-white px-3 py-1.5 text-[14px] text-foreground focus:border-accent focus:outline-none"
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
            <TiptapEditor ref={editorRef} content={article.content} />
          </div>

          <div className="flex gap-2 border-t border-border pt-3">
            <button
              type="submit"
              disabled={saving}
              className="bg-accent px-4 py-1.5 text-[13px] font-bold text-white hover:bg-accent-hover disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save changes"}
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
