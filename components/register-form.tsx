"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SITE_NAME } from "@/lib/site";

export default function RegisterForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Registrierung fehlgeschlagen.");
        setLoading(false);
        return;
      }

      router.push("/register/pending");
    } catch {
      setError("Etwas ist schiefgelaufen. Bitte erneut versuchen.");
      setLoading(false);
    }
  }

  return (
    <div className="rounded-3xl border border-yellow-500/20 bg-zinc-900/70 p-8 shadow-2xl">
      <div className="mb-8 text-center">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-yellow-300">
          {SITE_NAME}
        </p>
        <h1 className="text-3xl font-bold text-yellow-400">Konto erstellen</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Nach der Registrierung muss ein Admin dich erst freischalten.
          Danach kannst du dich einloggen.
        </p>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm text-zinc-300">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-2xl border border-zinc-700 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-yellow-400"
            placeholder="Dein Name im Forum"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-zinc-300">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-zinc-700 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-yellow-400"
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-zinc-300">Passwort</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl border border-zinc-700 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-yellow-400"
            placeholder="Mindestens 6 Zeichen"
            minLength={6}
            required
          />
        </div>

        {error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-yellow-400 px-4 py-3 font-semibold text-black transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Konto wird erstellt..." : "Registrieren"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-zinc-400">
        Schon freigeschaltet?{" "}
        <Link href="/login" className="text-purple-300 hover:text-purple-200">
          Zum Login
        </Link>
      </div>
    </div>
  );
}
