import { prisma } from "../lib/prisma";

async function main() {
  const identifier = String(process.argv[2] || "").trim();

  if (!identifier) {
    console.error("Usage: npx tsx scripts/make-admin.ts email-oder-username");
    process.exit(1);
  }

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: { equals: identifier.toLowerCase(), mode: "insensitive" } },
        { username: identifier },
      ],
    },
  });

  if (!user) {
    console.error("Kein User mit dieser E-Mail oder diesem Username gefunden.");
    process.exit(1);
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      role: "ADMIN",
      approved: true,
      isBlocked: false,
    },
  });

  console.log("Admin gesetzt:", updated.username);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
