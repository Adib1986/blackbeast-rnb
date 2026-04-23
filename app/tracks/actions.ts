"use server";

import { unlink } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function deleteTrackAction(formData: FormData) {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Nicht eingeloggt.");
  }

  const trackId = String(formData.get("trackId") ?? "").trim();

  if (!trackId) {
    throw new Error("trackId fehlt.");
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
    throw new Error("Eingeloggter User wurde in der Datenbank nicht gefunden.");
  }

  const track = await prisma.track.findUnique({
    where: {
      id: trackId,
    },
  });

  if (!track) {
    throw new Error("Track nicht gefunden.");
  }

  const isOwner = track.authorId === dbUser.id;
  const isAdmin = dbUser.role === "ADMIN";

  if (!isOwner && !isAdmin) {
    throw new Error("Du darfst diesen Track nicht löschen.");
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

  revalidatePath("/tracks");
}