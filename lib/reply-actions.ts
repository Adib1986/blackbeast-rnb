"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getRequiredMember } from "@/lib/current-user";

type ReplyActionInput = {
  replyId: string;
  categorySlug: string;
  threadId: string;
};

type UpdateReplyInput = ReplyActionInput & {
  content: string;
};

export async function deleteReplyAction({
  replyId,
  categorySlug,
  threadId,
}: ReplyActionInput) {
  const user = await getRequiredMember();

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
  const user = await getRequiredMember();
  const nextContent = content.trim();

  if (!nextContent) {
    throw new Error("Antwort darf nicht leer sein.");
  }

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
      content: nextContent,
    },
  });

  revalidatePath(`/forum/${categorySlug}/${threadId}`);
}
