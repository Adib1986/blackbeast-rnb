import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB
const ALLOWED_EXTENSIONS = [".mp3", ".wav", ".m4a", ".aac", ".ogg", ".flac"];
const ALLOWED_MIME_TYPES = [
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/x-wav",
  "audio/wave",
  "audio/m4a",
  "audio/aac",
  "audio/ogg",
  "audio/flac",
  "audio/x-flac",
];

function getFileExtension(fileName: string) {
  const ext = path.extname(fileName || "").toLowerCase();
  return ext;
}

function sanitizeFileName(fileName: string) {
  const ext = getFileExtension(fileName);
  const baseName = path.basename(fileName, ext);

  const safeBaseName = baseName
    .normalize("NFKD")
    .replace(/[^\w\s.-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);

  return `${Date.now()}-${safeBaseName || "track"}${ext}`;
}

function getTrackTitle(fileName: string) {
  return path.basename(fileName, path.extname(fileName)).trim() || "Untitled Track";
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Nicht eingeloggt" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: {
        email: String(session.user.email).toLowerCase(),
      },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "Benutzer nicht gefunden" }, { status: 404 });
    }

    if (!dbUser.approved) {
      return NextResponse.json(
        { error: "Dein Account ist noch nicht freigeschaltet" },
        { status: 403 }
      );
    }

    if (dbUser.isBlocked) {
      return NextResponse.json(
        { error: "Dein Account wurde blockiert" },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Keine gültige Datei ausgewählt" },
        { status: 400 }
      );
    }

    if (!file.name) {
      return NextResponse.json(
        { error: "Dateiname fehlt" },
        { status: 400 }
      );
    }

    const extension = getFileExtension(file.name);

    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return NextResponse.json(
        {
          error: "Nur diese Audio-Dateien sind erlaubt: MP3, WAV, M4A, AAC, OGG, FLAC",
        },
        { status: 400 }
      );
    }

    if (file.type && !ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: "Ungültiger Audio-Dateityp",
        },
        { status: 400 }
      );
    }

    if (file.size <= 0) {
      return NextResponse.json(
        { error: "Die Datei ist leer" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Die Datei ist zu groß. Maximal 20 MB erlaubt" },
        { status: 400 }
      );
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const safeFileName = sanitizeFileName(file.name);
    const filePath = path.join(uploadsDir, safeFileName);
    const fileUrl = `/uploads/${safeFileName}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await writeFile(filePath, buffer);

    const track = await prisma.track.create({
      data: {
        title: getTrackTitle(file.name),
        fileUrl,
        originalName: file.name,
        authorId: dbUser.id,
      },
    });

    return NextResponse.json({
      success: true,
      trackId: track.id,
      fileUrl: track.fileUrl,
      title: track.title,
      originalName: track.originalName,
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Upload fehlgeschlagen",
      },
      { status: 500 }
    );
  }
}