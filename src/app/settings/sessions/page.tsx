"use client";

import { useEffect, useState } from "react";

type SessionInfo = {
  id: string;
  createdAt: string;
  expiresAt: string;
  userAgent: string | null;
  ipAddress: string | null;
};

function parseUA(ua: string | null): string {
  if (!ua) return "Unknown device";
  if (/iPhone|iPad|iPod/i.test(ua)) return "iOS device";
  if (/Android/i.test(ua)) return "Android device";
  if (/Windows/i.test(ua)) return "Windows";
  if (/Macintosh/i.test(ua)) return "Mac";
  if (/Linux/i.test(ua)) return "Linux";
  return ua.slice(0, 60);
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [revoking, setRevoking] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/sessions");
    if (res.ok) setSessions(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function revoke(id: string) {
    setRevoking(id);
    await fetch(`/api/sessions/${id}`, { method: "DELETE" });
    setSessions((s) => s.filter((x) => x.id !== id));
    setRevoking(null);
  }

  async function revokeAll() {
    if (!confirm("Revoke all other sessions? You will need to log in again on those devices.")) return;
    // Revoke all except first (most recent = current session)
    const others = sessions.slice(1);
    for (const s of others) {
      await fetch(`/api/sessions/${s.id}`, { method: "DELETE" });
    }
    setSessions((s) => s.slice(0, 1));
  }

  if (loading) return <p className="text-[13px] text-muted p-4">Loading…</p>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold text-heading mb-1">Active Sessions</h1>
      <p className="text-[13px] text-muted mb-4">These are devices currently logged in to your account. Revoke sessions you don&apos;t recognise.</p>

      {sessions.length === 0 ? (
        <p className="text-[13px] text-muted italic">No active sessions found.</p>
      ) : (
        <div className="space-y-2">
          {sessions.map((s, i) => (
            <div key={s.id} className="border border-border rounded px-4 py-3 bg-surface flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[13px] font-medium text-foreground">{parseUA(s.userAgent)}</span>
                  {i === 0 && (
                    <span className="text-[10px] bg-accent/15 text-accent px-1.5 py-0.5 rounded">Current</span>
                  )}
                </div>
                <div className="text-[11px] text-muted">
                  {s.ipAddress && <span className="mr-3">IP: {s.ipAddress}</span>}
                  <span>Signed in {new Date(s.createdAt).toLocaleDateString()}</span>
                  <span className="mx-1.5">·</span>
                  <span>Expires {new Date(s.expiresAt).toLocaleDateString()}</span>
                </div>
              </div>
              {i !== 0 && (
                <button
                  onClick={() => revoke(s.id)}
                  disabled={revoking === s.id}
                  className="h-6 px-2 text-[11px] border border-border rounded text-muted hover:text-red-500 hover:border-red-300 transition-colors flex-shrink-0"
                >
                  {revoking === s.id ? "Revoking…" : "Revoke"}
                </button>
              )}
            </div>
          ))}

          {sessions.length > 1 && (
            <button
              onClick={revokeAll}
              className="h-6 px-2 text-[11px] border border-red-300 rounded text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 mt-2"
            >
              Revoke all other sessions
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export const dynamic = "force-dynamic";
