import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const createThreadSchema = z.object({
  title: z.string().min(3).max(120),
  content: z.string().min(5).max(5000),
  categoryId: z.string().min(1),
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

    const body = await request.json();
    const parsed = createThreadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Ungültige Eingaben." },
        { status: 400 }
      );
    }

    const { title, content, categoryId } = parsed.data;

    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Kategorie nicht gefunden." },
        { status: 404 }
      );
    }

    const thread = await prisma.thread.create({
      data: {
        title,
        content,
        categoryId,
        authorId: session.user.id,
      },
    });

    return NextResponse.json(thread, { status: 201 });
  } catch (error) {
    console.error("CREATE_THREAD_ERROR", error);

    return NextResponse.json(
      { error: "Serverfehler beim Erstellen des Threads." },
      { status: 500 }
    );
  }
}