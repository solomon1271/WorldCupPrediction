import { sortLeaderboardEntries, type LeaderboardEntry } from "@/lib/leaderboard";
import { scorePrediction } from "@/lib/match-scoring";
import { prisma } from "@/lib/prisma";

const GROUP_STAGE_PATTERN = /^Group [A-L]$/i;

/** Jordan vs Argentina — final group-stage fixture in the official schedule. */
export const GROUP_STAGE_FINALE_MATCH_ID = 69;

export function isGroupStageMatchStage(stage: string) {
  return GROUP_STAGE_PATTERN.test(stage.trim());
}

export function isMatchFinished(match: { finalHomeScore: number | null; finalAwayScore: number | null }) {
  return match.finalHomeScore !== null && match.finalAwayScore !== null;
}

export async function getGroupStageMatches() {
  const matches = await prisma.match.findMany({
    where: {
      stage: {
        startsWith: "Group "
      }
    },
    orderBy: { kickoff: "asc" }
  });

  return matches.filter((match) => isGroupStageMatchStage(match.stage));
}

export async function isGroupStageComplete() {
  const groupMatches = await getGroupStageMatches();

  if (groupMatches.length === 0) {
    return false;
  }

  const finale = groupMatches.find((match) => match.id === GROUP_STAGE_FINALE_MATCH_ID);

  if (!finale || !isMatchFinished(finale)) {
    return false;
  }

  return groupMatches.every((match) => isMatchFinished(match));
}

export async function buildGroupStageLeaders(leagueId: string): Promise<LeaderboardEntry[]> {
  const members = await prisma.leagueMember.findMany({
    where: { leagueId },
    include: {
      user: {
        include: {
          matchPredictions: {
            where: { leagueId },
            include: {
              match: true
            }
          },
          tournamentPredictions: {
            where: { leagueId },
            take: 1
          }
        }
      }
    }
  });

  const groupStageMatchIds = new Set((await getGroupStageMatches()).map((match) => match.id));

  const entries = sortLeaderboardEntries(
    members.map((member) => {
      const totals = member.user.matchPredictions
        .filter((prediction) => groupStageMatchIds.has(prediction.matchId))
        .reduce(
          (acc, prediction) => {
            const score = scorePrediction(prediction, prediction.match);
            acc.totalPoints += score.points;
            acc.exactScores += score.exact;
            acc.outcomes += score.outcome;
            acc.bonusHits += score.bonus;
            return acc;
          },
          {
            totalPoints: 0,
            exactScores: 0,
            outcomes: 0,
            bonusHits: 0
          }
        );

      return {
        id: member.user.id,
        name: member.user.displayName,
        ...totals
      };
    })
  );

  if (entries.length === 0) {
    return [];
  }

  const topScore = entries[0].totalPoints;

  return entries.filter((entry) => entry.totalPoints === topScore);
}
