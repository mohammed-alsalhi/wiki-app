"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewLearningPathPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setError("Name is required"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/learning-paths", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, isPublic }),
      });
      if (!res.ok) throw new Error(await res.text());
      const path = await res.json();
      router.push(`/learning-paths/${path.id}`);
    } catch (err) {
      setError(String(err));
      setSaving(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-heading mb-6">New Learning Path</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text" value={name} onChange={(e) => setName(e.target.value)}
            className="w-full border border-border rounded px-3 py-2 text-sm bg-surface"
            placeholder="e.g. Getting Started Guide"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={description} onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-border rounded px-3 py-2 text-sm bg-surface"
            rows={3} placeholder="Optional description"
          />
        </div>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
          Make this path public
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit" disabled={saving}
          className="px-4 py-2 bg-accent text-white rounded text-sm disabled:opacity-50"
        >
          {saving ? "Creating…" : "Create Path"}
        </button>
      </form>
    </div>
  );
}
