import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type UpdateUserBody = {
  userId?: string;
  action?: "approve" | "block" | "unblock";
};

export async function POST(request: Request) {
  try {
    const session = await auth();

    // 🔒 Nicht eingeloggt
    if (!session?.user) {
      return NextResponse.json(
        { error: "Nicht eingeloggt." },
        { status: 401 }
      );
    }

    // 🔒 Nur ADMIN darf
    const sessionUser = session.user as { role?: string };

    if (sessionUser.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Kein Zugriff." },
        { status: 403 }
      );
    }

    const body = (await request.json()) as UpdateUserBody;

    const userId = String(body.userId ?? "").trim();
    const action = String(body.action ?? "").trim();

    if (!userId || !action) {
      return NextResponse.json(
        { error: "userId und action sind erforderlich." },
        { status: 400 }
      );
    }

    // 🔍 User prüfen
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "Benutzer nicht gefunden." },
        { status: 404 }
      );
    }

    // 🚀 Aktionen

    if (action === "approve") {
      await prisma.user.update({
        where: { id: userId },
        data: { approved: true },
      });

      return NextResponse.json({ success: true });
    }

    if (action === "block") {
      await prisma.user.update({
        where: { id: userId },
        data: { isBlocked: true },
      });

      return NextResponse.json({ success: true });
    }

    if (action === "unblock") {
      await prisma.user.update({
        where: { id: userId },
        data: { isBlocked: false },
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "Ungültige Aktion." },
      { status: 400 }
    );
  } catch (error) {
    console.error("ADMIN USERS API ERROR:", error);

    return NextResponse.json(
      { error: "Interner Serverfehler." },
      { status: 500 }
    );
  }
}