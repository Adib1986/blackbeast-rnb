import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import LogoutButton from "@/components/logout-button";

export default async function ForumPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const categories = await prisma.category.findMany({
    orderBy: {
      createdAt: "asc",
    },
  });

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.14),_transparent_25%),radial-gradient(circle_at_bottom,_rgba(234,179,8,0.1),_transparent_30%),linear-gradient(to_bottom,_#050505,_#0b0b0f,_#050505)] px-6 py-12 text-white">
      <section className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-4 rounded-3xl border border-zinc-800 bg-black/30 p-6 shadow-[0_0_40px_rgba(0,0,0,0.35)] md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-3 inline-block rounded-full border border-yellow-500/20 bg-yellow-500/10 px-4 py-1 text-sm uppercase tracking-[0.3em] text-yellow-300">
              Forum Area
            </p>

            <h1 className="bg-gradient-to-r from-yellow-300 via-yellow-500 to-fuchsia-400 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent md:text-6xl">
              BlackBeast RNB Forum
            </h1>

            <p className="mt-3 text-zinc-300">
              Willkommen,{" "}
              <span className="font-semibold text-yellow-300">
                {session.user.name}
              </span>
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              Rolle: {session.user.role}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/tracks"
              className="rounded-2xl border border-fuchsia-500/30 bg-fuchsia-500/10 px-5 py-3 font-semibold text-fuchsia-200 transition hover:scale-105"
            >
              Member Tracks
            </Link>

            <Link
              href="/vip"
              className="rounded-2xl border border-purple-500/30 bg-purple-500/10 px-5 py-3 font-semibold text-purple-200 transition hover:scale-105"
            >
              VIP Area
            </Link>

            <Link
              href="/admin"
              className="rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-3 font-semibold text-red-300 transition hover:scale-105"
            >
              Admin
            </Link>

            <LogoutButton />
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-[0_0_30px_rgba(168,85,247,0.08)]">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white">Forum Kategorien</h2>
            <p className="mt-2 text-sm text-zinc-400">
              Wähle einen Bereich aus und betrete das Board.
            </p>
          </div>

          {categories.length === 0 ? (
            <div className="rounded-2xl border border-zinc-800 bg-black/30 px-4 py-6 text-center text-zinc-400">
              Noch keine Kategorien vorhanden.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/forum/${category.slug}`}
                  className="group rounded-2xl border border-zinc-800 bg-black/40 p-6 transition hover:scale-[1.01] hover:border-yellow-500/30 hover:shadow-[0_0_25px_rgba(250,204,21,0.08)]"
                >
                  <h3 className="text-2xl font-semibold text-yellow-300 transition group-hover:text-yellow-200">
                    {category.name}
                  </h3>

                  <p className="mt-2 text-sm text-zinc-500">
                    Open category
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}