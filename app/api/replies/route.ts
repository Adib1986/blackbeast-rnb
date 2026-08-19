import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireMemberApi } from "@/lib/current-user";

type CreateReplyBody = {
  content?: string;
  threadId?: string;
};

export async function POST(request: Request) {
  try {
    const member = await requireMemberApi();

    if (member.error) {
      return member.error;
    }

    const body = (await request.json()) as CreateReplyBody;
    const content = String(body.content ?? "").trim();
    const threadId = String(body.threadId ?? "").trim();

    if (content.length < 2 || !threadId) {
      return NextResponse.json(
        { error: "Inhalt und Thread sind erforderlich." },
        { status: 400 }
      );
    }

    const thread = await prisma.thread.findUnique({
      where: { id: threadId },
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
        authorId: member.user.id,
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
