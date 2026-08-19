"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { SITE_NAME } from "@/lib/site";

type SiteHeaderProps = {
  initialLoggedIn?: boolean;
  initialIsAdmin?: boolean;
  initialUserName?: string | null;
  pendingCount?: number;
};

export default function SiteHeader({
  initialLoggedIn = false,
  initialIsAdmin = false,
  initialUserName = null,
  pendingCount = 0,
}: SiteHeaderProps) {
  const { data: session, status } = useSession();
  const isLoggedIn =
    status === "authenticated" ||
    (status === "loading" && initialLoggedIn);
  const isAdmin =
    session?.user?.role === "ADMIN" ||
    (status === "loading" && initialIsAdmin);
  const userName = session?.user?.name || initialUserName;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/75 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3">
        <Link href="/" className="shrink-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-fuchsia-300">
            {SITE_NAME}
          </p>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3">
          {isLoggedIn ? (
            <Link
              href="/forum"
              className="rounded-xl px-3 py-2 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              Forum
            </Link>
          ) : null}

          <Link
            href="/admin"
            className="relative rounded-xl px-3 py-2 text-sm text-amber-200 transition hover:bg-white/10"
          >
            Admin
            {isAdmin && pendingCount > 0 ? (
              <span className="ml-2 inline-flex min-w-5 items-center justify-center rounded-full bg-amber-400 px-1.5 text-[11px] font-semibold text-black">
                {pendingCount}
              </span>
            ) : null}
          </Link>

          {isLoggedIn ? (
            <>
              {userName ? (
                <span className="hidden max-w-[140px] truncate text-sm text-white/50 sm:inline">
                  {userName}
                </span>
              ) : null}
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="inline-flex items-center rounded-xl border border-amber-400/30 bg-gradient-to-r from-fuchsia-600/20 to-amber-500/20 px-4 py-2 text-sm font-medium text-white transition hover:border-amber-300/60"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-xl px-3 py-2 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                Login
              </Link>
              <Link
                href="/join"
                className="rounded-xl bg-yellow-400 px-4 py-2 text-sm font-semibold text-black transition hover:scale-[1.01]"
              >
                Registrieren
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
