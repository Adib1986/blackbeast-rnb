"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="inline-flex items-center rounded-2xl border border-amber-400/30 bg-gradient-to-r from-fuchsia-600/20 to-amber-500/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition hover:border-amber-300/60 hover:shadow-[0_0_25px_rgba(251,191,36,0.3)]"
    >
      Logout
    </button>
  );
}