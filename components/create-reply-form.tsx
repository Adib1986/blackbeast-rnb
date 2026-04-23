"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type CreateReplyFormProps = {
  threadId: string;
  categorySlug?: string;
  threadIdForRoute?: string;
};

export default function CreateReplyForm({
  threadId,
}: CreateReplyFormProps) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!content.trim()) {
      setMessage("Bitte eine Antwort eingeben.");
      return;
    }

    try {
      setIsSubmitting(true);

      const res = await fetch("/api/replies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          threadId,
          content,
        }),
      });

      const data = (await res.json().catch(() => null)) as
        | { error?: string; success?: boolean }
        | null;

      if (!res.ok) {
        setMessage(data?.error || "Antwort konnte nicht erstellt werden.");
        setIsSubmitting(false);
        return;
      }

      setContent("");
      setMessage("");
      setIsSubmitting(false);
      router.refresh();
    } catch (error) {
      console.error("CREATE REPLY ERROR:", error);
      setMessage("Antwort konnte nicht erstellt werden.");
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-white/10 bg-black/20 p-5"
    >
      <label className="mb-3 block text-sm font-semibold text-zinc-200">
        Antwort schreiben
      </label>

      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        rows={4}
        placeholder="Schreibe deine Antwort..."
        className="w-full rounded-2xl border border-white/10 bg-zinc-950/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-fuchsia-400/40"
      />

      {message ? (
        <div className="mt-3 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {message}
        </div>
      ) : null}

      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-2xl border border-fuchsia-400/20 bg-gradient-to-r from-fuchsia-600/20 to-violet-600/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-fuchsia-300/40 hover:shadow-[0_0_25px_rgba(168,85,247,0.18)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Wird gesendet..." : "Antwort posten"}
        </button>
      </div>
    </form>
  );
}