import { getDbUser } from "@/lib/current-user";
import LoginForm from "@/components/login-form";
import { safeCallbackUrl } from "@/lib/callback-url";
import { redirect } from "next/navigation";

type LoginPageProps = {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { user } = await getDbUser();
  const params = await searchParams;
  const callbackUrl = safeCallbackUrl(params.callbackUrl);
  const wantsAdmin = callbackUrl.startsWith("/admin");

  if (user?.role === "ADMIN") {
    redirect(wantsAdmin ? "/admin" : callbackUrl);
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black px-6 py-16 text-white">
      <LoginForm
        callbackUrl={wantsAdmin ? "/admin" : callbackUrl}
        initialError={params.error || ""}
        loggedInAs={user?.username || user?.email || ""}
        adminLogin={wantsAdmin}
      />
    </main>
  );
}
