import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireMemberApi } from "@/lib/current-user";

type CreateThreadBody = {
  title?: string;
  content?: string;
  categoryId?: string;
};

export async function POST(request: Request) {
  try {
    const member = await requireMemberApi();

    if (member.error) {
      return member.error;
    }

    const body = (await request.json()) as CreateThreadBody;
    const title = String(body.title ?? "").trim();
    const content = String(body.content ?? "").trim();
    const categoryId = String(body.categoryId ?? "").trim();

    if (title.length < 3 || content.length < 5 || !categoryId) {
      return NextResponse.json(
        { error: "Titel (mind. 3 Zeichen), Inhalt (mind. 5) und Kategorie sind nötig." },
        { status: 400 }
      );
    }

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
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
        authorId: member.user.id,
        categoryId: category.id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        threadId: thread.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE THREAD ERROR:", error);

    return NextResponse.json(
      { error: "Interner Serverfehler beim Erstellen des Threads." },
      { status: 500 }
    );
  }
}
