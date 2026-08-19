import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { User } from "@prisma/client";

export async function getDbUser() {
  const session = await auth();

  if (!session?.user) {
    return { session: null, user: null };
  }

  const id = String(session.user.id || "").trim();
  const email = String(session.user.email || "").trim();

  let user =
    id.length > 0
      ? await prisma.user.findUnique({
          where: { id },
        })
      : null;

  if (!user && email) {
    user = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
    });
  }

  return { session, user };
}

export async function requireMember(): Promise<{ user: User }> {
  const { session, user } = await getDbUser();

  if (!session?.user || !user) {
    redirect("/login");
  }

  if (!user.approved) {
    redirect("/register/pending");
  }

  if (user.isBlocked) {
    redirect("/login?error=blocked");
  }

  return { user };
}

export async function requireAdmin(): Promise<{ user: User }> {
  const { session, user } = await getDbUser();

  if (!session?.user || !user) {
    redirect("/login?callbackUrl=/admin");
  }

  if (!user.approved) {
    redirect("/login?callbackUrl=/admin&error=unapproved");
  }

  if (user.isBlocked) {
    redirect("/login?callbackUrl=/admin&error=blocked");
  }

  if (user.role !== "ADMIN") {
    redirect("/login?callbackUrl=/admin&error=admin");
  }

  return { user };
}

export async function getRequiredMember(): Promise<User> {
  const { session, user } = await getDbUser();

  if (!session?.user || !user) {
    throw new Error("Nicht angemeldet.");
  }

  if (!user.approved) {
    throw new Error("Account noch nicht freigeschaltet.");
  }

  if (user.isBlocked) {
    throw new Error("Account ist gesperrt.");
  }

  return user;
}

export async function requireMemberApi(): Promise<
  { user: User; error?: undefined } | { user?: undefined; error: NextResponse }
> {
  const { session, user } = await getDbUser();

  if (!session?.user || !user) {
    return {
      error: NextResponse.json(
        { error: "Nicht eingeloggt." },
        { status: 401 }
      ),
    };
  }

  if (!user.approved) {
    return {
      error: NextResponse.json(
        { error: "Account noch nicht freigeschaltet." },
        { status: 403 }
      ),
    };
  }

  if (user.isBlocked) {
    return {
      error: NextResponse.json(
        { error: "Account ist gesperrt." },
        { status: 403 }
      ),
    };
  }

  return { user };
}
