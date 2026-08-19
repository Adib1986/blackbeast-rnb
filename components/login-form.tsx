"use client";

import { signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { SITE_NAME } from "@/lib/site";

function errorMessage(code?: string) {
  switch (code) {
    case "unapproved":
      return "Dein Account wartet noch auf Freischaltung durch einen Admin.";
    case "blocked":
      return "Dein Account ist gesperrt.";
    case "admin":
      return "Dieser Account hat keinen Admin-Zugang. Bitte mit dem Admin-Konto einloggen.";
    default:
      return code ? "E-Mail oder Passwort ist falsch." : "";
  }
}

export default function LoginForm({
  callbackUrl,
  initialError = "",
  loggedInAs = "",
  adminLogin = false,
}: {
  callbackUrl: string;
  initialError?: string;
  loggedInAs?: string;
  adminLogin?: boolean;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(errorMessage(initialError));
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setInfo("");

    try {
      const result = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
      });

      if (!result) {
        setError("Login fehlgeschlagen.");
        return;
      }

      if (result.error) {
        setError(errorMessage(result.code) || "E-Mail oder Passwort ist falsch.");
        return;
      }

      if (result.ok) {
        setInfo("Login erfolgreich. Weiterleitung...");
        window.location.assign(callbackUrl);
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
    <div className="mx-auto max-w-md rounded-3xl border border-yellow-500/20 bg-zinc-900/70 p-8 shadow-2xl">
      <div className="mb-8 text-center">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-yellow-300">
          {SITE_NAME}
        </p>
        <h1 className="text-3xl font-bold text-yellow-400">
          {adminLogin ? "Admin Login" : "Login"}
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          {adminLogin
            ? "Mit dem Admin-Konto einloggen, um neue User freizuschalten."
            : "Enter the board and feel the vibez."}
        </p>
      </div>

      {loggedInAs ? (
        <div className="mb-4 rounded-2xl border border-amber-400/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          Du bist gerade als <strong>{loggedInAs}</strong> eingeloggt. Das ist
          kein Admin-Account. Logge dich unten mit dem Admin-Konto ein.
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/login?callbackUrl=/admin" })}
            className="mt-3 block text-amber-100 underline"
          >
            Zuerst ausloggen
          </button>
        </div>
      ) : null}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm text-zinc-300">
            Email oder Username
          </label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-zinc-700 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-yellow-400"
            placeholder="Email oder Username"
            autoComplete="username"
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
          {loading ? "Logging in..." : adminLogin ? "Als Admin einloggen" : "Login"}
        </button>
      </form>

      <div className="mt-6 space-y-2 text-center text-sm text-zinc-400">
        <p>
          Noch kein Account?{" "}
          <Link href="/join" className="text-purple-300 hover:text-purple-200">
            Registrieren
          </Link>
        </p>
        <p>
          <Link href="/" className="text-zinc-500 hover:text-zinc-300">
            Zur Startseite
          </Link>
        </p>
      </div>
    </div>
  );
}
