import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const toggleRoleSchema = z.object({
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
    const parsed = toggleRoleSchema.safeParse(body);

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

    if (targetUser.id === session.user.id) {
      return NextResponse.json(
        { error: "Du kannst deine eigene Rolle nicht ändern." },
        { status: 400 }
      );
    }

    const newRole = targetUser.role === "ADMIN" ? "USER" : "ADMIN";

    await prisma.user.update({
      where: { id: userId },
      data: {
        role: newRole,
      },
    });

    return NextResponse.json({
      message:
        newRole === "ADMIN"
          ? "User wurde zum Admin gemacht."
          : "Admin wurde wieder auf User gesetzt.",
    });
  } catch (error) {
    console.error("TOGGLE_ROLE_USER_ERROR", error);

    return NextResponse.json(
      { error: "Serverfehler." },
      { status: 500 }
    );
  }
}