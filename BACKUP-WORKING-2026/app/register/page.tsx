"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

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
        setError(data.error || "Registration failed.");
        setLoading(false);
        return;
      }

      setMessage("Account created. Waiting for admin approval.");
      setUsername("");
      setEmail("");
      setPassword("");
    } catch {
      setError("Something went wrong. Please try again.");
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
          <h1 className="text-3xl font-bold text-yellow-400">Create Account</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Join the community. New accounts must be approved by admin.
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
              placeholder="Your username"
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
            <label className="mb-2 block text-sm text-zinc-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-zinc-700 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-yellow-400"
              placeholder="********"
              required
            />
          </div>

          {message && (
            <div className="rounded-2xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">
              {message}
            </div>
          )}

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
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-zinc-400">
          Already got an account?{" "}
          <Link href="/login" className="text-purple-300 hover:text-purple-200">
            Login here
          </Link>
        </div>
      </div>
    </main>
  );
}