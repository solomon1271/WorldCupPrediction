import { sortLeaderboardEntries, type LeaderboardEntry } from "@/lib/leaderboard";
import {
  ROUND_OF_16_FIRST_MATCH_ID,
  ROUND_OF_32_FINALE_MATCH_ID,
  ROUND_OF_32_FIRST_MATCH_ID,
  isRoundOf32MatchId
} from "@/lib/knockout-stage";
import { scorePrediction } from "@/lib/match-scoring";
import { prisma } from "@/lib/prisma";

export { ROUND_OF_32_FINALE_MATCH_ID };

export function isMatchFinished(match: { finalHomeScore: number | null; finalAwayScore: number | null }) {
  return match.finalHomeScore !== null && match.finalAwayScore !== null;
}

export async function getRoundOf32Matches() {
  return prisma.match.findMany({
    where: {
      id: {
        gte: ROUND_OF_32_FIRST_MATCH_ID,
        lt: ROUND_OF_16_FIRST_MATCH_ID
      }
    },
    orderBy: { kickoff: "asc" }
  });
}

export async function isRoundOf32Complete() {
  const roundMatches = await getRoundOf32Matches();

  if (roundMatches.length === 0) {
    return false;
  }

  const finale = roundMatches.find((match) => match.id === ROUND_OF_32_FINALE_MATCH_ID);

  if (!finale || !isMatchFinished(finale)) {
    return false;
  }

  return roundMatches.every((match) => isMatchFinished(match));
}

export async function buildRoundOf32Leaders(leagueId: string): Promise<LeaderboardEntry[]> {
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
          }
        }
      }
    }
  });

  const entries = sortLeaderboardEntries(
    members.map((member) => {
      const totals = member.user.matchPredictions
        .filter((prediction) => isRoundOf32MatchId(prediction.matchId))
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
