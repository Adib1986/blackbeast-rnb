import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type CreateReplyBody = {
  content?: string;
  threadId?: string;
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

    const body = (await request.json()) as CreateReplyBody;

    const content = String(body.content ?? "").trim();
    const threadId = String(body.threadId ?? "").trim();

    if (!content || !threadId) {
      return NextResponse.json(
        { error: "Inhalt und Thread sind erforderlich." },
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

    const thread = await prisma.thread.findUnique({
      where: {
        id: threadId,
      },
    });

    if (!thread) {
      return NextResponse.json(
        { error: "Thread nicht gefunden." },
        { status: 404 }
      );
    }

    const reply = await prisma.reply.create({
      data: {
        content,
        authorId: dbUser.id,
        threadId: thread.id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        replyId: reply.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE REPLY ERROR:", error);

    return NextResponse.json(
      { error: "Interner Serverfehler beim Erstellen der Antwort." },
      { status: 500 }
    );
  }
}