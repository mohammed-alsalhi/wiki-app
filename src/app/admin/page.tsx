"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/check")
      .then((r) => r.json())
      .then((data) => {
        setIsAdmin(data.admin);
        setLoading(false);
      });
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      setIsAdmin(true);
      setPassword("");
      router.refresh();
    } else {
      setError("Invalid password");
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setIsAdmin(false);
    router.refresh();
  }

  if (loading) {
    return <div className="py-8 text-center text-muted italic text-[13px]">Loading...</div>;
  }

  return (
    <div>
      <h1
        className="text-[1.5rem] font-normal text-heading border-b border-border pb-1 mb-4"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        Admin
      </h1>

      {isAdmin ? (
        <div>
          <div className="wiki-notice mb-4">
            You are logged in as admin. You can create, edit, and delete articles.
          </div>
          <button
            onClick={handleLogout}
            className="border border-border bg-surface-hover px-4 py-1.5 text-[13px] text-foreground hover:bg-surface"
          >
            Log out
          </button>
        </div>
      ) : (
        <div>
          <p className="text-[13px] text-foreground mb-4">
            Enter the admin password to enable editing.
          </p>
          <form onSubmit={handleLogin} className="max-w-sm space-y-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password..."
              required
              className="w-full border border-border bg-surface px-3 py-1.5 text-[14px] text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
            />
            {error && (
              <p className="text-[12px] text-wiki-link-broken">{error}</p>
            )}
            <button
              type="submit"
              className="bg-accent px-4 py-1.5 text-[13px] font-bold text-white hover:bg-accent-hover"
            >
              Log in
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
