import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type CreateThreadBody = {
  title?: string;
  content?: string;
  categoryId?: string;
};

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Nicht eingeloggt." },
        { status: 401 }
      );
    }

    const body = (await request.json()) as CreateThreadBody;

    const title = String(body.title ?? "").trim();
    const content = String(body.content ?? "").trim();
    const categoryId = String(body.categoryId ?? "").trim();

    if (!title || !content || !categoryId) {
      return NextResponse.json(
        { error: "Titel, Inhalt und Kategorie sind erforderlich." },
        { status: 400 }
      );
    }

    const sessionEmail = String(session.user.email ?? "").trim();

    if (!sessionEmail) {
      return NextResponse.json(
        { error: "Kein Benutzer in der Session gefunden." },
        { status: 401 }
      );
    }

    const dbUser = await prisma.user.findFirst({
      where: {
        email: sessionEmail,
      },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: "Benutzer wurde in der Datenbank nicht gefunden." },
        { status: 404 }
      );
    }

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
        authorId: dbUser.id,
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