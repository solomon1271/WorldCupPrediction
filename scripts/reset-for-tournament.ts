#!/usr/bin/env tsx

import { prisma } from "@/lib/prisma";
import { seedMatches } from "@/lib/seed-data";

const TEST_MATCH_IDS = [9001, 9002, 9003];
const CRON_TEST_MATCH_ID = 1;

async function main() {
  const cronTestSeed = seedMatches.find((match) => match.id === CRON_TEST_MATCH_ID);

  if (!cronTestSeed) {
    throw new Error("Seed match 1 not found.");
  }

  const deletedTestPredictions = await prisma.matchPrediction.deleteMany({
    where: { matchId: { in: TEST_MATCH_IDS } }
  });

  const deletedTestMatches = await prisma.match.deleteMany({
    where: { id: { in: TEST_MATCH_IDS } }
  });

  const deletedCronTestPredictions = await prisma.matchPrediction.deleteMany({
    where: { matchId: CRON_TEST_MATCH_ID }
  });

  await prisma.match.update({
    where: { id: CRON_TEST_MATCH_ID },
    data: {
      stage: cronTestSeed.stage,
      kickoff: cronTestSeed.kickoff,
      venue: cronTestSeed.venue,
      homeTeam: cronTestSeed.homeTeam,
      awayTeam: cronTestSeed.awayTeam,
      isLocked: false,
      finalHomeScore: null,
      finalAwayScore: null,
      finalYellowCards: null,
      finalTotalCorners: null,
      finalRedCards: null
    }
  });

  const clearedResults = await prisma.match.updateMany({
    where: {
      id: { notIn: TEST_MATCH_IDS }
    },
    data: {
      isLocked: false,
      finalHomeScore: null,
      finalAwayScore: null,
      finalYellowCards: null,
      finalTotalCorners: null,
      finalRedCards: null
    }
  });

  const clearedLeaderboard = await prisma.leaderboardState.deleteMany();

  console.log(
    JSON.stringify(
      {
        ok: true,
        restoredMatch1: {
          homeTeam: cronTestSeed.homeTeam,
          awayTeam: cronTestSeed.awayTeam
        },
        deletedTestMatches: deletedTestMatches.count,
        deletedTestPredictions: deletedTestPredictions.count,
        deletedCronTestPredictions: deletedCronTestPredictions.count,
        clearedMatchResults: clearedResults.count,
        clearedLeaderboardSnapshots: clearedLeaderboard.count,
        note: "Push public/match-sync.json and run npm run matches:sync on production after updating DATABASE_URL."
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
