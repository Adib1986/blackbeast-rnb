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
        { error: "Invalid input data." },
        { status: 400 }
      );
    }

    const { username, email, password } = parsed.data;

    const existingByEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingByEmail) {
      return NextResponse.json(
        { error: "Email already registered." },
        { status: 409 }
      );
    }

    const existingByUsername = await prisma.user.findUnique({
      where: { username },
    });

    if (existingByUsername) {
      return NextResponse.json(
        { error: "Username already taken." },
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
      { message: "Account created. Waiting for admin approval." },
      { status: 201 }
    );
  } catch (error) {
    console.error("REGISTER_ERROR", error);

    return NextResponse.json(
      { error: "Server error during registration." },
      { status: 500 }
    );
  }
}