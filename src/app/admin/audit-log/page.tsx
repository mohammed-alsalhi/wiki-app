"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

type AuditEntry = {
  id: string;
  userId: string | null;
  username: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  entityLabel: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
};

const ACTION_LABELS: Record<string, string> = {
  "article.delete": "Article deleted",
  "article.create": "Article created",
  "article.status_change": "Status changed",
  "article.restore": "Article restored",
  "category.create": "Category created",
  "category.delete": "Category deleted",
  "user.role_change": "Role changed",
  "user.delete": "User deleted",
  "revision.revert": "Revision reverted",
  "discussion.delete": "Comment deleted",
};

const ACTION_COLOURS: Record<string, string> = {
  "article.delete": "text-red-500",
  "category.delete": "text-red-500",
  "user.delete": "text-red-500",
  "discussion.delete": "text-red-500",
  "revision.revert": "text-amber-500",
  "user.role_change": "text-amber-500",
  "article.create": "text-green-600",
  "category.create": "text-green-600",
};

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [actionFilter, setActionFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page) });
    if (actionFilter) params.set("action", actionFilter);
    const res = await fetch(`/api/admin/audit-log?${params}`);
    if (res.ok) {
      const data = await res.json();
      setLogs(data.logs);
      setTotal(data.total);
      setPages(data.pages);
    }
    setLoading(false);
  }, [page, actionFilter]);

  useEffect(() => { load(); }, [load]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-semibold text-heading">Audit Log</h1>
          <p className="text-[12px] text-muted mt-0.5">{total} entries total</p>
        </div>
        <Link href="/admin" className="h-6 px-2 text-[11px] border border-border rounded bg-surface hover:bg-surface-hover">
          ← Admin
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4">
        <select
          value={actionFilter}
          onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
          className="border border-border bg-surface px-2 py-1 text-[13px] text-foreground focus:border-accent focus:outline-none"
        >
          <option value="">All actions</option>
          {Object.entries(ACTION_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-[13px] text-muted italic">Loading...</p>
      ) : logs.length === 0 ? (
        <p className="text-[13px] text-muted italic">No entries found.</p>
      ) : (
        <div className="border border-border overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-surface-hover border-b border-border">
                <th className="text-left px-3 py-2 text-[11px] font-bold text-muted uppercase">Time</th>
                <th className="text-left px-3 py-2 text-[11px] font-bold text-muted uppercase">User</th>
                <th className="text-left px-3 py-2 text-[11px] font-bold text-muted uppercase">Action</th>
                <th className="text-left px-3 py-2 text-[11px] font-bold text-muted uppercase">Target</th>
                <th className="text-left px-3 py-2 text-[11px] font-bold text-muted uppercase">Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((entry, i) => (
                <tr key={entry.id} className={i % 2 === 0 ? "bg-surface" : "bg-surface-hover"}>
                  <td className="px-3 py-2 text-muted whitespace-nowrap">
                    {new Date(entry.createdAt).toLocaleString("en-US", {
                      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                    })}
                  </td>
                  <td className="px-3 py-2 font-medium text-heading">
                    {entry.username ?? <span className="text-muted italic">system</span>}
                  </td>
                  <td className={`px-3 py-2 font-medium ${ACTION_COLOURS[entry.action] ?? "text-foreground"}`}>
                    {ACTION_LABELS[entry.action] ?? entry.action}
                  </td>
                  <td className="px-3 py-2 text-foreground">
                    <span className="text-muted text-[11px] mr-1">{entry.entityType}</span>
                    {entry.entityLabel ?? entry.entityId ?? "—"}
                  </td>
                  <td className="px-3 py-2 text-muted text-[11px] max-w-[200px] truncate">
                    {entry.metadata ? JSON.stringify(entry.metadata) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center gap-2 mt-4">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="h-6 px-2 text-[11px] border border-border rounded bg-surface hover:bg-surface-hover disabled:opacity-40"
          >
            ← Prev
          </button>
          <span className="text-[12px] text-muted">Page {page} of {pages}</span>
          <button
            disabled={page >= pages}
            onClick={() => setPage((p) => p + 1)}
            className="h-6 px-2 text-[11px] border border-border rounded bg-surface hover:bg-surface-hover disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
