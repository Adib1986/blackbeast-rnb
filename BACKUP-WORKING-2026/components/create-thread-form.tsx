"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const cleanTitle = title.trim();
    const cleanContent = content.trim();

    if (!cleanTitle || !cleanContent) {
      setError("Bitte Titel und Inhalt ausfüllen.");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/threads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: cleanTitle,
          content: cleanContent,
          categoryId,
        }),
      });

      const data = (await response.json().catch(() => null)) as
        | { error?: string; success?: boolean; threadId?: string }
        | null;

      if (!response.ok) {
        setError(data?.error || "Thread konnte nicht erstellt werden.");
        setIsSubmitting(false);
        return;
      }

      router.push(`/forum/${categorySlug}`);
      router.refresh();
    } catch (error) {
      console.error("CREATE THREAD FORM ERROR:", error);
      setError("Etwas ist schiefgelaufen. Bitte erneut versuchen.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="title"
          className="mb-2 block text-sm font-medium text-zinc-200"
        >
          Titel
        </label>

        <input
          id="title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Gib deinem Thread einen Titel"
          className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-fuchsia-400/40"
        />
      </div>

      <div>
        <label
          htmlFor="content"
          className="mb-2 block text-sm font-medium text-zinc-200"
        >
          Inhalt
        </label>

        <textarea
          id="content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Worum geht es in deinem Thread?"
          rows={8}
          className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-fuchsia-400/40"
        />
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-2xl border border-fuchsia-400/20 bg-gradient-to-r from-fuchsia-600/20 to-violet-600/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-fuchsia-300/40 hover:shadow-[0_0_25px_rgba(168,85,247,0.18)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Wird erstellt..." : "Thread erstellen"}
        </button>
      </div>
    </form>
  );
}