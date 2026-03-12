import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import LogoutButton from "@/components/logout-button";

export default async function VipPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "ADMIN" && !user.isVip) {
    redirect("/forum");
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.16),_transparent_25%),radial-gradient(circle_at_bottom,_rgba(217,70,239,0.1),_transparent_30%),linear-gradient(to_bottom,_#040404,_#09090f,_#040404)] px-6 py-12 text-white">
      <section className="mx-auto max-w-5xl">
        <div className="mb-10 flex flex-col gap-4 rounded-3xl border border-fuchsia-500/20 bg-black/30 p-6 shadow-[0_0_35px_rgba(168,85,247,0.12)] md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-3 inline-block rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 px-4 py-1 text-sm uppercase tracking-[0.3em] text-fuchsia-300">
              VIP Area
            </p>

            <h1 className="bg-gradient-to-r from-fuchsia-300 via-purple-300 to-yellow-300 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent md:text-6xl">
              BlackBeast VIP
            </h1>

            <p className="mt-3 text-zinc-300">
              Willkommen im exklusiven Bereich.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/forum"
              className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 px-5 py-3 font-semibold text-yellow-300 transition hover:scale-105"
            >
              Zum Forum
            </Link>

            <LogoutButton />
          </div>
        </div>

        <div className="rounded-3xl border border-fuchsia-500/20 bg-zinc-900/60 p-8 shadow-[0_0_30px_rgba(217,70,239,0.1)]">
          <h2 className="mb-4 text-2xl font-bold text-white">
            VIP Members Only
          </h2>

          <p className="mb-6 text-zinc-300">
            Hier können exklusive Tracks, geheime Collabs, private Diskussionen
            und Premium-Releases veröffentlicht werden.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-zinc-800 bg-black/30 p-5">
              <h3 className="text-lg font-semibold text-fuchsia-300">
                Exclusive Tracks
              </h3>
              <p className="mt-2 text-sm text-zinc-400">
                Unveröffentlichte Songs, Sneak Peeks und private Edits.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-black/30 p-5">
              <h3 className="text-lg font-semibold text-yellow-300">
                Private Collabs
              </h3>
              <p className="mt-2 text-sm text-zinc-400">
                Nur für ausgewählte Member und VIP Artists.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}