"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  deleteReplyAction,
  updateReplyAction,
} from "@/lib/reply-actions";

type ReplyItemProps = {
  replyId: string;
  content: string;
  authorName: string;
  createdAt: string;
  categorySlug: string;
  threadId: string;
  canManage: boolean;
};

export default function ReplyItem({
  replyId,
  content,
  authorName,
  createdAt,
  categorySlug,
  threadId,
  canManage,
}: ReplyItemProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(content);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    const next = value.trim();

    if (!next) {
      setError("Antwort darf nicht leer sein.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await updateReplyAction({
        replyId,
        content: next,
        categorySlug,
        threadId,
      });
      setEditing(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Speichern fehlgeschlagen.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Antwort wirklich löschen?")) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      await deleteReplyAction({
        replyId,
        categorySlug,
        threadId,
      });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Löschen fehlgeschlagen.");
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-zinc-700 bg-zinc-900/70 px-3 py-1">
            von {authorName}
          </span>
          <span className="rounded-full border border-zinc-700 bg-zinc-900/70 px-3 py-1">
            {createdAt}
          </span>
        </div>

        {canManage ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setEditing((current) => !current);
                setValue(content);
                setError("");
              }}
              disabled={loading}
              className="rounded-lg border border-white/10 px-3 py-1 text-xs text-white/80 hover:bg-white/10 disabled:opacity-50"
            >
              {editing ? "Abbrechen" : "Bearbeiten"}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="rounded-lg border border-red-500/30 px-3 py-1 text-xs text-red-300 hover:bg-red-500/10 disabled:opacity-50"
            >
              Löschen
            </button>
          </div>
        ) : null}
      </div>

      {editing ? (
        <div className="space-y-3">
          <textarea
            value={value}
            onChange={(event) => setValue(event.target.value)}
            rows={4}
            className="w-full rounded-2xl border border-white/10 bg-zinc-950/80 px-4 py-3 text-sm text-white outline-none focus:border-fuchsia-400/40"
          />
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="rounded-xl border border-fuchsia-400/20 bg-fuchsia-600/20 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {loading ? "Speichert..." : "Speichern"}
          </button>
        </div>
      ) : (
        <p className="whitespace-pre-wrap text-sm leading-7 text-zinc-200">
          {content}
        </p>
      )}

      {error ? (
        <p className="mt-3 text-sm text-red-300">{error}</p>
      ) : null}
    </div>
  );
}
