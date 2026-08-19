import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireMember } from "@/lib/current-user";
import CreateReplyForm from "@/components/create-reply-form";
import ReplyItem from "@/components/reply-item";
import DeleteThreadButton from "@/components/delete-thread-button";

type ThreadPageProps = {
  params: Promise<{
    slug: string;
    threadId: string;
  }>;
};

export default async function ThreadDetailPage({ params }: ThreadPageProps) {
  const { user } = await requireMember();
  const { slug, threadId } = await params;

  if (!slug || !threadId) {
    notFound();
  }

  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) {
    notFound();
  }

  const thread = await prisma.thread.findFirst({
    where: {
      id: threadId,
      category: { slug },
    },
    include: {
      author: true,
      replies: {
        orderBy: { createdAt: "asc" },
        include: { author: true },
      },
    },
  });

  if (!thread) {
    notFound();
  }

  const authorName =
    thread.author?.username || thread.author?.email || "Unbekannt";
  const canDeleteThread =
    user.role === "ADMIN" || thread.authorId === user.id;

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="relative min-h-screen">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-fuchsia-700/20 blur-3xl" />
          <div className="absolute right-[-100px] top-[120px] h-[260px] w-[260px] rounded-full bg-violet-600/20 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-5xl px-6 py-8">
          <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.35em] text-fuchsia-300/80">
                  {category.name}
                </p>
                <h1 className="bg-gradient-to-r from-white via-fuchsia-200 to-violet-300 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-4xl">
                  {thread.title}
                </h1>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                  <span className="rounded-full border border-zinc-700 bg-zinc-900/70 px-3 py-1">
                    von {authorName}
                  </span>
                  <span className="rounded-full border border-zinc-700 bg-zinc-900/70 px-3 py-1">
                    {new Date(thread.createdAt).toLocaleDateString("de-DE")}
                  </span>
                  <span className="rounded-full border border-zinc-700 bg-zinc-900/70 px-3 py-1">
                    {thread.replies.length} Antworten
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href={`/forum/${category.slug}`}
                  className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  Zurück zum Board
                </Link>
                {canDeleteThread ? (
                  <DeleteThreadButton
                    threadId={thread.id}
                    categorySlug={category.slug}
                  />
                ) : null}
              </div>
            </div>
          </div>

          <article className="mb-8 rounded-[28px] border border-white/10 bg-gradient-to-br from-white/8 to-white/[0.03] p-6">
            <p className="whitespace-pre-wrap text-sm leading-8 text-zinc-200 sm:text-base">
              {thread.content}
            </p>
          </article>

          <section className="mb-8 rounded-[28px] border border-white/10 bg-gradient-to-br from-white/8 to-white/[0.03] p-6">
            <h2 className="mb-5 text-2xl font-bold text-white">Antworten</h2>

            {thread.replies.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-black/20 p-5 text-zinc-300">
                Noch keine Antworten. Schreib die erste.
              </div>
            ) : (
              <div className="space-y-4">
                {thread.replies.map((reply) => {
                  const replyAuthorName =
                    reply.author?.username ||
                    reply.author?.email ||
                    "Unbekannt";
                  const canManage =
                    user.role === "ADMIN" || reply.authorId === user.id;

                  return (
                    <ReplyItem
                      key={reply.id}
                      replyId={reply.id}
                      content={reply.content}
                      authorName={replyAuthorName}
                      createdAt={new Date(reply.createdAt).toLocaleDateString(
                        "de-DE"
                      )}
                      categorySlug={category.slug}
                      threadId={thread.id}
                      canManage={canManage}
                    />
                  );
                })}
              </div>
            )}
          </section>

          <section className="rounded-[28px] border border-white/10 bg-gradient-to-br from-white/8 to-white/[0.03] p-6">
            <h2 className="mb-5 text-2xl font-bold text-white">
              Antwort schreiben
            </h2>
            <CreateReplyForm threadId={thread.id} />
          </section>
        </div>
      </div>
    </main>
  );
}
