import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const deleteSchema = z.object({
  userId: z.string(),
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
    const parsed = deleteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Ungültige Anfrage." },
        { status: 400 }
      );
    }

    const { userId } = parsed.data;

    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({
      message: "User gelöscht.",
    });
  } catch (error) {
    console.error("DELETE_USER_ERROR", error);

    return NextResponse.json(
      { error: "Serverfehler." },
      { status: 500 }
    );
  }
}