import {
  buildGroupStageLeaders,
  getGroupStageMatches,
  GROUP_STAGE_FINALE_MATCH_ID,
  isGroupStageComplete
} from "@/lib/group-stage";
import { prisma } from "@/lib/prisma";

export type GroupStageCelebrationWinner = {
  userId: string;
  displayName: string;
  totalPoints: number;
};

export type GroupStageCelebration = {
  finaleMatchId: number;
  finaleLabel: string;
  winners: GroupStageCelebrationWinner[];
};

function getGroupStageRevealClient() {
  if (!("groupStageRevealSeen" in prisma) || !prisma.groupStageRevealSeen) {
    return null;
  }

  return prisma.groupStageRevealSeen;
}

export async function markGroupStageCelebrationSeen(leagueId: string, userId: string) {
  const revealClient = getGroupStageRevealClient();

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

export async function getPendingGroupStageCelebration(
  leagueId: string,
  userId: string
): Promise<GroupStageCelebration | null> {
  if (!(await isGroupStageComplete())) {
    return null;
  }

  const revealClient = getGroupStageRevealClient();

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

  const groupMatches = await getGroupStageMatches();
  const finale = groupMatches.find((match) => match.id === GROUP_STAGE_FINALE_MATCH_ID);

  if (!finale) {
    return null;
  }

  const leaders = await buildGroupStageLeaders(leagueId);

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
