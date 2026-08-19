import { prisma } from "@/lib/prisma";

export const DEFAULT_CATEGORIES = [
  { name: "RNB Talk", slug: "rnb-talk" },
  { name: "Music Production", slug: "music-production" },
  { name: "Releases & Links", slug: "member-tracks" },
  { name: "Collabs", slug: "collabs" },
  { name: "Off Topic", slug: "off-topic" },
];

export async function ensureDefaultCategories() {
  await Promise.all(
    DEFAULT_CATEGORIES.map((category) =>
      prisma.category.upsert({
        where: { slug: category.slug },
        update: { name: category.name },
        create: category,
      })
    )
  );
}
