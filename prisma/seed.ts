import { PrismaClient } from "../generated/prisma";

import { seedMatches, seedPredictions, seedTournamentPredictions, seedUsers } from "../lib/seed-data";

const prisma = new PrismaClient();

async function main() {
  for (const match of seedMatches) {
    await prisma.match.upsert({
      where: { id: match.id },
      update: match,
      create: match
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
