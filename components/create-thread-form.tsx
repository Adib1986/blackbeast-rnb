"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type CreateThreadFormProps = {
  categoryId: string;
  categorySlug: string;
};

export default function CreateThreadForm({
  categoryId,
  categorySlug,
}: CreateThreadFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/thread/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          categoryId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Thread konnte nicht erstellt werden.");
        setLoading(false);
        return;
      }

      router.push(`/forum/${categorySlug}`);
      router.refresh();
    } catch {
      setError("Beim Erstellen des Threads ist etwas schiefgelaufen.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-2 block text-sm text-zinc-300">Titel</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-2xl border border-zinc-700 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-yellow-400"
          placeholder="z. B. Best RNB Artists 2026"
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-zinc-300">Text</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[180px] w-full rounded-2xl border border-zinc-700 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-yellow-400"
          placeholder="Schreibe hier deinen ersten Beitrag..."
          required
        />
      </div>

      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="rounded-2xl bg-yellow-400 px-6 py-3 font-semibold text-black transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "Posting..." : "Thread posten"}
      </button>
    </form>
  );
}