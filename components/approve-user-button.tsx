"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ApproveUserButton({ userId }: { userId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleApprove() {
    try {
      setLoading(true);

      const response = await fetch("/api/admin/approve-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Freischaltung fehlgeschlagen.");
        setLoading(false);
        return;
      }

      router.refresh();
    } catch {
      alert("Etwas ist schiefgelaufen.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleApprove}
      disabled={loading}
      className="rounded-2xl bg-green-500 px-4 py-2 text-sm font-semibold text-black transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {loading ? "Wird freigeschaltet..." : "Approve"}
    </button>
  );
}