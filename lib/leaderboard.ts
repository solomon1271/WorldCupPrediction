import { Prisma } from "../generated/prisma";

import { scorePrediction } from "@/lib/match-scoring";
import { prisma } from "@/lib/prisma";
import { getRankMomentum, PlayerMomentum } from "@/lib/utils";

export type LeaderboardTotals = {
  totalPoints: number;
  exactScores: number;
  outcomes: number;
  bonusHits: number;
};

export type LeaderboardEntry = LeaderboardTotals & {
  id: string;
  name: string;
};

type UserWithMatchPredictions = Prisma.UserGetPayload<{
  include: {
    matchPredictions: {
      include: {
        match: true;
      };
    };
  };
}>;

export function sortLeaderboardEntries<T extends LeaderboardTotals>(entries: T[]) {
  return [...entries].sort(
    (a, b) =>
      b.totalPoints - a.totalPoints || b.exactScores - a.exactScores || b.bonusHits - a.bonusHits
  );
}

export function buildLeaderboardEntries(users: UserWithMatchPredictions[]): LeaderboardEntry[] {
  return sortLeaderboardEntries(
    users.map((user) => {
      const totals = user.matchPredictions.reduce(
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
        id: user.id,
        name: user.displayName,
        ...totals
      };
    })
  );
}

export function buildRankMap(entries: LeaderboardEntry[]) {
  return Object.fromEntries(entries.map((entry, index) => [entry.id, index + 1]));
}

function parseRankMap(value: string) {
  try {
    const parsed = JSON.parse(value) as Record<string, unknown>;
    const ranks: Record<string, number> = {};

    for (const [userId, rank] of Object.entries(parsed)) {
      if (typeof rank === "number" && Number.isFinite(rank)) {
        ranks[userId] = rank;
      }
    }

    return ranks;
  } catch {
    return {};
  }
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
    }
  });

  return members.map((member) => member.user);
}

export async function computeCurrentRankMap(leagueId: string) {
  const users = await getLeagueUsersWithPredictions(leagueId);
  return buildRankMap(buildLeaderboardEntries(users));
}

function getLeaderboardStateClient() {
  if (!("leaderboardState" in prisma) || !prisma.leaderboardState) {
    return null;
  }

  return prisma.leaderboardState;
}

export type LeaderboardSnapshot = {
  hasSnapshot: boolean;
  previousRanks: Record<string, number>;
  afterRanks: Record<string, number>;
};

export async function loadLeaderboardSnapshot(leagueId: string): Promise<LeaderboardSnapshot> {
  const leaderboardState = getLeaderboardStateClient();

  if (!leaderboardState) {
    return {
      hasSnapshot: false,
      previousRanks: {},
      afterRanks: {}
    };
  }

  const state = await leaderboardState.findUnique({
    where: { leagueId }
  });

  if (!state) {
    return {
      hasSnapshot: false,
      previousRanks: {},
      afterRanks: {}
    };
  }

  return {
    hasSnapshot: true,
    previousRanks: parseRankMap(state.previousRanksJson),
    afterRanks: parseRankMap(state.ranksJson)
  };
}

export async function recordLeaderboardSnapshot(
  leagueId: string,
  ranksBefore: Record<string, number>,
  ranksAfter: Record<string, number>
) {
  const leaderboardState = getLeaderboardStateClient();

  if (!leaderboardState) {
    return;
  }

  await leaderboardState.upsert({
    where: { leagueId },
    create: {
      leagueId,
      ranksJson: JSON.stringify(ranksAfter),
      previousRanksJson: JSON.stringify(ranksBefore)
    },
    update: {
      ranksJson: JSON.stringify(ranksAfter),
      previousRanksJson: JSON.stringify(ranksBefore)
    }
  });
}

export async function captureLeaderboardSnapshotForMaintenance() {
  const leagues = await prisma.league.findMany({
    select: { id: true }
  });
  const ranksBeforeByLeague: Record<string, Record<string, number>> = {};

  for (const league of leagues) {
    ranksBeforeByLeague[league.id] = await computeCurrentRankMap(league.id);
  }

  return ranksBeforeByLeague;
}

export async function finalizeLeaderboardSnapshot(ranksBeforeByLeague: Record<string, Record<string, number>>) {
  const leaderboard: Record<string, { ranksBefore: Record<string, number>; ranksAfter: Record<string, number> }> = {};

  for (const [leagueId, ranksBefore] of Object.entries(ranksBeforeByLeague)) {
    const ranksAfter = await computeCurrentRankMap(leagueId);
    await recordLeaderboardSnapshot(leagueId, ranksBefore, ranksAfter);
    leaderboard[leagueId] = { ranksBefore, ranksAfter };
  }

  return leaderboard;
}

export function attachRankMomentum(
  entries: LeaderboardEntry[],
  snapshot: LeaderboardSnapshot
): Array<
  LeaderboardEntry & {
    trend: PlayerMomentum;
    rank: number;
    previousRank?: number;
    afterRank?: number;
    hasSnapshot: boolean;
  }
> {
  return entries.map((entry, index) => {
    const rank = index + 1;
    const previousRank = snapshot.previousRanks[entry.id];
    const afterRank = snapshot.afterRanks[entry.id];

    let trend: PlayerMomentum = "neutral";

    if (snapshot.hasSnapshot && previousRank !== undefined && afterRank !== undefined) {
      trend = getRankMomentum(afterRank, previousRank);
    } else if (snapshot.hasSnapshot && previousRank !== undefined) {
      trend = getRankMomentum(rank, previousRank);
    }

    return {
      ...entry,
      rank,
      previousRank,
      afterRank,
      hasSnapshot: snapshot.hasSnapshot,
      trend
    };
  });
}
