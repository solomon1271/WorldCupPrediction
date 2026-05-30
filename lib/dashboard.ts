import { attachRankMomentum, buildLeaderboardEntries, loadLeaderboardSnapshot } from "@/lib/leaderboard";
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

function normalizeTournamentPrediction(
  prediction: {
    champion: string | null;
    runnerUp: string | null;
    goldenBoot: string | null;
    bestYoungPlayer: string | null;
    groupWinners: string;
  } | null
): DashboardTournamentPrediction {
  return {
    champion: prediction?.champion || null,
    runnerUp: prediction?.runnerUp || null,
    goldenBoot: prediction?.goldenBoot || null,
    bestYoungPlayer: prediction?.bestYoungPlayer || null,
    groupWinners: prediction ? (JSON.parse(prediction.groupWinners) as Record<string, string>) : {}
  };
}

async function getLeagueUsersWithPredictions(leagueId: string) {
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
    },
    orderBy: [{ joinedAt: "asc" }]
  });

  return members.map((member) => member.user);
}

export async function getDashboardData(leagueId: string, currentUserId: string) {
  const [matches, users, currentMember] = await Promise.all([
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
    getLeagueUsersWithPredictions(leagueId),
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
  const snapshot = await loadLeaderboardSnapshot(leagueId);
  const leaderboard = attachRankMomentum(buildLeaderboardEntries(users), snapshot);
  const currentUserStanding = leaderboard.find((entry) => entry.id === currentUserId);

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
      .map((match) => match.predictions[0])
      .filter((prediction): prediction is NonNullable<typeof prediction> => Boolean(prediction))
      .map((prediction) => ({
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
    tournamentPrediction: normalizeTournamentPrediction(currentUser?.tournamentPredictions[0] || null),
    currentUserName: currentUser?.displayName || "Manager",
    trendSummary: currentUserStanding ? momentumLabel(currentUserStanding.trend) : "No change",
    totalMatches: matches.length,
    totalPlayers: users.length
  };
}
