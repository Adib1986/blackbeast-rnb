import { NextResponse } from "next/server";
import { unlink } from "fs/promises";
import path from "path";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type DeleteTrackBody = {
  trackId?: string;
};

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Nicht eingeloggt." },
        { status: 401 }
      );
    }

    const body = (await req.json()) as DeleteTrackBody;
    const trackId = String(body.trackId ?? "").trim();

    if (!trackId) {
      return NextResponse.json(
        { error: "trackId fehlt." },
        { status: 400 }
      );
    }

    const sessionUser = session.user as {
      id?: string;
      email?: string | null;
      role?: string | null;
    };

    let dbUser = null;

    if (sessionUser.id) {
      dbUser = await prisma.user.findUnique({
        where: {
          id: sessionUser.id,
        },
      });
    }

    if (!dbUser && sessionUser.email) {
      dbUser = await prisma.user.findFirst({
        where: {
          email: String(sessionUser.email).trim().toLowerCase(),
        },
      });
    }

    if (!dbUser) {
      return NextResponse.json(
        { error: "Eingeloggter User wurde in der Datenbank nicht gefunden." },
        { status: 404 }
      );
    }

    const track = await prisma.track.findUnique({
      where: {
        id: trackId,
      },
    });

    if (!track) {
      return NextResponse.json(
        { error: "Track nicht gefunden." },
        { status: 404 }
      );
    }

    const isOwner = track.authorId === dbUser.id;
    const isAdmin = dbUser.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: "Du darfst diesen Track nicht löschen." },
        { status: 403 }
      );
    }

    await prisma.track.delete({
      where: {
        id: track.id,
      },
    });

    const fileName = track.fileUrl.replace("/uploads/", "");
    const filePath = path.join(process.cwd(), "public", "uploads", fileName);

    try {
      await unlink(filePath);
    } catch (error) {
      console.warn("TRACK FILE DELETE WARNING:", error);
    }

    return NextResponse.json({
      success: true,
      deletedTrackId: track.id,
    });
  } catch (error) {
    console.error("DELETE TRACK ERROR:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Track konnte nicht gelöscht werden.",
      },
      { status: 500 }
    );
  }
}