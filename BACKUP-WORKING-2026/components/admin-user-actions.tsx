"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type AdminUserActionsProps = {
  userId: string;
  approved: boolean;
  isBlocked: boolean;
};

export default function AdminUserActions({
  userId,
  approved,
  isBlocked,
}: AdminUserActionsProps) {
  const router = useRouter();
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  async function runAction(action: "approve" | "block" | "unblock") {
    try {
      setLoadingAction(action);

      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          action,
        }),
      });

      const data = (await response.json().catch(() => null)) as
        | { error?: string; success?: boolean }
        | null;

      if (!response.ok) {
        alert(data?.error || "Aktion fehlgeschlagen.");
        setLoadingAction(null);
        return;
      }

      setLoadingAction(null);
      router.refresh();
    } catch (error) {
      console.error("ADMIN ACTION ERROR:", error);
      alert("Fehler bei der Aktion.");
      setLoadingAction(null);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {!approved && (
        <button
          type="button"
          onClick={() => runAction("approve")}
          disabled={loadingAction !== null}
          className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loadingAction === "approve" ? "..." : "Approve"}
        </button>
      )}

      {!isBlocked ? (
        <button
          type="button"
          onClick={() => runAction("block")}
          disabled={loadingAction !== null}
          className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loadingAction === "block" ? "..." : "Block"}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => runAction("unblock")}
          disabled={loadingAction !== null}
          className="rounded-xl bg-yellow-500 px-4 py-2 text-sm font-semibold text-black hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loadingAction === "unblock" ? "..." : "Unblock"}
        </button>
      )}
    </div>
  );
}