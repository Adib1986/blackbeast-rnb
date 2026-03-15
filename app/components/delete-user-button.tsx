"use client";

import { useState } from "react";

export default function DeleteUserButton({
  userId,
}: {
  userId: string;
}) {
  const [loading, setLoading] = useState(false);

  async function deleteUser() {
    const confirmed = window.confirm("Diesen User wirklich löschen?");
    if (!confirmed) return;

    try {
      setLoading(true);

      const res = await fetch("/api/admin/delete-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!res.ok) {
        throw new Error("Löschen fehlgeschlagen");
      }

      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("User konnte nicht gelöscht werden.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={deleteUser}
      disabled={loading}
      className="rounded-lg bg-red-700 px-3 py-2 text-sm font-semibold text-white hover:bg-red-800 disabled:opacity-50"
    >
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}