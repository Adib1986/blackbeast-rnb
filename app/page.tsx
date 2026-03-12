import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.18),_transparent_30%),radial-gradient(circle_at_bottom,_rgba(234,179,8,0.12),_transparent_30%),linear-gradient(to_bottom,_#050505,_#0b0b0f,_#050505)] text-white">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 rounded-full border border-fuchsia-500/20 bg-fuchsia-500/10 px-4 py-1 text-sm uppercase tracking-[0.35em] text-fuchsia-300">
          Real R&B Heads Only
        </p>

        <h1 className="mb-4 bg-gradient-to-r from-yellow-300 via-yellow-500 to-fuchsia-400 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent md:text-7xl">
          BlackBeast RNB
        </h1>

        <p className="mb-3 text-lg text-zinc-300 md:text-xl">
          Oldschool Vibes. Real Music. Exclusive Community.
        </p>

        <p className="mb-10 max-w-2xl text-sm text-zinc-500 md:text-base">
          Share tracks, build collabs, open threads, discover artists and step
          into the smoothest RNB board online.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/login"
            className="rounded-2xl bg-yellow-400 px-6 py-3 font-semibold text-black shadow-[0_0_25px_rgba(250,204,21,0.25)] transition hover:scale-105"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="rounded-2xl border border-fuchsia-500/30 bg-fuchsia-500/10 px-6 py-3 font-semibold text-fuchsia-200 shadow-[0_0_20px_rgba(217,70,239,0.15)] transition hover:scale-105"
          >
            Register
          </Link>

          <Link
            href="/forum"
            className="rounded-2xl border border-zinc-700 bg-zinc-900/70 px-6 py-3 font-semibold text-white transition hover:scale-105"
          >
            Forum
          </Link>

          <Link
            href="/vip"
            className="rounded-2xl border border-purple-400/30 bg-purple-500/10 px-6 py-3 font-semibold text-purple-200 shadow-[0_0_20px_rgba(168,85,247,0.15)] transition hover:scale-105"
          >
            VIP Area
          </Link>
        </div>
      </section>
    </main>
  );
}