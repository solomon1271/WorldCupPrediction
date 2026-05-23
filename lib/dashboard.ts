import { Prisma, MatchPrediction, TournamentPrediction } from "../generated/prisma";

import {
  attachRankMomentum,
  buildLeaderboardEntries,
  loadLeaderboardSnapshot
} from "@/lib/leaderboard";
import {
  normalizeRedCardsLine,
  normalizeThresholdLine
} from "@/lib/match-scoring";
import { prisma } from "@/lib/prisma";
import { momentumLabel, PlayerMomentum } from "@/lib/utils";

export type DashboardMatchPrediction = {
  matchId: number;
  winner: string;
  homeScore: number | null;
  awayScore: number | null;
  totalGoalsLine: string;
  totalCornersLine: string;
  yellowCardsLine: string;
  redCardsLine: string;
};

export type DashboardMatch = {
  id: number;
  stage: string;
  kickoff: string;
  venue: string;
  homeTeam: string;
  awayTeam: string;
  locked: boolean;
  finalScore?: {
    home: number;
    away: number;
  };
  finalStats?: {
    yellowCards: number | null;
    totalCorners: number | null;
    redCards: number | null;
  };
};

export type DashboardTournamentPrediction = {
  champion: string | null;
  runnerUp: string | null;
  goldenBoot: string | null;
  bestYoungPlayer: string | null;
  groupWinners: Record<string, string>;
};

export type DashboardStanding = {
  id: string;
  name: string;
  totalPoints: number;
  exactScores: number;
  outcomes: number;
  bonusHits: number;
  rank: number;
  previousRank?: number;
  afterRank?: number;
  hasSnapshot: boolean;
  trend: PlayerMomentum;
};

type UserWithPredictions = Prisma.UserGetPayload<{
  include: {
    matchPredictions: {
      include: {
        match: true;
      };
    };
    tournamentPrediction: true;
  };
}>;
type MatchWithUserPrediction = Prisma.MatchGetPayload<{
  include: {
    predictions: true;
  };
}>;

function normalizeTournamentPrediction(prediction: TournamentPrediction | null): DashboardTournamentPrediction {
  return {
    champion: prediction?.champion || null,
    runnerUp: prediction?.runnerUp || null,
    goldenBoot: prediction?.goldenBoot || null,
    bestYoungPlayer: prediction?.bestYoungPlayer || null,
    groupWinners: prediction ? (JSON.parse(prediction.groupWinners) as Record<string, string>) : {}
  };
}

export async function getDashboardData(currentUserId: string) {
  const [matches, users] = await Promise.all([
    prisma.match.findMany({
      orderBy: [{ kickoff: "asc" }],
      include: {
        predictions: {
          where: { userId: currentUserId }
        }
      }
    }),
    prisma.user.findMany({
      include: {
        matchPredictions: {
          include: {
            match: true
          }
        },
        tournamentPrediction: true
      }
    })
  ]) as [MatchWithUserPrediction[], UserWithPredictions[]];

  const currentUser = users.find((entry) => entry.id === currentUserId);
  const snapshot = await loadLeaderboardSnapshot();
  const leaderboard = attachRankMomentum(buildLeaderboardEntries(users), snapshot);

  const currentUserStanding = leaderboard.find((entry: DashboardStanding) => entry.id === currentUserId);

  return {
    matches: matches.map((match) => ({
      id: match.id,
      stage: match.stage,
      kickoff: match.kickoff.toISOString(),
      venue: match.venue,
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      locked: match.isLocked,
      finalScore:
        match.finalHomeScore !== null && match.finalAwayScore !== null
          ? {
              home: match.finalHomeScore,
              away: match.finalAwayScore
            }
          : undefined,
      finalStats:
        match.finalHomeScore !== null && match.finalAwayScore !== null
          ? {
              yellowCards: match.finalYellowCards,
              totalCorners: match.finalTotalCorners,
              redCards: match.finalRedCards
            }
          : undefined
    })) as DashboardMatch[],
    myPredictions: matches
      .map((match: MatchWithUserPrediction) => match.predictions[0])
      .filter((prediction): prediction is MatchPrediction => Boolean(prediction))
      .map((prediction: MatchPrediction) => ({
        matchId: prediction.matchId,
        winner: prediction.winner,
        homeScore: prediction.homeScore,
        awayScore: prediction.awayScore,
        totalGoalsLine: normalizeThresholdLine(prediction.totalGoalsLine),
        totalCornersLine: normalizeThresholdLine(prediction.totalCornersLine),
        yellowCardsLine: normalizeThresholdLine(prediction.yellowCardsLine),
        redCardsLine: normalizeRedCardsLine(prediction.redCardsLine)
      })) as DashboardMatchPrediction[],
    leaderboard,
    tournamentPrediction: normalizeTournamentPrediction(currentUser?.tournamentPrediction || null),
    currentUserName: currentUser?.displayName || "Manager",
    trendSummary: currentUserStanding ? momentumLabel(currentUserStanding.trend) : "No change",
    totalMatches: matches.length,
    totalPlayers: users.length
  };
}
