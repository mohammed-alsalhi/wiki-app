"use client";

import { useState, useEffect } from "react";

type Category = { id: string; name: string; slug: string; icon: string | null };

type Props = {
  value: string;
  onChange: (id: string) => void;
};

export default function CategorySelect({ value, onChange }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories);
  }, []);

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-border bg-white px-2 py-1.5 text-[13px] text-foreground focus:border-accent focus:outline-none"
    >
      <option value="">No category</option>
      {categories.map((cat) => (
        <option key={cat.id} value={cat.id}>
          {cat.icon} {cat.name}
        </option>
      ))}
    </select>
  );
}
