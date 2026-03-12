import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const toggleVipSchema = z.object({
  userId: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Nicht eingeloggt." },
        { status: 401 }
      );
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Kein Zugriff." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const parsed = toggleVipSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Ungültige Anfrage." },
        { status: 400 }
      );
    }

    const { userId } = parsed.data;

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: "User nicht gefunden." },
        { status: 404 }
      );
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        isVip: !targetUser.isVip,
      },
    });

    return NextResponse.json({
      message: targetUser.isVip
        ? "VIP Status entfernt."
        : "User wurde als VIP freigeschaltet.",
    });
  } catch (error) {
    console.error("TOGGLE_VIP_USER_ERROR", error);

    return NextResponse.json(
      { error: "Serverfehler." },
      { status: 500 }
    );
  }
}