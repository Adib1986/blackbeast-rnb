import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authConfig } from "./auth.config";

class InvalidCredentialsError extends CredentialsSignin {
  code = "invalid_credentials";
}

class UnapprovedError extends CredentialsSignin {
  code = "unapproved";
}

class BlockedError extends CredentialsSignin {
  code = "blocked";
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = (user as { role?: string }).role;
        token.approved = (user as { approved?: boolean }).approved;
      } else if (token.sub) {
        const dbUser = await prisma.user.findUnique({
          where: { id: String(token.sub) },
        });

        if (dbUser) {
          token.role = dbUser.role;
          token.approved = dbUser.approved;
        }
      }

      return token;
    },
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const identifier = String(credentials?.email || "").trim();
        const password = String(credentials?.password || "");

        if (!identifier || !password) {
          throw new InvalidCredentialsError();
        }

        const user = await prisma.user.findFirst({
          where: {
            OR: [
              {
                email: {
                  equals: identifier.toLowerCase(),
                  mode: "insensitive",
                },
              },
              {
                username: {
                  equals: identifier,
                  mode: "insensitive",
                },
              },
            ],
          },
        });

        if (!user) {
          throw new InvalidCredentialsError();
        }

        if (identifier.includes("@") && user.email !== identifier.toLowerCase()) {
          await prisma.user
            .update({
              where: { id: user.id },
              data: { email: identifier.toLowerCase() },
            })
            .catch(() => undefined);
        }

        const passwordValid = await bcrypt.compare(password, user.passwordHash);

        if (!passwordValid) {
          throw new InvalidCredentialsError();
        }

        if (!user.approved) {
          throw new UnapprovedError();
        }

        if (user.isBlocked) {
          throw new BlockedError();
        }

        return {
          id: user.id,
          name: user.username,
          email: user.email,
          role: user.role,
          approved: user.approved,
        };
      },
    }),
  ],
});
