"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteThreadAction } from "@/lib/thread-actions";

export default function DeleteThreadButton({
  threadId,
  categorySlug,
}: {
  threadId: string;
  categorySlug: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    if (!window.confirm("Thread wirklich löschen? Alle Antworten gehen verloren.")) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      await deleteThreadAction({ threadId, categorySlug });
      router.push(`/forum/${categorySlug}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Löschen fehlgeschlagen.");
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleDelete}
        disabled={loading}
        className="inline-flex items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-3 text-sm font-medium text-red-200 transition hover:bg-red-500/20 disabled:opacity-50"
      >
        {loading ? "Löscht..." : "Thread löschen"}
      </button>
      {error ? <p className="mt-2 text-xs text-red-300">{error}</p> : null}
    </div>
  );
}
