import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireMember } from "@/lib/current-user";
import { ensureDefaultCategories } from "@/lib/ensure-categories";
import { SITE_NAME } from "@/lib/site";

export default async function ForumPage() {
  const { user } = await requireMember();
  await ensureDefaultCategories();

  const categories = await prisma.category.findMany({
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
  });

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="relative min-h-screen">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-fuchsia-700/25 blur-3xl" />
          <div className="absolute right-[-80px] top-[120px] h-[260px] w-[260px] rounded-full bg-violet-600/25 blur-3xl" />
          <div className="absolute bottom-[-120px] left-[20%] h-[280px] w-[280px] rounded-full bg-purple-900/25 blur-3xl" />
          <div className="absolute bottom-[10%] right-[10%] h-[240px] w-[240px] rounded-full bg-amber-500/20 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-8">
          <header className="mb-10 rounded-3xl border border-white/10 bg-white/5 px-6 py-5 shadow-[0_0_40px_rgba(168,85,247,0.12)] backdrop-blur-md">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.38em] text-fuchsia-300/80">
              {SITE_NAME}
            </p>
            <h1 className="bg-gradient-to-r from-white via-fuchsia-200 to-amber-300 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-5xl">
              Community Forum
            </h1>
            <p className="mt-3 text-sm text-zinc-300">
              Willkommen{user.username ? `, ${user.username}` : ""}.
            </p>
          </header>

          <section className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white sm:text-xl">
                Boards
              </h3>
              <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                {categories.length} Kategorien
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/forum/${category.slug}`}
                  className="group relative overflow-hidden rounded-[26px] border border-white/10 bg-gradient-to-br from-white/8 to-white/[0.03] p-6 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-amber-400/40 hover:shadow-[0_0_35px_rgba(251,191,36,0.25)]"
                >
                  <div className="relative z-10">
                    <div className="mb-5 flex items-start justify-between gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-400/30 bg-amber-500/10 text-lg text-amber-200">
                        ♫
                      </div>
                      <span className="rounded-full border border-zinc-700 bg-zinc-900/70 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-zinc-400">
                        {category._count.threads} Threads
                      </span>
                    </div>

                    <h4 className="text-xl font-bold text-white transition group-hover:text-amber-200">
                      {category.name}
                    </h4>
                    <p className="mt-6 flex items-center text-sm font-medium text-amber-200">
                      Zum Board
                      <span className="ml-2 transition group-hover:translate-x-1">
                        →
                      </span>
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
