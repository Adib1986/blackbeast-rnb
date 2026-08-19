import RegisterForm from "@/components/register-form";
import { SITE_NAME } from "@/lib/site";

export default function JoinPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="relative min-h-screen">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-fuchsia-700/25 blur-3xl" />
          <div className="absolute right-[-80px] top-[120px] h-[260px] w-[260px] rounded-full bg-violet-600/25 blur-3xl" />
          <div className="absolute bottom-[-120px] left-[20%] h-[280px] w-[280px] rounded-full bg-amber-500/15 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto grid max-w-6xl gap-10 px-6 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <section>
            <p className="mb-3 inline-flex rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
              Invite Link • Members only
            </p>
            <h1 className="bg-gradient-to-r from-white via-fuchsia-200 to-amber-300 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl">
              {SITE_NAME}
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-300 sm:text-base">
              Du bist über den Community-Link hier. Registriere dich, warte auf
              die Freischaltung durch einen Admin und tritt danach dem Board
              bei.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-zinc-400">
              <li>1. Account erstellen</li>
              <li>2. Admin schaltet dich frei</li>
              <li>3. Einloggen und ins Forum</li>
            </ul>
          </section>

          <RegisterForm />
        </div>
      </div>
    </main>
  );
}
