import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Not logged in" });
  }

  const body = await req.json();

  const { title, fileUrl } = body;

  const song = await prisma.song.create({
    data: {
      title,
      fileUrl,
      uploaderId: session.user.id
    }
  });

  return NextResponse.json(song);

}