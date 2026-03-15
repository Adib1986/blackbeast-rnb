import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import CreateReplyForm from "@/components/create-reply-form";

type ThreadPageProps = {
  params: Promise<{
    slug: string;
    threadId: string;
  }>;
};

export default async function ThreadPage({ params }: ThreadPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { slug, threadId } = await params;

  if (!slug || !threadId) {
    notFound();
  }

  const thread = await prisma.thread.findUnique({
    where: {
      id: threadId,
    },
    include: {
      author: true,
      category: true,
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

  if (!thread || thread.category.slug !== slug) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black px-6 py-12 text-white">
      <section className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="mb-2 text-sm uppercase tracking-[0.25em] text-yellow-300">
              {thread.category.name}
            </p>

            <h1 className="text-4xl font-extrabold text-yellow-400">
              {thread.title}
            </h1>
          </div>

          <Link
            href={`/forum/${thread.category.slug}`}
            className="rounded-2xl bg-zinc-900 px-5 py-3 transition hover:bg-zinc-800"
          >
            Zurück zur Kategorie
          </Link>
        </div>

        <div className="mb-8 rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-2xl">
          <p className="whitespace-pre-wrap text-zinc-200">{thread.content}</p>

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-zinc-500">
            <span>Von: {thread.author.username}</span>
            <span>{new Date(thread.createdAt).toLocaleString("de-DE")}</span>
          </div>
        </div>

        <div className="mb-8 rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-2xl">
          <h2 className="mb-6 text-2xl font-bold text-white">Antworten</h2>

          {thread.replies.length === 0 ? (
            <p className="text-zinc-400">Noch keine Antworten vorhanden.</p>
          ) : (
            <div className="space-y-4">
              {thread.replies.map((reply) => (
                <div
                  key={reply.id}
                  className="rounded-2xl border border-zinc-800 bg-black/30 p-5"
                >
                  <p className="whitespace-pre-wrap text-zinc-200">
                    {reply.content}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-4 text-sm text-zinc-500">
                    <span>Von: {reply.author.username}</span>
                    <span>
                      {new Date(reply.createdAt).toLocaleString("de-DE")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-2xl">
          <h2 className="mb-6 text-2xl font-bold text-white">
            Antwort schreiben
          </h2>
          <CreateReplyForm threadId={thread.id} />
        </div>
      </section>
    </main>
  );
}