import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const session = await auth();

  const categories = await prisma.category.findMany({
    orderBy: {
      createdAt: "asc",
    },
  });

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="mb-10 flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-fuchsia-300">
              BlackBeast RNB
            </p>
            <h1 className="mt-2 text-3xl font-semibold">Music Board</h1>
            <p className="mt-2 text-sm text-white/65">
              {session?.user
                ? `Willkommen, ${session.user.name ?? session.user.email ?? "User"}`
                : "Oldschool R&B Community"}
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href={session?.user ? "/forum" : "/login"}
              className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm transition hover:bg-white/10"
            >
              {session?.user ? "Zum Forum" : "Login"}
            </Link>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {categories.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-8 text-white/60">
              Noch keine Kategorien vorhanden.
            </div>
          ) : (
            categories.map((category) => (
              <article
                key={category.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
              >
                <h2 className="text-xl font-semibold">{category.name}</h2>
                <p className="mt-3 text-sm text-white/60">
                  Kategorie: {category.slug}
                </p>
              </article>
            ))
          )}
        </section>
      </div>
    </main>
  );
}