import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import AdminUserActions from "@/components/admin-user-actions";

type SessionUser = {
  name?: string | null;
  email?: string | null;
  role?: string | null;
};

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user as SessionUser;

  if (user.role !== "ADMIN") {
    redirect("/forum");
  }

  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
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
                  Admin Panel
                </h1>

                <p className="mt-3 text-sm text-zinc-300">
                  Benutzer verwalten, freischalten und blockieren.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/forum"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:border-fuchsia-400/30 hover:bg-white/10"
                >
                  Back to Forum
                </Link>
              </div>
            </div>
          </div>

          <section className="rounded-[28px] border border-white/10 bg-gradient-to-br from-white/8 to-white/[0.03] p-6 shadow-[0_0_30px_rgba(168,85,247,0.08)] backdrop-blur-md">
            <h2 className="mb-5 text-2xl font-bold text-white">
              Benutzer
            </h2>

            {users.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-black/20 p-5 text-zinc-300">
                Keine Benutzer gefunden.
              </div>
            ) : (
              <div className="space-y-4">
                {users.map((listedUser) => (
                  <div
                    key={listedUser.id}
                    className="rounded-2xl border border-white/10 bg-black/20 p-5"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <p className="text-lg font-semibold text-white">
                          {listedUser.username}
                        </p>

                        <p className="mt-1 text-sm text-zinc-400">
                          {listedUser.email}
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-zinc-300">
                          <span className="rounded-full border border-zinc-700 bg-zinc-900/70 px-3 py-1">
                            Role: {listedUser.role}
                          </span>

                          <span className="rounded-full border border-zinc-700 bg-zinc-900/70 px-3 py-1">
                            Approved: {listedUser.approved ? "Yes" : "No"}
                          </span>

                          <span className="rounded-full border border-zinc-700 bg-zinc-900/70 px-3 py-1">
                            Blocked: {listedUser.isBlocked ? "Yes" : "No"}
                          </span>

                          <span className="rounded-full border border-zinc-700 bg-zinc-900/70 px-3 py-1">
                            {new Date(listedUser.createdAt).toLocaleDateString("de-DE")}
                          </span>
                        </div>
                      </div>

                      <AdminUserActions
                        userId={listedUser.id}
                        approved={listedUser.approved}
                        isBlocked={listedUser.isBlocked}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}