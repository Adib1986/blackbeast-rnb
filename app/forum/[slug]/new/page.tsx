import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import CreateThreadForm from "@/components/create-thread-form";

type NewThreadPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function NewThreadPage({
  params,
}: NewThreadPageProps) {
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
  });

  if (!category) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black px-6 py-12 text-white">
      <section className="mx-auto max-w-4xl">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-3 inline-block rounded-full border border-yellow-500/30 bg-yellow-500/10 px-4 py-1 text-sm uppercase tracking-[0.25em] text-yellow-300">
              New Thread
            </p>

            <h1 className="text-4xl font-extrabold tracking-tight text-yellow-400 md:text-5xl">
              {category.name}
            </h1>

            <p className="mt-2 text-zinc-400">
              Erstelle einen neuen Thread in dieser Kategorie.
            </p>
          </div>

          <Link
            href={`/forum/${category.slug}`}
            className="rounded-2xl border border-zinc-700 bg-zinc-900/60 px-5 py-3 font-semibold text-white transition hover:scale-105"
          >
            Zurück zur Kategorie
          </Link>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-2xl">
          <CreateThreadForm
            categoryId={category.id}
            categorySlug={category.slug}
          />
        </div>
      </section>
    </main>
  );
}