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
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black px-6 py-12 text-white">
      <section className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-3 inline-block rounded-full border border-yellow-500/30 bg-yellow-500/10 px-4 py-1 text-sm uppercase tracking-[0.25em] text-yellow-300">
              Forum Area
            </p>

            <h1 className="text-4xl font-extrabold tracking-tight text-yellow-400 md:text-6xl">
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
              href="/admin"
              className="rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-3 font-semibold text-red-300 transition hover:scale-105"
            >
              Admin
            </Link>

            <LogoutButton />
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-2xl">
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
                  className="rounded-2xl border border-zinc-800 bg-black/30 p-6 transition hover:scale-[1.01] hover:border-yellow-500/30"
                >
                  <h3 className="text-2xl font-semibold text-yellow-300">
                    {category.name}
                  </h3>

                  <p className="mt-2 text-sm text-zinc-400">
                    Bereich öffnen
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