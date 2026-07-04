import {
  buildRoundOf32Leaders,
  getRoundOf32Matches,
  ROUND_OF_32_FINALE_MATCH_ID,
  isRoundOf32Complete
} from "@/lib/round-of-32";
import { prisma } from "@/lib/prisma";

export type RoundOf32CelebrationWinner = {
  userId: string;
  displayName: string;
  totalPoints: number;
};

export type RoundOf32Celebration = {
  finaleMatchId: number;
  finaleLabel: string;
  winners: RoundOf32CelebrationWinner[];
};

function getRoundOf32RevealClient() {
  if (!("roundOf32RevealSeen" in prisma) || !prisma.roundOf32RevealSeen) {
    return null;
  }

  return prisma.roundOf32RevealSeen;
}

export async function markRoundOf32CelebrationSeen(leagueId: string, userId: string) {
  const revealClient = getRoundOf32RevealClient();

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

export async function getPendingRoundOf32Celebration(
  leagueId: string,
  userId: string
): Promise<RoundOf32Celebration | null> {
  if (!(await isRoundOf32Complete())) {
    return null;
  }

  const revealClient = getRoundOf32RevealClient();

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

  const roundMatches = await getRoundOf32Matches();
  const finale = roundMatches.find((match) => match.id === ROUND_OF_32_FINALE_MATCH_ID);

  if (!finale) {
    return null;
  }

  const leaders = await buildRoundOf32Leaders(leagueId);

  if (leaders.length === 0) {
    return null;
  }

  return {
    finaleMatchId: finale.id,
    finaleLabel: `${finale.homeTeam} vs ${finale.awayTeam}`,
    winners: leaders.map((leader) => ({
      userId: leader.id,
      displayName: leader.name,
      totalPoints: leader.totalPoints
    }))
  };
}
