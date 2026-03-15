"use client";

import { useState } from "react";

export default function ToggleBlockUser({
  userId,
  blocked,
}: {
  userId: string;
  blocked: boolean;
}) {
  const [loading, setLoading] = useState(false);

  async function toggleBlock() {
    try {
      setLoading(true);

      const res = await fetch("/api/admin/toggle-block-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!res.ok) {
        throw new Error("Block/Unblock fehlgeschlagen");
      }

      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Status konnte nicht geändert werden.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggleBlock}
      disabled={loading}
      className="rounded-lg bg-yellow-500 px-3 py-2 text-sm font-semibold text-black hover:bg-yellow-400 disabled:opacity-50"
    >
      {loading ? "Saving..." : blocked ? "Unblock" : "Block"}
    </button>
  );
}