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
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="relative min-h-screen">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-fuchsia-700/20 blur-3xl" />
          <div className="absolute right-[-100px] top-[100px] h-[260px] w-[260px] rounded-full bg-violet-600/20 blur-3xl" />
          <div className="absolute bottom-[-120px] left-[18%] h-[280px] w-[280px] rounded-full bg-purple-900/20 blur-3xl" />
          <div className="absolute bottom-[10%] right-[10%] h-[220px] w-[220px] rounded-full bg-white/5 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.14),transparent_30%),radial-gradient(circle_at_bottom,rgba(217,70,239,0.08),transparent_35%)]" />
        </div>

        <section className="relative z-10 mx-auto max-w-4xl px-6 py-10">
          <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_0_40px_rgba(168,85,247,0.08)] backdrop-blur-md">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="mb-3 inline-flex rounded-full border border-fuchsia-400/20 bg-fuchsia-500/10 px-4 py-1 text-xs font-medium uppercase tracking-[0.25em] text-fuchsia-200">
                  New Thread
                </p>

                <h1 className="bg-gradient-to-r from-white via-fuchsia-200 to-violet-300 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-5xl">
                  {category.name}
                </h1>

                <p className="mt-3 text-sm text-zinc-300">
                  Erstelle einen neuen Thread in dieser Kategorie.
                </p>
              </div>

              <Link
                href={`/forum/${category.slug}`}
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-fuchsia-400/30 hover:bg-white/10"
              >
                Zurück zur Kategorie
              </Link>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-white/8 to-white/[0.03] p-6 shadow-[0_0_30px_rgba(168,85,247,0.08)] backdrop-blur-md">
            <CreateThreadForm
              categoryId={category.id}
              categorySlug={category.slug}
            />
          </div>
        </section>
      </div>
    </main>
  );
}