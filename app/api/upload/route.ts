import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Nicht eingeloggt" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Keine Datei gefunden" },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("audio/")) {
      return NextResponse.json(
        { error: "Nur Audio-Dateien erlaubt" },
        { status: 400 }
      );
    }

    const blob = await put(file.name, file, {
      access: "public",
    });

    return NextResponse.json({
      success: true,
      url: blob.url,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Upload fehlgeschlagen" },
      { status: 500 }
    );
  }
}