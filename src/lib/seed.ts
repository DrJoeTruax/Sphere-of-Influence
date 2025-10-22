// src/lib/seed.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.post.deleteMany();
  await prisma.sector.deleteMany();
  await prisma.galaxy.deleteMany();

  await prisma.galaxy.createMany({
    data: [
      { name: "Kindness Galaxy", icon: "🌌", communities: 5, positionX: 40, positionY: 50, size: 120 },
      { name: "Wisdom Galaxy", icon: "💫", communities: 4, positionX: 60, positionY: 30, size: 110 },
      { name: "Courage Galaxy", icon: "🔥", communities: 6, positionX: 25, positionY: 65, size: 100 },
    ],
  });

  const galaxies = await prisma.galaxy.findMany();

  for (const galaxy of galaxies) {
    await prisma.sector.createMany({
      data: [
        { name: "Empathy Sector", galaxyId: galaxy.id },
        { name: "Growth Sector", galaxyId: galaxy.id },
        { name: "Creativity Sector", galaxyId: galaxy.id },
      ],
    });

    const sectors = await prisma.sector.findMany({ where: { galaxyId: galaxy.id } });
    for (const sector of sectors) {
      await prisma.post.createMany({
        data: [
          { title: "Welcome Message", content: "Welcome to " + sector.name, sectorId: sector.id },
          { title: "Discussion Thread", content: "Share your thoughts here.", sectorId: sector.id },
        ],
      });
    }
  }

  console.log("✅ Seeded 3 galaxies with sectors and posts");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
