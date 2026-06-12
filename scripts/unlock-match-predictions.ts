#!/usr/bin/env tsx

import { unlockMatchPredictions } from "@/lib/match-unlock";

const MATCH_ID = Number.parseInt(process.env.MATCH_ID || "2", 10);
const UNLOCK_HOURS = process.env.UNLOCK_HOURS?.trim();
const untilKickoff = process.argv.includes("--until-kickoff") || !UNLOCK_HOURS;

async function main() {
  const hours = untilKickoff ? undefined : Number.parseFloat(UNLOCK_HOURS || "1");

  if (!untilKickoff && (hours === undefined || !Number.isFinite(hours) || hours <= 0)) {
    throw new Error("Set UNLOCK_HOURS to a positive number or pass --until-kickoff.");
  }

  const result = await unlockMatchPredictions(MATCH_ID, { hours });

  console.log(
    JSON.stringify(
      {
        ok: true,
        ...result,
        note:
          hours !== undefined
            ? `Predictions for match ${MATCH_ID} are open until ${result.predictionUnlockUntil}.`
            : `Predictions for match ${MATCH_ID} stay open until kickoff (${result.predictionUnlockUntil}), even if isLocked is true.`
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
    const { prisma } = await import("@/lib/prisma");
    await prisma.$disconnect();
  });
