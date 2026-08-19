import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireMemberApi } from "@/lib/current-user";

type UpdateUserBody = {
  userId?: string;
  action?: "approve" | "block" | "unblock";
};

export async function POST(request: Request) {
  try {
    const member = await requireMemberApi();

    if (member.error) {
      return member.error;
    }

    if (member.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Kein Zugriff." }, { status: 403 });
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

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "Benutzer nicht gefunden." },
        { status: 404 }
      );
    }

    if (existingUser.id === member.user.id && action === "block") {
      return NextResponse.json(
        { error: "Du kannst dich nicht selbst sperren." },
        { status: 400 }
      );
    }

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

    return NextResponse.json({ error: "Ungültige Aktion." }, { status: 400 });
  } catch (error) {
    console.error("ADMIN USERS API ERROR:", error);

    return NextResponse.json(
      { error: "Interner Serverfehler." },
      { status: 500 }
    );
  }
}
