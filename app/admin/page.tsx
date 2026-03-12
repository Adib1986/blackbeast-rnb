import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import LogoutButton from "@/components/logout-button";
import ApproveUserButton from "@/components/approve-user-button";
import DeleteUserButton from "@/components/delete-user-button";
import ToggleBlockUserButton from "@/components/toggle-block-user-button";
import ToggleRoleUserButton from "@/components/toggle-role-user-button";
import ToggleVipUserButton from "@/components/toggle-vip-user-button";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/forum");
  }

  const pendingUsers = await prisma.user.findMany({
    where: {
      approved: false,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const allUsers = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black px-6 py-12 text-white">
      <section className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-3 inline-block rounded-full border border-yellow-500/30 bg-yellow-500/10 px-4 py-1 text-sm uppercase tracking-[0.25em] text-yellow-300">
              Admin Area
            </p>

            <h1 className="text-4xl font-extrabold tracking-tight text-yellow-400 md:text-6xl">
              BlackBeast Admin
            </h1>

            <p className="mt-3 text-zinc-300">
              Willkommen zurück,{" "}
              <span className="font-semibold text-yellow-300">
                {session.user.name}
              </span>
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              Rolle: {session.user.role}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/forum"
              className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 px-5 py-3 font-semibold text-yellow-300 transition hover:scale-105"
            >
              Zum Forum
            </Link>

            <Link
              href="/vip"
              className="rounded-2xl border border-fuchsia-500/30 bg-fuchsia-500/10 px-5 py-3 font-semibold text-fuchsia-300 transition hover:scale-105"
            >
              VIP Area
            </Link>

            <LogoutButton />
          </div>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-5 shadow-2xl">
            <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
              Gesamt
            </p>
            <p className="mt-3 text-3xl font-extrabold text-white">
              {allUsers.length}
            </p>
            <p className="mt-2 text-sm text-zinc-400">Alle registrierten User</p>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-5 shadow-2xl">
            <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
              Wartend
            </p>
            <p className="mt-3 text-3xl font-extrabold text-orange-300">
              {pendingUsers.length}
            </p>
            <p className="mt-2 text-sm text-zinc-400">
              Noch nicht freigeschaltet
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-5 shadow-2xl">
            <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
              Admins
            </p>
            <p className="mt-3 text-3xl font-extrabold text-yellow-300">
              {allUsers.filter((user) => user.role === "ADMIN").length}
            </p>
            <p className="mt-2 text-sm text-zinc-400">User mit Admin-Rechten</p>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-5 shadow-2xl">
            <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
              VIP
            </p>
            <p className="mt-3 text-3xl font-extrabold text-fuchsia-300">
              {allUsers.filter((user) => user.isVip).length}
            </p>
            <p className="mt-2 text-sm text-zinc-400">VIP freigeschaltete User</p>
          </div>
        </div>

        <div className="mb-8 rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white">Wartende User</h2>
            <p className="mt-2 text-sm text-zinc-400">
              Hier siehst du alle neu registrierten User, die noch nicht freigeschaltet wurden.
            </p>
          </div>

          {pendingUsers.length === 0 ? (
            <div className="rounded-2xl border border-zinc-800 bg-black/30 px-4 py-6 text-center text-zinc-400">
              Aktuell warten keine User auf Freischaltung.
            </div>
          ) : (
            <div className="space-y-4">
              {pendingUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-black/30 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="text-lg font-semibold text-yellow-300">
                      {user.username}
                    </p>
                    <p className="text-sm text-zinc-300">{user.email}</p>
                    <p className="mt-1 text-xs text-zinc-500">
                      Registriert am: {new Date(user.createdAt).toLocaleString("de-DE")}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-300">
                      Wartet auf Freischaltung
                    </span>

                    <ApproveUserButton userId={user.id} />
                    <DeleteUserButton userId={user.id} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white">Alle User</h2>
            <p className="mt-2 text-sm text-zinc-400">
              Übersicht aller registrierten Mitglieder im BlackBeast RNB Board.
            </p>
          </div>

          {allUsers.length === 0 ? (
            <div className="rounded-2xl border border-zinc-800 bg-black/30 px-4 py-6 text-center text-zinc-400">
              Es sind noch keine User vorhanden.
            </div>
          ) : (
            <div className="space-y-4">
              {allUsers.map((user) => {
                const isSelf = user.id === session.user.id;

                return (
                  <div
                    key={user.id}
                    className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-black/30 p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <p className="text-lg font-semibold text-yellow-300">
                        {user.username}
                      </p>
                      <p className="text-sm text-zinc-300">{user.email}</p>
                      <p className="mt-1 text-xs text-zinc-500">
                        Registriert am: {new Date(user.createdAt).toLocaleString("de-DE")}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`rounded-full px-4 py-2 text-sm font-semibold ${
                          user.isBlocked
                            ? "border border-red-500/30 bg-red-500/10 text-red-300"
                            : user.approved
                            ? "border border-green-500/30 bg-green-500/10 text-green-300"
                            : "border border-orange-500/30 bg-orange-500/10 text-orange-300"
                        }`}
                      >
                        {user.isBlocked
                          ? "Gesperrt"
                          : user.approved
                          ? "Freigeschaltet"
                          : "Wartend"}
                      </span>

                      <span
                        className={`rounded-full px-4 py-2 text-sm font-semibold ${
                          user.role === "ADMIN"
                            ? "border border-yellow-500/30 bg-yellow-500/10 text-yellow-300"
                            : "border border-zinc-700 bg-zinc-800 text-zinc-300"
                        }`}
                      >
                        {user.role}
                      </span>

                      {user.isVip && (
                        <span className="rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 px-4 py-2 text-sm font-semibold text-fuchsia-300">
                          VIP
                        </span>
                      )}

                      {!isSelf && (
                        <ToggleRoleUserButton
                          userId={user.id}
                          role={user.role}
                        />
                      )}

                      {!isSelf && (
                        <ToggleVipUserButton
                          userId={user.id}
                          isVip={user.isVip}
                        />
                      )}

                      {!isSelf && (
                        <ToggleBlockUserButton
                          userId={user.id}
                          isBlocked={user.isBlocked}
                        />
                      )}

                      {!isSelf && user.role !== "ADMIN" && (
                        <DeleteUserButton userId={user.id} />
                      )}

                      {isSelf && (
                        <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-300">
                          Dein Account
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}