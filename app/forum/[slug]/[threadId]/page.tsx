import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import CreateReplyForm from "@/components/create-reply-form";

type ThreadPageProps = {
  params: Promise<{
    slug: string;
    threadId: string;
  }>;
};

type UserLike = {
  name?: string | null;
  username?: string | null;
  email?: string | null;
};

export default async function ThreadDetailPage({
  params,
}: ThreadPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { slug, threadId } = await params;

  if (!slug || !threadId) {
    notFound();
  }

  const category = await prisma.category.findUnique({
    where: {
      slug,
    },
  });

  if (!category) {
    notFound();
  }

  const thread = await prisma.thread.findFirst({
    where: {
      id: threadId,
      category: {
        slug,
      },
    },
    include: {
      author: true,
      replies: {
        orderBy: {
          createdAt: "asc",
        },
        include: {
          author: true,
        },
      },
    },
  });

  if (!thread) {
    notFound();
  }

  const author = thread.author as UserLike | null;
  const authorName =
    author?.username || author?.name || author?.email || "Unknown user";

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="relative min-h-screen">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-fuchsia-700/20 blur-3xl" />
          <div className="absolute right-[-100px] top-[120px] h-[260px] w-[260px] rounded-full bg-violet-600/20 blur-3xl" />
          <div className="absolute bottom-[-120px] left-[20%] h-[280px] w-[280px] rounded-full bg-purple-900/20 blur-3xl" />
          <div className="absolute bottom-[10%] right-[10%] h-[220px] w-[220px] rounded-full bg-white/5 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.14),transparent_30%),radial-gradient(circle_at_bottom,rgba(217,70,239,0.08),transparent_35%)]" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-5xl px-6 py-8">
          <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_0_40px_rgba(168,85,247,0.08)] backdrop-blur-md">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.35em] text-fuchsia-300/80">
                  BlackBeast RNB
                </p>

                <h1 className="bg-gradient-to-r from-white via-fuchsia-200 to-violet-300 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-4xl">
                  {thread.title}
                </h1>

                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                  <span className="rounded-full border border-zinc-700 bg-zinc-900/70 px-3 py-1">
                    {category.name}
                  </span>

                  <span className="rounded-full border border-zinc-700 bg-zinc-900/70 px-3 py-1">
                    by {authorName}
                  </span>

                  <span className="rounded-full border border-zinc-700 bg-zinc-900/70 px-3 py-1">
                    {new Date(thread.createdAt).toLocaleDateString("de-DE")}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href={`/forum/${category.slug}`}
                  className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:border-fuchsia-400/30 hover:bg-white/10"
                >
                  Back to Category
                </Link>

                <Link
                  href="/forum"
                  className="inline-flex items-center justify-center rounded-2xl border border-fuchsia-400/20 bg-gradient-to-r from-fuchsia-600/20 to-violet-600/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-fuchsia-300/40 hover:shadow-[0_0_25px_rgba(168,85,247,0.18)]"
                >
                  Forum Overview
                </Link>
              </div>
            </div>
          </div>

          <article className="mb-8 rounded-[28px] border border-white/10 bg-gradient-to-br from-white/8 to-white/[0.03] p-6 shadow-[0_0_30px_rgba(168,85,247,0.08)] backdrop-blur-md">
            <p className="whitespace-pre-wrap text-sm leading-8 text-zinc-200 sm:text-base">
              {thread.content}
            </p>
          </article>

          <section className="mb-8 rounded-[28px] border border-white/10 bg-gradient-to-br from-white/8 to-white/[0.03] p-6 shadow-[0_0_30px_rgba(168,85,247,0.08)] backdrop-blur-md">
            <h2 className="mb-5 text-2xl font-bold text-white">Antworten</h2>

            {thread.replies.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-black/20 p-5 text-zinc-300">
                Noch keine Antworten vorhanden.
              </div>
            ) : (
              <div className="space-y-4">
                {thread.replies.map((reply) => {
                  const replyAuthor = reply.author as UserLike | null;
                  const replyAuthorName =
                    replyAuthor?.username ||
                    replyAuthor?.name ||
                    replyAuthor?.email ||
                    "Unknown user";

                  return (
                    <div
                      key={reply.id}
                      className="rounded-2xl border border-white/10 bg-black/20 p-5"
                    >
                      <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                        <span className="rounded-full border border-zinc-700 bg-zinc-900/70 px-3 py-1">
                          by {replyAuthorName}
                        </span>

                        <span className="rounded-full border border-zinc-700 bg-zinc-900/70 px-3 py-1">
                          {new Date(reply.createdAt).toLocaleDateString("de-DE")}
                        </span>
                      </div>

                      <p className="whitespace-pre-wrap text-sm leading-7 text-zinc-200">
                        {reply.content}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <section className="rounded-[28px] border border-white/10 bg-gradient-to-br from-white/8 to-white/[0.03] p-6 shadow-[0_0_30px_rgba(168,85,247,0.08)] backdrop-blur-md">
            <h2 className="mb-5 text-2xl font-bold text-white">
              Antwort schreiben
            </h2>

            <CreateReplyForm
              threadId={thread.id}
              categorySlug={category.slug}
              threadIdForRoute={thread.id}
            />
          </section>
        </div>
      </div>
    </main>
  );
}