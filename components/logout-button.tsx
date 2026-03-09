"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="mt-6 rounded-2xl border border-purple-500 bg-purple-600/20 px-5 py-3 font-semibold text-purple-200 transition hover:scale-105"
    >
      Logout
    </button>
  );
}