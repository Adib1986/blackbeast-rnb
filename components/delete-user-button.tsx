"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteUserButton({ userId }: { userId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {

    const confirmDelete = confirm("User wirklich löschen?");

    if (!confirmDelete) return;

    setLoading(true);

    const res = await fetch("/api/admin/delete-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    if (!res.ok) {
      alert("Löschen fehlgeschlagen.");
      setLoading(false);
      return;
    }

    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-black hover:scale-105"
    >
      {loading ? "Lösche..." : "Delete"}
    </button>
  );
}