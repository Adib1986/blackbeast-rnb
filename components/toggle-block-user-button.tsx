"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type ToggleBlockUserButtonProps = {
  userId: string;
  isBlocked: boolean;
};

export default function ToggleBlockUserButton({
  userId,
  isBlocked,
}: ToggleBlockUserButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleToggleBlock() {
    const confirmMessage = isBlocked
      ? "User wirklich entsperren?"
      : "User wirklich sperren?";

    const confirmed = confirm(confirmMessage);

    if (!confirmed) return;

    setLoading(true);

    try {
      const response = await fetch("/api/admin/toggle-block-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Aktion fehlgeschlagen.");
        setLoading(false);
        return;
      }

      router.refresh();
    } catch {
      alert("Fehler bei der Aktion.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleToggleBlock}
      disabled={loading}
      className={`rounded-xl px-4 py-2 text-sm font-semibold text-black transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70 ${
        isBlocked ? "bg-green-500" : "bg-orange-500"
      }`}
    >
      {loading ? "Bitte warten..." : isBlocked ? "Unban" : "Ban"}
    </button>
  );
}