#!/usr/bin/env tsx

import { prisma } from "@/lib/prisma";
import { seedMatches } from "@/lib/seed-data";

const TEST_MATCH_IDS = [9001, 9002, 9003];

async function main() {
  const deletedTestPredictions = await prisma.matchPrediction.deleteMany({
    where: { matchId: { in: TEST_MATCH_IDS } }
  });

  const deletedTestMatches = await prisma.match.deleteMany({
    where: { id: { in: TEST_MATCH_IDS } }
  });

  let upsertedMatches = 0;

  for (const match of seedMatches) {
    await prisma.match.upsert({
      where: { id: match.id },
      update: {
        stage: match.stage,
        kickoff: match.kickoff,
        venue: match.venue,
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
        isLocked: false,
        finalHomeScore: null,
        finalAwayScore: null,
        finalYellowCards: null,
        finalTotalCorners: null,
        finalRedCards: null
      },
      create: match
    });
    upsertedMatches += 1;
  }

  const deletedPredictions = await prisma.matchPrediction.deleteMany();
  const resetTournamentPredictions = await prisma.tournamentPrediction.updateMany({
    data: {
      champion: null,
      runnerUp: null,
      goldenBoot: null,
      bestYoungPlayer: null,
      goldenGlove: null,
      bestPlayer: null,
      groupWinners: "{}"
    }
  });
  const clearedLeaderboard = await prisma.leaderboardState.deleteMany();

  const match1 = await prisma.match.findUnique({ where: { id: 1 } });

  console.log(
    JSON.stringify(
      {
        ok: true,
        match1: match1
          ? {
              homeTeam: match1.homeTeam,
              awayTeam: match1.awayTeam,
              kickoff: match1.kickoff.toISOString()
            }
          : null,
        upsertedMatches,
        deletedTestMatches: deletedTestMatches.count,
        deletedTestPredictions: deletedTestPredictions.count,
        deletedAllMatchPredictions: deletedPredictions.count,
        resetTournamentPredictions: resetTournamentPredictions.count,
        clearedLeaderboardSnapshots: clearedLeaderboard.count,
        note: "Push public/match-sync.json, run the Neon SQL, then trigger /api/cron/daily-maintain on production."
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
