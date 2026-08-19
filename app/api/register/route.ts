import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const registerSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Bitte gültigen Username, E-Mail und Passwort (mind. 6 Zeichen) angeben." },
        { status: 400 }
      );
    }

    const username = parsed.data.username.trim();
    const email = parsed.data.email.trim().toLowerCase();
    const { password } = parsed.data;

    if (username.length < 3) {
      return NextResponse.json(
        { error: "Invalid input data." },
        { status: 400 }
      );
    }

    const existingByEmail = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
    });

    if (existingByEmail) {
      return NextResponse.json(
        { error: "Diese E-Mail ist bereits registriert." },
        { status: 409 }
      );
    }

    const existingByUsername = await prisma.user.findUnique({
      where: { username },
    });

    if (existingByUsername) {
      return NextResponse.json(
        { error: "Dieser Username ist bereits vergeben." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
        approved: false,
        role: "USER",
      },
    });

    return NextResponse.json(
      { message: "Account erstellt. Warte auf Freischaltung durch einen Admin." },
      { status: 201 }
    );
  } catch (error) {
    console.error("REGISTER_ERROR", error);

    return NextResponse.json(
      { error: "Serverfehler bei der Registrierung." },
      { status: 500 }
    );
  }
}