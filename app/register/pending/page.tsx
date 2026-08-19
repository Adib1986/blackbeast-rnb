import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

export default function RegisterPendingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black px-6 py-16 text-white">
      <div className="mx-auto max-w-lg rounded-3xl border border-yellow-500/20 bg-zinc-900/70 p-8 shadow-2xl">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-yellow-300">
          {SITE_NAME}
        </p>
        <h1 className="text-3xl font-bold text-yellow-400">
          Warte auf Freischaltung
        </h1>
        <p className="mt-4 text-sm leading-7 text-zinc-300">
          Dein Account ist erstellt. Du kannst dich noch nicht einloggen.
          Ein Admin muss dich zuerst freischalten. Danach funktioniert dein
          Login mit derselben E-Mail und demselben Passwort.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Zur Startseite
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-2xl bg-yellow-400 px-5 py-3 text-sm font-semibold text-black transition hover:scale-[1.01]"
          >
            Zum Login
          </Link>
        </div>
      </div>
    </main>
  );
}
