#!/usr/bin/env tsx

import { prisma } from "@/lib/prisma";

const TEST_MATCH_IDS = [9001, 9002, 9003];

async function main() {
  const result = await prisma.match.updateMany({
    where: { id: { in: TEST_MATCH_IDS } },
    data: {
      isLocked: false,
      finalHomeScore: null,
      finalAwayScore: null,
      finalYellowCards: null,
      finalTotalCorners: null,
      finalRedCards: null
    }
  });

  await prisma.matchPrediction.deleteMany({
    where: { matchId: { in: TEST_MATCH_IDS } }
  });

  console.log(
    JSON.stringify(
      {
        ok: true,
        resetMatches: result.count,
        matchIds: TEST_MATCH_IDS,
        note: "Run npm run matches:sync:test to refresh fixtures from public/match-sync-test.json"
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
