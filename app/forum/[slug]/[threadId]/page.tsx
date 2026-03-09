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

  const thread = await prisma.thread.findUnique({
    where: {
      id: threadId
    },
    include: {
      author: true,
      category: true,
      replies: {
        orderBy: {
          createdAt: "asc"
        },
        include: {
          author: true
        }
      }
    }
  });

  if (!thread || thread.category.slug !== slug) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">

      <div className="max-w-4xl mx-auto">

        <Link
          href={`/forum/${slug}`}
          className="text-yellow-400 mb-6 inline-block"
        >
          ← Back to Category
        </Link>

        <div className="bg-zinc-900 p-6 rounded-xl mb-10">

          <h1 className="text-3xl text-yellow-400 font-bold mb-4">
            {thread.title}
          </h1>

          <p className="text-zinc-300 whitespace-pre-wrap">
            {thread.content}
          </p>

          <p className="text-sm text-zinc-500 mt-4">
            by {thread.author.username}
          </p>

        </div>

        <h2 className="text-2xl mb-6 text-yellow-300">
          Replies
        </h2>

        {thread.replies.length === 0 && (
          <p className="text-zinc-400 mb-10">
            No replies yet.
          </p>
        )}

        <div className="space-y-6 mb-10">

          {thread.replies.map((reply) => (

            <div
              key={reply.id}
              className="bg-zinc-900 p-5 rounded-xl"
            >

              <p className="text-zinc-200 whitespace-pre-wrap">
                {reply.content}
              </p>

              <p className="text-sm text-zinc-500 mt-3">
                by {reply.author.username}
              </p>

            </div>

          ))}

        </div>

        <div className="bg-zinc-900 p-6 rounded-xl">

          <h3 className="text-xl mb-4 text-yellow-300">
            Write a Reply
          </h3>

          <CreateReplyForm threadId={thread.id} />

        </div>

      </div>

    </main>
  );
}