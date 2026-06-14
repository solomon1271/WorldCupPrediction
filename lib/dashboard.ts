import { buildLeagueLeaderboard } from "@/lib/leaderboard";
import {
  formatTodayLabel,
  formatTimezoneShortName,
  getAppTimezone,
  getMatchUrgency,
  MatchUrgency,
  sortMatchesByUrgency
} from "@/lib/match-urgency";
import { getMatchLockLeadMinutes, isMatchLocked } from "@/lib/match-lock";
import {
  getPredictionScoreBreakdown,
  normalizeRedCardsLine,
  normalizeThresholdLine,
  type PredictionScoreBreakdown
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
  scoreBreakdown: PredictionScoreBreakdown | null;
};

export type DashboardMatch = {
  id: number;
  stage: string;
  kickoff: string;
  venue: string;
  homeTeam: string;
  awayTeam: string;
  locked: boolean;
  urgency: MatchUrgency;
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
  goldenGlove: string | null;
  bestPlayer: string | null;
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
  rankChange?: number;
};

function normalizeTournamentPrediction(
  prediction: {
    champion: string | null;
    runnerUp: string | null;
    goldenBoot: string | null;
    bestYoungPlayer: string | null;
    goldenGlove: string | null;
    bestPlayer: string | null;
    groupWinners: string;
  } | null
): DashboardTournamentPrediction {
  return {
    champion: prediction?.champion || null,
    runnerUp: prediction?.runnerUp || null,
    goldenBoot: prediction?.goldenBoot || null,
    bestYoungPlayer: prediction?.bestYoungPlayer || null,
    goldenGlove: prediction?.goldenGlove || null,
    bestPlayer: prediction?.bestPlayer || null,
    groupWinners: prediction ? (JSON.parse(prediction.groupWinners) as Record<string, string>) : {}
  };
}

export async function getDashboardData(leagueId: string, currentUserId: string) {
  const [matches, currentMember] = await Promise.all([
    prisma.match.findMany({
      orderBy: [{ kickoff: "asc" }],
      include: {
        predictions: {
          where: {
            leagueId,
            userId: currentUserId
          }
        }
      }
    }),
    prisma.leagueMember.findUnique({
      where: {
        leagueId_userId: {
          leagueId,
          userId: currentUserId
        }
      },
      include: {
        user: {
          include: {
            tournamentPredictions: {
              where: { leagueId },
              take: 1
            }
          }
        }
      }
    })
  ]);

  const currentUser = currentMember?.user;
  const leaderboard = await buildLeagueLeaderboard(leagueId);
  const currentUserStanding = leaderboard.find((entry) => entry.id === currentUserId);
  const referenceNow = new Date();
  const predictionTimeZone = getAppTimezone();
  const todayLabel = formatTodayLabel(predictionTimeZone, referenceNow);
  const timezoneShortName = formatTimezoneShortName(predictionTimeZone, referenceNow);

  const dashboardMatches = sortMatchesByUrgency(
    matches.map((match) => {
      const hasPrediction = match.predictions.length > 0;
      const isFinished = match.finalHomeScore !== null && match.finalAwayScore !== null;
      const locked = isMatchLocked(
        {
          kickoff: match.kickoff,
          predictionUnlockUntil: match.predictionUnlockUntil,
          finalHomeScore: match.finalHomeScore,
          finalAwayScore: match.finalAwayScore
        },
        referenceNow
      );

      return {
        id: match.id,
        stage: match.stage,
        kickoff: match.kickoff.toISOString(),
        venue: match.venue,
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
        locked,
        urgency: getMatchUrgency({
          kickoff: match.kickoff,
          isLocked: locked,
          isFinished,
          hasPrediction,
          timeZone: predictionTimeZone,
          referenceDate: referenceNow
        }),
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
      };
    })
  );

  return {
    matches: dashboardMatches as DashboardMatch[],
    myPredictions: matches
      .filter((match) => match.predictions.length > 0)
      .map((match) => {
        const prediction = match.predictions[0];
        const isFinished = match.finalHomeScore !== null && match.finalAwayScore !== null;
        const normalizedPrediction = {
          winner: prediction.winner,
          homeScore: prediction.homeScore,
          awayScore: prediction.awayScore,
          totalGoalsLine: normalizeThresholdLine(prediction.totalGoalsLine),
          totalCornersLine: normalizeThresholdLine(prediction.totalCornersLine),
          yellowCardsLine: normalizeThresholdLine(prediction.yellowCardsLine),
          redCardsLine: normalizeRedCardsLine(prediction.redCardsLine)
        };

        return {
          matchId: prediction.matchId,
          ...normalizedPrediction,
          scoreBreakdown: isFinished
            ? getPredictionScoreBreakdown(normalizedPrediction, {
                homeTeam: match.homeTeam,
                awayTeam: match.awayTeam,
                finalHomeScore: match.finalHomeScore,
                finalAwayScore: match.finalAwayScore,
                finalYellowCards: match.finalYellowCards,
                finalTotalCorners: match.finalTotalCorners,
                finalRedCards: match.finalRedCards
              })
            : null
        };
      }) as DashboardMatchPrediction[],
    leaderboard,
    tournamentPrediction: normalizeTournamentPrediction(currentUser?.tournamentPredictions[0] || null),
    currentUserName: currentUser?.displayName || "Manager",
    trendSummary: currentUserStanding ? momentumLabel(currentUserStanding.trend) : "No change",
    totalMatches: matches.length,
    totalPlayers: leaderboard.length,
    todayLabel,
    timezoneShortName,
    predictionTimeZone,
    referenceNow: referenceNow.toISOString(),
    lockLeadMinutes: getMatchLockLeadMinutes()
  };
}
