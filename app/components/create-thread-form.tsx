"use client";

import { FormEvent, useState } from "react";

export default function CreateThreadForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function createThread(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("Bitte Titel und Inhalt eingeben.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/thread/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
        }),
      });

      if (!res.ok) {
        throw new Error("Thread konnte nicht erstellt werden");
      }

      setTitle("");
      setContent("");
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Fehler beim Erstellen des Threads.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={createThread} className="space-y-4">
      <input
        type="text"
        placeholder="Thread title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none"
      />

      <textarea
        placeholder="Write your first post..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={6}
        className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none"
      />

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Thread"}
      </button>
    </form>
  );
}