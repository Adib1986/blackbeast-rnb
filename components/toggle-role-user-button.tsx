"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type ToggleRoleUserButtonProps = {
  userId: string;
  role: string;
};

export default function ToggleRoleUserButton({
  userId,
  role,
}: ToggleRoleUserButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleToggleRole() {
    const confirmMessage =
      role === "ADMIN"
        ? "Diesen Admin wirklich wieder auf USER setzen?"
        : "Diesen User wirklich zum ADMIN machen?";

    const confirmed = confirm(confirmMessage);

    if (!confirmed) return;

    setLoading(true);

    try {
      const response = await fetch("/api/admin/toggle-role-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Rollenänderung fehlgeschlagen.");
        setLoading(false);
        return;
      }

      router.refresh();
    } catch {
      alert("Fehler bei der Rollenänderung.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleToggleRole}
      disabled={loading}
      className={`rounded-xl px-4 py-2 text-sm font-semibold text-black transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70 ${
        role === "ADMIN" ? "bg-yellow-500" : "bg-cyan-400"
      }`}
    >
      {loading ? "Bitte warten..." : role === "ADMIN" ? "Set USER" : "Make ADMIN"}
    </button>
  );
}