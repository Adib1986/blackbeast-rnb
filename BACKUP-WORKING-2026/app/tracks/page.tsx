import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import DeleteTrackForm from "@/components/delete-track-form";

type TrackAuthor = {
  id?: string | null;
  username?: string | null;
  name?: string | null;
  email?: string | null;
};

type SessionUser = {
  id?: string | null;
  email?: string | null;
  role?: string | null;
};

export default async function TracksPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const currentUser = session.user as SessionUser;

  const tracks = await prisma.track.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: true,
    },
  });

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

        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-8">
          <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_0_40px_rgba(168,85,247,0.08)] backdrop-blur-md">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.35em] text-fuchsia-300/80">
                  BlackBeast RNB
                </p>

                <h1 className="bg-gradient-to-r from-white via-fuchsia-200 to-violet-300 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-4xl">
                  Tracks
                </h1>

                <p className="mt-3 text-sm text-zinc-300">
                  Hochgeladene Songs mit Player und Download.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/upload"
                  className="inline-flex items-center justify-center rounded-2xl border border-fuchsia-400/20 bg-gradient-to-r from-fuchsia-600/20 to-violet-600/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-fuchsia-300/40 hover:shadow-[0_0_25px_rgba(168,85,247,0.18)]"
                >
                  Upload
                </Link>

                <Link
                  href="/forum"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:border-fuchsia-400/30 hover:bg-white/10"
                >
                  Back to Forum
                </Link>
              </div>
            </div>
          </div>

          {tracks.length === 0 ? (
            <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-white/8 to-white/[0.03] p-6 shadow-[0_0_30px_rgba(168,85,247,0.08)] backdrop-blur-md">
              Noch keine Tracks vorhanden.
            </div>
          ) : (
            <div className="space-y-5">
              {tracks.map((track) => {
                const author = track.author as TrackAuthor | null;
                const authorName =
                  author?.username ||
                  author?.name ||
                  author?.email ||
                  "Unknown user";

                const canDelete =
                  currentUser.role === "ADMIN" || currentUser.id === author?.id;

                return (
                  <div
                    key={track.id}
                    className="rounded-[28px] border border-white/10 bg-gradient-to-br from-white/8 to-white/[0.03] p-6 shadow-[0_0_30px_rgba(168,85,247,0.08)] backdrop-blur-md"
                  >
                    <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-white">
                          {track.title}
                        </h2>

                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                          <span className="rounded-full border border-zinc-700 bg-zinc-900/70 px-3 py-1">
                            by {authorName}
                          </span>

                          <span className="rounded-full border border-zinc-700 bg-zinc-900/70 px-3 py-1">
                            {new Date(track.createdAt).toLocaleDateString("de-DE")}
                          </span>

                          <span className="rounded-full border border-zinc-700 bg-zinc-900/70 px-3 py-1">
                            {track.originalName}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row">
                        <a
                          href={track.fileUrl}
                          download
                          className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:border-fuchsia-400/30 hover:bg-white/10"
                        >
                          Download
                        </a>

                        {canDelete ? (
                          <DeleteTrackForm trackId={track.id} />
                        ) : null}
                      </div>
                    </div>

                    <audio controls preload="none" className="w-full">
                      <source src={track.fileUrl} />
                      Dein Browser unterstützt kein Audio-Element.
                    </audio>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}