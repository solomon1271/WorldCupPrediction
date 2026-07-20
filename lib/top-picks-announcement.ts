import { buildTopPicksLeaderboard } from "@/lib/leaderboard";
import {
  hasConfiguredOfficialAwards,
  parseOfficialAwards,
  TOURNAMENT_AWARD_POINTS,
  type TournamentAwards
} from "@/lib/tournament-scoring";
import { isTournamentComplete } from "@/lib/tournament-announcement";
import { prisma } from "@/lib/prisma";

export type TopPicksCelebrationWinner = {
  userId: string;
  displayName: string;
  totalPoints: number;
  hits: number;
};

export type TopPicksCelebration = {
  awards: TournamentAwards;
  awardPoints: number;
  winners: TopPicksCelebrationWinner[];
};

function getTopPicksRevealClient() {
  if (!("topPicksRevealSeen" in prisma) || !prisma.topPicksRevealSeen) {
    return null;
  }

  return prisma.topPicksRevealSeen;
}

export async function markTopPicksCelebrationSeen(leagueId: string, userId: string) {
  const revealClient = getTopPicksRevealClient();

  if (!revealClient) {
    return;
  }

  await revealClient.upsert({
    where: {
      leagueId_userId: {
        leagueId,
        userId
      }
    },
    update: {},
    create: {
      leagueId,
      userId
    }
  });
}

export async function getPendingTopPicksCelebration(
  leagueId: string,
  userId: string
): Promise<TopPicksCelebration | null> {
  if (!(await isTournamentComplete())) {
    return null;
  }

  const league = await prisma.league.findUnique({
    where: { id: leagueId },
    select: { officialAwardsJson: true }
  });
  const awards = parseOfficialAwards(league?.officialAwardsJson);

  if (!hasConfiguredOfficialAwards(awards)) {
    return null;
  }

  const revealClient = getTopPicksRevealClient();

  if (revealClient) {
    const seen = await revealClient.findUnique({
      where: {
        leagueId_userId: {
          leagueId,
          userId
        }
      }
    });

    if (seen) {
      return null;
    }
  }

  const standings = await buildTopPicksLeaderboard(leagueId);
  const leader = standings[0];

  if (!leader || leader.totalPoints <= 0) {
    return null;
  }

  const winners = standings
    .filter((entry) => entry.totalPoints === leader.totalPoints)
    .map((entry) => ({
      userId: entry.id,
      displayName: entry.name,
      totalPoints: entry.totalPoints,
      hits: entry.hits
    }));

  return {
    awards,
    awardPoints: TOURNAMENT_AWARD_POINTS,
    winners
  };
}
