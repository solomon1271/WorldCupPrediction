import { PrismaClient } from "../generated/prisma";

import { createLeague } from "../lib/leagues";
import { seedMatches } from "../lib/seed-data";

const prisma = new PrismaClient();

async function ensureDefaultLeague() {
  const existing = await prisma.league.findUnique({ where: { slug: "newrez" } });

  if (existing) {
    return existing;
  }

  const inviteCode = process.env.INVITE_CODE?.trim().toLowerCase() || "newrez-invite-code";

  return createLeague({
    slug: "newrez",
    name: "NewRez World Cup Prediction",
    inviteCode,
    subtitle: "2026 World Cup Challenge"
  });
}

async function main() {
  for (const match of seedMatches) {
    await prisma.match.upsert({
      where: { id: match.id },
      update: match,
      create: match
    });
  }

  const league = await ensureDefaultLeague();
  console.log(`Seed complete: ${seedMatches.length} matches upserted. Default league: ${league.slug} (${league.inviteCode}).`);
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
