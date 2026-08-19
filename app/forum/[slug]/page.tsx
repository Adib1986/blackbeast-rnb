import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { requireMember } from "@/lib/current-user";

type CategoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  await requireMember();

  const { slug } = await params;

  if (!slug) {
    notFound();
  }

  const category = await prisma.category.findUnique({
    where: {
      slug,
    },
    include: {
      threads: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          author: true,
          _count: {
            select: {
              replies: true,
            },
          },
        },
      },
    },
  });

  if (!category) {
    notFound();
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="relative min-h-screen">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-fuchsia-700/20 blur-3xl" />
          <div className="absolute right-[-100px] top-[120px] h-[260px] w-[260px] rounded-full bg-violet-600/20 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-8">
          <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.35em] text-fuchsia-300/80">
                  Board
                </p>
                <h1 className="bg-gradient-to-r from-white via-fuchsia-200 to-violet-300 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-4xl">
                  {category.name}
                </h1>
                <p className="mt-3 text-sm text-zinc-300">
                  {category.threads.length} Threads in diesem Board.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/forum"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  Alle Boards
                </Link>
                <Link
                  href={`/forum/${category.slug}/new`}
                  className="inline-flex items-center justify-center rounded-2xl border border-fuchsia-400/20 bg-gradient-to-r from-fuchsia-600/20 to-violet-600/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-fuchsia-300/40"
                >
                  Neuer Thread
                </Link>
              </div>
            </div>
          </div>

          {category.threads.length === 0 ? (
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-8 text-zinc-300">
              <p className="text-base font-medium text-white">
                Noch keine Threads in diesem Board.
              </p>
              <p className="mt-2 text-sm text-zinc-400">
                Eröffne die erste Diskussion.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {category.threads.map((thread) => {
                const authorName =
                  thread.author?.username ||
                  thread.author?.email ||
                  "Unbekannt";

                return (
                  <Link
                    key={thread.id}
                    href={`/forum/${category.slug}/${thread.id}`}
                    className="group block rounded-[24px] border border-white/10 bg-gradient-to-br from-white/8 to-white/[0.03] p-6 transition duration-300 hover:-translate-y-1 hover:border-fuchsia-400/30"
                  >
                    <h2 className="text-xl font-semibold text-white transition group-hover:text-fuchsia-200">
                      {thread.title}
                    </h2>
                    <p className="mt-3 line-clamp-3 text-sm leading-7 text-zinc-300">
                      {thread.content}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                      <span className="rounded-full border border-zinc-700 bg-zinc-900/70 px-3 py-1">
                        von {authorName}
                      </span>
                      <span className="rounded-full border border-zinc-700 bg-zinc-900/70 px-3 py-1">
                        {thread._count.replies} Antworten
                      </span>
                      <span className="rounded-full border border-zinc-700 bg-zinc-900/70 px-3 py-1">
                        {new Date(thread.createdAt).toLocaleDateString("de-DE")}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
