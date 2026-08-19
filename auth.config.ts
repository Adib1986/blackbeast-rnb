import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isLoggedIn = Boolean(auth?.user);
      if (pathname === "/login") {
        return true;
      }

      const isAuthPage = pathname === "/register" || pathname === "/join";
      const isForum = pathname.startsWith("/forum");
      const isAdmin = pathname.startsWith("/admin");

      if (isAuthPage) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/forum", request.nextUrl));
        }

        return true;
      }

      if (isForum && !isLoggedIn) {
        return Response.redirect(new URL("/join", request.nextUrl));
      }

      if (isAdmin && !isLoggedIn) {
        return Response.redirect(
          new URL("/login?callbackUrl=/admin", request.nextUrl)
        );
      }

      if (isAdmin) {
        return true;
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = (user as { role?: string }).role;
        token.approved = (user as { approved?: boolean }).approved;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.sub || "");
        session.user.role = String(token.role || "USER");
        session.user.approved = Boolean(token.approved);
      }

      return session;
    },
  },
} satisfies NextAuthConfig;
