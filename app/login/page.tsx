"use client";

import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const { status } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/forum");
      router.refresh();
    }
  }, [status, router]);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setInfo("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!result) {
        setError("Login fehlgeschlagen.");
        setLoading(false);
        return;
      }

      if (result.error) {
        setError(
          "Login fehlgeschlagen. Prüfe E-Mail, Passwort, Freischaltung oder Sperrstatus."
        );
        setLoading(false);
        return;
      }

      if (result.ok) {
        setInfo("Login erfolgreich. Weiterleitung...");
        router.push("/forum");
        router.refresh();
        return;
      }

      setError("Login fehlgeschlagen.");
    } catch {
      setError("Beim Login ist etwas schiefgelaufen.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black px-6 py-16 text-white">
      <div className="mx-auto max-w-md rounded-3xl border border-yellow-500/20 bg-zinc-900/70 p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-yellow-300">
            BlackBeast RNB
          </p>
          <h1 className="text-3xl font-bold text-yellow-400">Login</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Enter the board and feel the vibez.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-zinc-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-zinc-700 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-yellow-400"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-zinc-700 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-yellow-400"
              placeholder="********"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {info && (
            <div className="rounded-2xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">
              {info}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-yellow-400 px-4 py-3 font-semibold text-black transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-zinc-400">
          No account yet?{" "}
          <Link href="/register" className="text-purple-300 hover:text-purple-200">
            Register here
          </Link>
        </div>
      </div>
    </main>
  );
}