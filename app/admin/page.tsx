import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/current-user";
import AdminUserActions from "@/components/admin-user-actions";
import { SITE_NAME } from "@/lib/site";

export default async function AdminPage() {
  const { user } = await requireAdmin();

  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const pendingUsers = users.filter((item) => !item.approved);
  const memberUsers = users.filter((item) => item.approved);

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="relative min-h-screen">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-fuchsia-700/20 blur-3xl" />
          <div className="absolute right-[-100px] top-[120px] h-[260px] w-[260px] rounded-full bg-violet-600/20 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-8">
          <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.35em] text-fuchsia-300/80">
                  {SITE_NAME}
                </p>
                <h1 className="bg-gradient-to-r from-white via-fuchsia-200 to-violet-300 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-4xl">
                  Admin
                </h1>
                <p className="mt-3 text-sm text-zinc-300">
                  Neue Accounts erst freischalten, danach können sie sich
                  einloggen.
                </p>
              </div>
              <Link
                href="/forum"
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Zum Forum
              </Link>
            </div>
          </div>

          <section className="mb-8 rounded-[28px] border border-amber-400/20 bg-gradient-to-br from-amber-950/40 to-white/[0.03] p-6">
            <h2 className="mb-5 text-2xl font-bold text-white">
              Freischaltung ({pendingUsers.length})
            </h2>

            {pendingUsers.length === 0 ? (
              <p className="text-zinc-300">Keine offenen Anmeldungen.</p>
            ) : (
              <div className="space-y-4">
                {pendingUsers.map((listedUser) => (
                  <AdminUserCard
                    key={listedUser.id}
                    listedUser={listedUser}
                    currentUserId={user.id}
                  />
                ))}
              </div>
            )}
          </section>

          <section className="rounded-[28px] border border-white/10 bg-gradient-to-br from-white/8 to-white/[0.03] p-6">
            <h2 className="mb-5 text-2xl font-bold text-white">
              Mitglieder ({memberUsers.length})
            </h2>

            {memberUsers.length === 0 ? (
              <p className="text-zinc-300">Noch keine freigeschalteten Nutzer.</p>
            ) : (
              <div className="space-y-4">
                {memberUsers.map((listedUser) => (
                  <AdminUserCard
                    key={listedUser.id}
                    listedUser={listedUser}
                    currentUserId={user.id}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function AdminUserCard({
  listedUser,
  currentUserId,
}: {
  listedUser: {
    id: string;
    username: string;
    email: string;
    role: string;
    approved: boolean;
    isBlocked: boolean;
    createdAt: Date;
  };
  currentUserId: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-lg font-semibold text-white">
            {listedUser.username}
          </p>
          <p className="mt-1 text-sm text-zinc-400">{listedUser.email}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-zinc-300">
            <span className="rounded-full border border-zinc-700 bg-zinc-900/70 px-3 py-1">
              {listedUser.role}
            </span>
            <span className="rounded-full border border-zinc-700 bg-zinc-900/70 px-3 py-1">
              {listedUser.approved ? "Freigeschaltet" : "Wartet"}
            </span>
            <span className="rounded-full border border-zinc-700 bg-zinc-900/70 px-3 py-1">
              {listedUser.isBlocked ? "Gesperrt" : "Aktiv"}
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
          isSelf={listedUser.id === currentUserId}
        />
      </div>
    </div>
  );
}
