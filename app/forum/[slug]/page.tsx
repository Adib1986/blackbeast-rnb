import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";

type CategoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CategoryPage({
  params,
}: CategoryPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

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
        },
      },
    },
  });

  if (!category) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 flex items-center justify-between">
          <h1 className="text-4xl font-bold text-yellow-400">
            {category.name}
          </h1>

          <div className="flex gap-3">
            <Link
              href="/forum"
              className="rounded-xl bg-zinc-900 px-6 py-3 transition hover:bg-zinc-800"
            >
              Back to Forum
            </Link>

            <Link
              href={`/forum/${category.slug}/new`}
              className="rounded-xl bg-yellow-500 px-6 py-3 font-semibold text-black"
            >
              New Thread
            </Link>
          </div>
        </div>

        {category.threads.length === 0 ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8">
            <p className="text-zinc-400">No threads yet in this category.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {category.threads.map((thread) => (
              <div key={thread.id} className="rounded-xl bg-zinc-900 p-6">
                <h2 className="text-xl font-semibold text-yellow-300">
                  {thread.title}
                </h2>

                <p className="mt-2 text-zinc-400">{thread.content}</p>

                <p className="mt-3 text-sm text-zinc-500">
                  by {thread.author.username}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}