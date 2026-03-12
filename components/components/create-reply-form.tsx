"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type CreateReplyFormProps = {
  threadId: string;
};

export default function CreateReplyForm({
  threadId,
}: CreateReplyFormProps) {
  const router = useRouter();

  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/reply/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          threadId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Antwort konnte nicht erstellt werden.");
        setLoading(false);
        return;
      }

      setContent("");
      router.refresh();
    } catch {
      setError("Beim Erstellen der Antwort ist etwas schiefgelaufen.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-2 block text-sm text-zinc-300">
          Deine Antwort
        </label>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[140px] w-full rounded-2xl border border-zinc-700 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-yellow-400"
          placeholder="Schreibe deine Antwort..."
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
        {loading ? "Posting..." : "Antwort posten"}
      </button>
    </form>
  );
}