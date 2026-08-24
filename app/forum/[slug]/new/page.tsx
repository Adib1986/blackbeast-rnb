import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireMember } from "@/lib/current-user";
import CreateThreadForm from "@/components/create-thread-form";

type NewThreadPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function NewThreadPage({ params }: NewThreadPageProps) {
  await requireMember();
  const { slug } = await params;

  if (!slug) {
    notFound();
  }

  const category = await prisma.category.findUnique({
    where: { slug },
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
        </div>

        <section className="relative z-10 mx-auto max-w-4xl px-6 py-10">
          <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="mb-3 inline-flex rounded-full border border-fuchsia-400/20 bg-fuchsia-500/10 px-4 py-1 text-xs font-medium uppercase tracking-[0.25em] text-fuchsia-200">
                  Neuer Thread
                </p>
                <h1 className="bg-gradient-to-r from-white via-fuchsia-200 to-violet-300 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-5xl">
                  {category.name}
                </h1>
                <p className="mt-3 text-sm text-zinc-300">
                  {category.slug === "vorstellung"
                    ? "Stell dich vor: Wer bist du, was hörst du, woran arbeitest du?"
                    : category.description ||
                      "Starte eine Diskussion in diesem Board."}
                </p>
              </div>
              <Link
                href={`/forum/${category.slug}`}
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Zurück zum Board
              </Link>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-white/8 to-white/[0.03] p-6">
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
