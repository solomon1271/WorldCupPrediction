import { buildKnockoutLeaderboard } from "@/lib/leaderboard";
import { isTournamentComplete, TOURNAMENT_FINALE_MATCH_ID } from "@/lib/tournament-announcement";
import { prisma } from "@/lib/prisma";

export type KnockoutCelebrationWinner = {
  userId: string;
  displayName: string;
  totalPoints: number;
};

export type KnockoutCelebration = {
  finaleMatchId: number;
  finaleLabel: string;
  winners: KnockoutCelebrationWinner[];
};

function getKnockoutRevealClient() {
  if (!("knockoutRevealSeen" in prisma) || !prisma.knockoutRevealSeen) {
    return null;
  }

  return prisma.knockoutRevealSeen;
}

export async function markKnockoutCelebrationSeen(leagueId: string, userId: string) {
  const revealClient = getKnockoutRevealClient();

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

export async function getPendingKnockoutCelebration(
  leagueId: string,
  userId: string
): Promise<KnockoutCelebration | null> {
  if (!(await isTournamentComplete())) {
    return null;
  }

  const revealClient = getKnockoutRevealClient();

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

  const finale = await prisma.match.findUnique({
    where: { id: TOURNAMENT_FINALE_MATCH_ID },
    select: {
      id: true,
      homeTeam: true,
      awayTeam: true,
      finalHomeScore: true,
      finalAwayScore: true
    }
  });

  if (!finale || finale.finalHomeScore === null || finale.finalAwayScore === null) {
    return null;
  }

  const standings = await buildKnockoutLeaderboard(leagueId);
  const leader = standings[0];

  if (!leader || leader.totalPoints <= 0) {
    return null;
  }

  const winners = standings
    .filter((entry) => entry.totalPoints === leader.totalPoints)
    .map((entry) => ({
      userId: entry.id,
      displayName: entry.name,
      totalPoints: entry.totalPoints
    }));

  return {
    finaleMatchId: finale.id,
    finaleLabel: `${finale.homeTeam} ${finale.finalHomeScore}–${finale.finalAwayScore} ${finale.awayTeam}`,
    winners
  };
}
