import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const toggleBlockSchema = z.object({
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
    const parsed = toggleBlockSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Ungültige Anfrage." },
        { status: 400 }
      );
    }

    const { userId } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User nicht gefunden." },
        { status: 404 }
      );
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        isBlocked: !user.isBlocked,
      },
    });

    return NextResponse.json({
      message: user.isBlocked
        ? "User wurde entsperrt."
        : "User wurde gesperrt.",
    });
  } catch (error) {
    console.error("TOGGLE_BLOCK_USER_ERROR", error);

    return NextResponse.json(
      { error: "Serverfehler." },
      { status: 500 }
    );
  }
}