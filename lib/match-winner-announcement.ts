import {
  normalizeRedCardsLine,
  normalizeThresholdLine,
  scorePrediction,
  type PredictionInput
} from "@/lib/match-scoring";
import { prisma } from "@/lib/prisma";

export type MatchWinnerRevealWinner = {
  userId: string;
  displayName: string;
  points: number;
};

export type MatchWinnerRevealAnnouncement = {
  matchId: number;
  stage: string;
  kickoff: string;
  homeTeam: string;
  awayTeam: string;
  finalScore: {
    home: number;
    away: number;
  };
  winners: MatchWinnerRevealWinner[];
};

function getMatchWinnerRevealClient() {
  if (!("matchWinnerRevealSeen" in prisma) || !prisma.matchWinnerRevealSeen) {
    return null;
  }

  return prisma.matchWinnerRevealSeen;
}

function toPredictionInput(prediction: {
  winner: string;
  homeScore: number | null;
  awayScore: number | null;
  totalGoalsLine: string;
  totalCornersLine: string;
  yellowCardsLine: string;
  redCardsLine: string;
}): PredictionInput {
  return {
    winner: prediction.winner,
    homeScore: prediction.homeScore,
    awayScore: prediction.awayScore,
    totalGoalsLine: normalizeThresholdLine(prediction.totalGoalsLine),
    totalCornersLine: normalizeThresholdLine(prediction.totalCornersLine),
    yellowCardsLine: normalizeThresholdLine(prediction.yellowCardsLine),
    redCardsLine: normalizeRedCardsLine(prediction.redCardsLine)
  };
}

export async function markMatchWinnerRevealSeen(leagueId: string, userId: string, matchId: number) {
  const revealClient = getMatchWinnerRevealClient();

  if (!revealClient) {
    return;
  }

  await revealClient.upsert({
    where: {
      leagueId_userId_matchId: {
        leagueId,
        userId,
        matchId
      }
    },
    update: {},
    create: {
      leagueId,
      userId,
      matchId
    }
  });
}

async function markMatchWinnerRevealsSeen(leagueId: string, userId: string, matchIds: number[]) {
  if (matchIds.length === 0) {
    return;
  }

  await Promise.all(matchIds.map((matchId) => markMatchWinnerRevealSeen(leagueId, userId, matchId)));
}

function buildWinnersForMatch(
  match: {
    id: number;
    homeTeam: string;
    awayTeam: string;
    finalHomeScore: number | null;
    finalAwayScore: number | null;
    finalYellowCards: number | null;
    finalTotalCorners: number | null;
    finalRedCards: number | null;
  },
  predictions: Array<{
    winner: string;
    homeScore: number | null;
    awayScore: number | null;
    totalGoalsLine: string;
    totalCornersLine: string;
    yellowCardsLine: string;
    redCardsLine: string;
    user: {
      id: string;
      displayName: string;
    };
  }>
) {
  if (predictions.length === 0) {
    return [];
  }

  const scored = predictions.map((prediction) => ({
    userId: prediction.user.id,
    displayName: prediction.user.displayName,
    points: scorePrediction(toPredictionInput(prediction), match).points
  }));

  const topScore = Math.max(...scored.map((entry) => entry.points));

  return scored.filter((entry) => entry.points === topScore);
}

export async function getPendingMatchWinnerRevealAnnouncements(
  leagueId: string,
  userId: string
): Promise<MatchWinnerRevealAnnouncement[]> {
  const revealClient = getMatchWinnerRevealClient();

  const finishedMatches = await prisma.match.findMany({
    where: {
      finalHomeScore: { not: null },
      finalAwayScore: { not: null }
    },
    orderBy: { kickoff: "asc" }
  });

  if (finishedMatches.length === 0) {
    return [];
  }

  const seenMatchIds = new Set<number>();

  if (revealClient) {
    const seenRows = await revealClient.findMany({
      where: { leagueId, userId },
      select: { matchId: true }
    });

    for (const row of seenRows) {
      seenMatchIds.add(row.matchId);
    }
  }

  const unseenMatches = finishedMatches.filter((match) => !seenMatchIds.has(match.id));

  if (unseenMatches.length === 0) {
    return [];
  }

  const predictions = await prisma.matchPrediction.findMany({
    where: {
      leagueId,
      matchId: { in: unseenMatches.map((match) => match.id) }
    },
    include: {
      user: {
        select: {
          id: true,
          displayName: true
        }
      }
    }
  });

  const predictionsByMatchId = new Map<number, typeof predictions>();

  for (const prediction of predictions) {
    const existing = predictionsByMatchId.get(prediction.matchId) ?? [];
    existing.push(prediction);
    predictionsByMatchId.set(prediction.matchId, existing);
  }

  const announcements: MatchWinnerRevealAnnouncement[] = [];
  const autoSeenMatchIds: number[] = [];

  for (const match of unseenMatches) {
    const matchPredictions = predictionsByMatchId.get(match.id) ?? [];

    if (matchPredictions.length === 0) {
      autoSeenMatchIds.push(match.id);
      continue;
    }

    const winners = buildWinnersForMatch(match, matchPredictions);

    if (winners.length === 0) {
      autoSeenMatchIds.push(match.id);
      continue;
    }

    announcements.push({
      matchId: match.id,
      stage: match.stage,
      kickoff: match.kickoff.toISOString(),
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      finalScore: {
        home: match.finalHomeScore as number,
        away: match.finalAwayScore as number
      },
      winners
    });
  }

  if (revealClient && autoSeenMatchIds.length > 0) {
    await markMatchWinnerRevealsSeen(leagueId, userId, autoSeenMatchIds);
  }

  return announcements;
}
