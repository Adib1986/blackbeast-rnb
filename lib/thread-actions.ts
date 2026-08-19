"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getRequiredMember } from "@/lib/current-user";

export async function deleteThreadAction({
  threadId,
  categorySlug,
}: {
  threadId: string;
  categorySlug: string;
}) {
  const user = await getRequiredMember();

  const thread = await prisma.thread.findUnique({
    where: { id: threadId },
  });

  if (!thread) {
    throw new Error("Thread nicht gefunden.");
  }

  const isOwner = thread.authorId === user.id;
  const isAdmin = user.role === "ADMIN";

  if (!isOwner && !isAdmin) {
    throw new Error("Keine Berechtigung.");
  }

  await prisma.thread.delete({
    where: { id: threadId },
  });

  revalidatePath(`/forum/${categorySlug}`);
  revalidatePath(`/forum/${categorySlug}/${threadId}`);
  revalidatePath("/forum");
}
