import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ensureDefaultCategories, sortCategories } from "@/lib/ensure-categories";
import { SITE_NAME } from "@/lib/site";

export default async function HomePage() {
  const session = await auth();
  await ensureDefaultCategories();

  const categories = sortCategories(
    await prisma.category.findMany({
      orderBy: {
        createdAt: "asc",
      },
      include: {
        _count: {
          select: {
            threads: true,
          },
        },
      },
    })
  );

  const isLoggedIn = Boolean(session?.user);

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="relative min-h-screen">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-fuchsia-700/25 blur-3xl" />
          <div className="absolute right-[-80px] top-[120px] h-[260px] w-[260px] rounded-full bg-violet-600/25 blur-3xl" />
          <div className="absolute bottom-[-120px] left-[20%] h-[280px] w-[280px] rounded-full bg-amber-500/15 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-6 py-12">
          <section className="mb-12 rounded-[28px] border border-amber-400/20 bg-gradient-to-br from-fuchsia-950/50 via-zinc-950/80 to-amber-900/30 p-8 shadow-[0_0_80px_rgba(251,191,36,0.10)]">
            <p className="mb-3 inline-flex rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
              Members only • Invite Link
            </p>
            <h1 className="bg-gradient-to-r from-white via-fuchsia-200 to-amber-300 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl">
              {SITE_NAME}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base">
              Registriere dich über diesen Link. Ein Admin schaltet deinen
              Account danach frei. Erst dann kannst du dich einloggen und im
              Forum über R&B, Production und Releases sprechen.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {isLoggedIn ? (
                <Link
                  href="/forum"
                  className="rounded-2xl bg-yellow-400 px-5 py-3 text-sm font-semibold text-black transition hover:scale-[1.01]"
                >
                  Zum Forum
                </Link>
              ) : (
                <>
                  <Link
                      href="/join"
                    className="rounded-2xl bg-yellow-400 px-5 py-3 text-sm font-semibold text-black transition hover:scale-[1.01]"
                  >
                    Jetzt registrieren
                  </Link>
                  <Link
                    href="/login"
                    className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm transition hover:bg-white/10"
                  >
                    Ich bin schon freigeschaltet
                  </Link>
                </>
              )}
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Boards</h2>
              <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                {categories.length} Kategorien
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {categories.map((category) => {
                const href = isLoggedIn
                  ? `/forum/${category.slug}`
                  : "/join";

                return (
                  <Link
                    key={category.id}
                    href={href}
                    className="rounded-[26px] border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-amber-400/40 hover:bg-white/10"
                  >
                    <h3 className="text-xl font-semibold">{category.name}</h3>
                    {category.description ? (
                      <p className="mt-3 text-sm leading-6 text-white/70">
                        {category.description}
                      </p>
                    ) : null}
                    <p className="mt-3 text-sm text-white/60">
                      {category._count.threads} Threads
                    </p>
                    <p className="mt-4 text-sm text-amber-200">
                      {isLoggedIn ? "Zum Board →" : "Registrieren, um einzutreten →"}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
