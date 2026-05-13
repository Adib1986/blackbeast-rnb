"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type ReplyActionInput = {
  replyId: string;
  categorySlug: string;
  threadId: string;
};

type UpdateReplyInput = ReplyActionInput & {
  content: string;
};

async function getCurrentUser() {
  const session = await auth();

  const email = session?.user?.email;

  if (!email) {
    throw new Error("Nicht angemeldet.");
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("User nicht gefunden.");
  }

  return user;
}

export async function deleteReplyAction({
  replyId,
  categorySlug,
  threadId,
}: ReplyActionInput) {
  const user = await getCurrentUser();

  const reply = await prisma.reply.findUnique({
    where: { id: replyId },
  });

  if (!reply) {
    throw new Error("Antwort nicht gefunden.");
  }

  const isOwner = reply.authorId === user.id;
  const isAdmin = user.role === "ADMIN";

  if (!isOwner && !isAdmin) {
    throw new Error("Keine Berechtigung.");
  }

  await prisma.reply.delete({
    where: { id: replyId },
  });

  revalidatePath(`/forum/${categorySlug}/${threadId}`);
}

export async function updateReplyAction({
  replyId,
  content,
  categorySlug,
  threadId,
}: UpdateReplyInput) {
  const user = await getCurrentUser();

  const reply = await prisma.reply.findUnique({
    where: { id: replyId },
  });

  if (!reply) {
    throw new Error("Antwort nicht gefunden.");
  }

  const isOwner = reply.authorId === user.id;
  const isAdmin = user.role === "ADMIN";

  if (!isOwner && !isAdmin) {
    throw new Error("Keine Berechtigung.");
  }

  await prisma.reply.update({
    where: { id: replyId },
    data: {
      content: content.trim(),
    },
  });

  revalidatePath(`/forum/${categorySlug}/${threadId}`);
}