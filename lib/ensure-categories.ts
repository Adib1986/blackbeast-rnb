import { prisma } from "@/lib/prisma";

export const DEFAULT_CATEGORIES = [
  {
    name: "Vorstellung",
    slug: "vorstellung",
    description: "Hier könnt ihr euch vorstellen.",
  },
  {
    name: "RNB Talk",
    slug: "rnb-talk",
    description: "Über R&B, Sounds und Lieblingssongs sprechen.",
  },
  {
    name: "Music Production",
    slug: "music-production",
    description: "Beats, Mix, Gear und Workflow.",
  },
  {
    name: "Releases & Links",
    slug: "member-tracks",
    description: "Neue Tracks und Links teilen.",
  },
  {
    name: "Collabs",
    slug: "collabs",
    description: "Partner für Songs und Features finden.",
  },
  {
    name: "Off Topic",
    slug: "off-topic",
    description: "Alles außerhalb von Musik.",
  },
];

export function sortCategories<T extends { slug: string }>(categories: T[]): T[] {
  const order = DEFAULT_CATEGORIES.map((category) => category.slug);

  return [...categories].sort((a, b) => {
    const aIndex = order.indexOf(a.slug);
    const bIndex = order.indexOf(b.slug);

    return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
  });
}

export async function ensureDefaultCategories() {
  await Promise.all(
    DEFAULT_CATEGORIES.map((category) =>
      prisma.category.upsert({
        where: { slug: category.slug },
        update: {
          name: category.name,
          description: category.description,
        },
        create: category,
      })
    )
  );
}
