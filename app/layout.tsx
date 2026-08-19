import "./globals.css";
import { prisma } from "@/lib/prisma";
import Providers from "@/components/providers";
import SiteHeader from "@/components/site-header";
import { getDbUser } from "@/lib/current-user";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata = {
  title: SITE_NAME,
  description: SITE_TAGLINE,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, user } = await getDbUser();
  const isLoggedIn = Boolean(session?.user);
  const isAdmin = user?.role === "ADMIN" || session?.user?.role === "ADMIN";

  let pendingCount = 0;

  if (isAdmin) {
    pendingCount = await prisma.user.count({
      where: {
        approved: false,
      },
    });
  }

  return (
    <html lang="de">
      <body>
        <Providers session={session}>
          <SiteHeader
            initialLoggedIn={isLoggedIn}
            initialIsAdmin={isAdmin}
            initialUserName={user?.username || session?.user?.name}
            pendingCount={pendingCount}
          />
          {children}
        </Providers>
      </body>
    </html>
  );
}
