#!/usr/bin/env tsx

import { prisma } from "@/lib/prisma";

const MATCH_ID = 2;
const UNLOCK_HOURS = 1;

async function main() {
  const unlockUntil = new Date(Date.now() + UNLOCK_HOURS * 60 * 60 * 1000);

  const match = await prisma.match.update({
    where: { id: MATCH_ID },
    data: {
      predictionUnlockUntil: unlockUntil
    },
    select: {
      id: true,
      homeTeam: true,
      awayTeam: true,
      isLocked: true,
      predictionUnlockUntil: true
    }
  });

  console.log(
    JSON.stringify(
      {
        ok: true,
        match,
        unlockUntil: unlockUntil.toISOString(),
        note: `Predictions for match ${MATCH_ID} are open until ${unlockUntil.toISOString()}, even if isLocked is true.`
      },
      null,
      2
    )
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
