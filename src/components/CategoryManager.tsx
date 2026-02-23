"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/components/AdminContext";

type Category = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  parentId?: string | null;
  children?: Category[];
};

export default function CategoryManager() {
  const isAdmin = useAdmin();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [description, setDescription] = useState("");
  const [parentId, setParentId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories);
  }, []);

  if (!isAdmin) return null;

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        icon: icon.trim() || null,
        description: description.trim() || null,
        parentId: parentId || null,
      }),
    });

    if (res.ok) {
      setName("");
      setIcon("");
      setDescription("");
      setParentId("");
      setSuccess("Category created!");
      router.refresh();
      // Refresh the categories list
      const updated = await fetch("/api/categories").then((r) => r.json());
      setCategories(updated);
    } else {
      const data = await res.json();
      setError(data.error || "Failed to create category");
    }
  }

  // Flatten categories for the parent select
  const flatCategories = flattenTree(categories.filter((c) => !c.parentId));

  return (
    <div className="wiki-portal max-w-md">
      <div className="wiki-portal-header">Create Category</div>
      <div className="wiki-portal-body">
        <form onSubmit={handleCreate} className="space-y-2">
          <div>
            <label className="block text-[11px] text-muted mb-0.5">Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-border bg-surface px-2 py-1 text-[13px] text-foreground focus:border-accent focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] text-muted mb-0.5">Icon (emoji)</label>
            <input
              type="text"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="e.g. ⚔️"
              className="w-24 border border-border bg-surface px-2 py-1 text-[13px] text-foreground focus:border-accent focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] text-muted mb-0.5">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-border bg-surface px-2 py-1 text-[13px] text-foreground focus:border-accent focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] text-muted mb-0.5">Parent category</label>
            <select
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              className="w-full border border-border bg-surface px-2 py-1 text-[13px] text-foreground focus:border-accent focus:outline-none"
            >
              <option value="">None (top-level)</option>
              {flatCategories.map(({ category, depth }) => (
                <option key={category.id} value={category.id}>
                  {"\u00A0".repeat(depth * 4)}
                  {depth > 0 ? "\u2514 " : ""}
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>
          {error && <p className="text-[12px] text-wiki-link-broken">{error}</p>}
          {success && <p className="text-[12px] text-accent">{success}</p>}
          <button
            type="submit"
            className="bg-accent px-3 py-1 text-[13px] font-bold text-white hover:bg-accent-hover"
          >
            Create
          </button>
        </form>
      </div>
    </div>
  );
}

function flattenTree(
  categories: Category[],
  depth = 0
): { category: Category; depth: number }[] {
  return categories.flatMap((cat) => [
    { category: cat, depth },
    ...(cat.children ? flattenTree(cat.children, depth + 1) : []),
  ]);
}
