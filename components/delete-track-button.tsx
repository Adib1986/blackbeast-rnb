"use client";

import { useState } from "react";

type DeleteTrackButtonProps = {
  trackId: string;
};

export default function DeleteTrackButton({
  trackId,
}: DeleteTrackButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    const confirmed = window.confirm("Diesen Track wirklich löschen?");
    if (!confirmed) return;

    try {
      setIsDeleting(true);
      setError("");

      const res = await fetch("/api/tracks/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          trackId,
        }),
      });

      const text = await res.text();

      let data:
        | { error?: string; success?: boolean; deletedTrackId?: string }
        | null = null;

      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = null;
      }

      if (!res.ok) {
        setError(
          data?.error ||
            `Löschen fehlgeschlagen (HTTP ${res.status})`
        );
        setIsDeleting(false);
        return;
      }

      window.location.reload();
    } catch (error) {
      console.error("DELETE TRACK BUTTON ERROR:", error);
      setError("Löschen fehlgeschlagen");
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        className="inline-flex items-center justify-center rounded-2xl border border-red-400/20 bg-red-500/10 px-5 py-3 text-sm font-medium text-red-200 transition hover:border-red-300/40 hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isDeleting ? "Löscht..." : "Delete"}
      </button>

      {error ? (
        <p className="text-xs text-red-300">{error}</p>
      ) : null}
    </div>
  );
}