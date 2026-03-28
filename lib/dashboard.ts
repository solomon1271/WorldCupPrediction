import { Prisma, MatchPrediction, TournamentPrediction } from "../generated/prisma";

import { prisma } from "@/lib/prisma";
import { trendLabel } from "@/lib/utils";

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
  trend: "up" | "same" | "down";
};

type ScoreTotals = Omit<DashboardStanding, "id" | "name" | "trend">;
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
type ScorableMatch = {
  homeTeam: string;
  awayTeam: string;
  finalHomeScore: number | null;
  finalAwayScore: number | null;
  finalYellowCards: number | null;
  finalTotalCorners: number | null;
  finalRedCards: number | null;
};

const getMatchOutcome = (homeScore: number, awayScore: number) => {
  if (homeScore > awayScore) return "home";
  if (awayScore > homeScore) return "away";
  return "draw";
};

function normalizeThresholdLine(value: string | null | undefined) {
  return value && value.trim().length > 0 ? value : "0";
}

function scorePrediction(prediction: MatchPrediction, match: ScorableMatch) {
  if (match.finalHomeScore === null || match.finalAwayScore === null) {
    return { points: 0, exact: 0, outcome: 0, bonus: 0 };
  }

  let points = 0;
  let exact = 0;
  let outcome = 0;
  let bonus = 0;
  const pickedOutcome =
    prediction.winner === "Draw" ? "draw" : prediction.winner === match.homeTeam ? "home" : "away";
  const finalOutcome = getMatchOutcome(match.finalHomeScore, match.finalAwayScore);

  if (pickedOutcome === finalOutcome) {
    points += 3;
    outcome += 1;
  }

  if (
    prediction.homeScore !== null &&
    prediction.awayScore !== null &&
    prediction.homeScore === match.finalHomeScore &&
    prediction.awayScore === match.finalAwayScore
  ) {
    points += 5;
    exact += 1;
  }

  const finalGoalsTotal = match.finalHomeScore + match.finalAwayScore;
  if (matchesThreshold(normalizeThresholdLine(prediction.totalGoalsLine), finalGoalsTotal)) {
    points += 1;
    bonus += 1;
  }

  if (
    match.finalTotalCorners !== null &&
    matchesThreshold(normalizeThresholdLine(prediction.totalCornersLine), match.finalTotalCorners)
  ) {
    points += 1;
    bonus += 1;
  }

  if (
    match.finalYellowCards !== null &&
    matchesThreshold(normalizeThresholdLine(prediction.yellowCardsLine), match.finalYellowCards)
  ) {
    points += 1;
    bonus += 1;
  }

  if (match.finalRedCards !== null && prediction.redCardsLine === "Yes" && match.finalRedCards > 0) {
    points += 1;
    bonus += 1;
  }

  return { points, exact, outcome, bonus };
}

function hasOfficialResult(match: ScorableMatch) {
  return match.finalHomeScore !== null && match.finalAwayScore !== null;
}

function matchesThreshold(line: string | null | undefined, actual: number) {
  const normalizedLine = normalizeThresholdLine(line);

  if (normalizedLine === "0") {
    return actual === 0;
  }

  const threshold = Number(normalizedLine.replace(">", ""));
  return actual > threshold;
}

function normalizeRedCardsLine(value: string | null | undefined) {
  return value === "Yes" ? "Yes" : "No";
}

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

  const leaderboard = users
    .map((user: UserWithPredictions) => {
      const scoredMatches = user.matchPredictions.filter((prediction) => hasOfficialResult(prediction.match)).length;
      const totals = user.matchPredictions.reduce(
        (acc: ScoreTotals, prediction) => {
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

      const trend: DashboardStanding["trend"] =
        scoredMatches === 0 ? "same" : totals.totalPoints >= 10 ? "up" : totals.totalPoints === 0 ? "down" : "same";

      return {
        id: user.id,
        name: user.displayName,
        ...totals,
        trend
      };
    })
    .sort(
      (a: DashboardStanding, b: DashboardStanding) =>
        b.totalPoints - a.totalPoints || b.exactScores - a.exactScores || b.bonusHits - a.bonusHits
    );

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
    trendSummary: currentUserStanding ? trendLabel(currentUserStanding.trend) : "Holding",
    totalMatches: matches.length,
    totalPlayers: users.length
  };
}
