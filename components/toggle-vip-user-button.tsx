"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type ToggleVipUserButtonProps = {
  userId: string;
  isVip: boolean;
};

export default function ToggleVipUserButton({
  userId,
  isVip,
}: ToggleVipUserButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleToggleVip() {
    const confirmed = confirm(
      isVip
        ? "VIP Status wirklich entfernen?"
        : "Diesen User wirklich zum VIP machen?"
    );

    if (!confirmed) return;

    setLoading(true);

    try {
      const response = await fetch("/api/admin/toggle-vip-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "VIP Aktion fehlgeschlagen.");
        setLoading(false);
        return;
      }

      router.refresh();
    } catch {
      alert("Fehler bei der VIP Aktion.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleToggleVip}
      disabled={loading}
      className={`rounded-xl px-4 py-2 text-sm font-semibold text-black transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70 ${
        isVip ? "bg-pink-500" : "bg-fuchsia-400"
      }`}
    >
      {loading ? "Bitte warten..." : isVip ? "Remove VIP" : "Make VIP"}
    </button>
  );
}