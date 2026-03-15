"use client";

import { useState } from "react";

export default function ApproveUserButton({
  userId,
}: {
  userId: string;
}) {
  const [loading, setLoading] = useState(false);

  async function approveUser() {
    try {
      setLoading(true);

      const res = await fetch("/api/admin/approve-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!res.ok) {
        throw new Error("Freigeben fehlgeschlagen");
      }

      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("User konnte nicht freigegeben werden.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={approveUser}
      disabled={loading}
      className="rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
    >
      {loading ? "Approving..." : "Approve"}
    </button>
  );
}