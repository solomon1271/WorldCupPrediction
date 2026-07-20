import { Prisma } from "../generated/prisma";

import { isActiveKnockoutMatchId, isGroupStageMatchId, isRoundOf32MatchId } from "@/lib/knockout-stage";
import { scorePrediction } from "@/lib/match-scoring";
import { prisma } from "@/lib/prisma";
import {
  hasConfiguredOfficialAwards,
  parseOfficialAwards,
  scoreTournamentPrediction,
  type TournamentAwards
} from "@/lib/tournament-scoring";
import { getRankChange, getRankMomentum, PlayerMomentum } from "@/lib/utils";

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

export type LeaderboardScope = "knockout" | "round-of-32" | "group-stage" | "top-picks";

export type TopPicksStanding = {
  id: string;
  name: string;
  totalPoints: number;
  hits: number;
  exactScores: number;
  outcomes: number;
  bonusHits: number;
  rank: number;
  previousRank?: number;
  afterRank?: number;
  hasSnapshot: boolean;
  trend: PlayerMomentum;
  rankChange?: number;
  picks: {
    champion: string | null;
    runnerUp: string | null;
    goldenBoot: string | null;
    bestYoungPlayer: string | null;
    goldenGlove: string | null;
    bestPlayer: string | null;
  };
  breakdown: ReturnType<typeof scoreTournamentPrediction>["items"];
};

type UserWithPredictions = Prisma.UserGetPayload<{
  include: {
    matchPredictions: {
      include: {
        match: true;
      };
    };
    tournamentPredictions: true;
  };
}>;

function predictionsForScope(
  predictions: UserWithPredictions["matchPredictions"],
  scope: Exclude<LeaderboardScope, "top-picks">
) {
  if (scope === "knockout") {
    return predictions.filter((prediction) => isActiveKnockoutMatchId(prediction.matchId));
  }

  if (scope === "round-of-32") {
    return predictions.filter((prediction) => isRoundOf32MatchId(prediction.matchId));
  }

  return predictions.filter((prediction) => isGroupStageMatchId(prediction.matchId));
}

export function sortLeaderboardEntries<T extends LeaderboardTotals>(entries: T[]) {
  return [...entries].sort(
    (a, b) =>
      b.totalPoints - a.totalPoints || b.exactScores - a.exactScores || b.bonusHits - a.bonusHits
  );
}

export function buildLeaderboardEntries(
  users: UserWithPredictions[],
  officialAwards: TournamentAwards = {},
  scope: Exclude<LeaderboardScope, "top-picks"> = "knockout"
): LeaderboardEntry[] {
  void officialAwards;

  return sortLeaderboardEntries(
    users.map((user) => {
      const totals = predictionsForScope(user.matchPredictions, scope).reduce(
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

export function buildTopPicksEntries(
  users: UserWithPredictions[],
  officialAwards: TournamentAwards
): Omit<TopPicksStanding, "rank" | "previousRank" | "afterRank" | "hasSnapshot" | "trend" | "rankChange">[] {
  const awardsConfigured = hasConfiguredOfficialAwards(officialAwards);

  const entries = users.map((user) => {
    const prediction = user.tournamentPredictions[0] ?? {
      champion: null,
      runnerUp: null,
      goldenBoot: null,
      bestYoungPlayer: null,
      goldenGlove: null,
      bestPlayer: null
    };
    const score = awardsConfigured
      ? scoreTournamentPrediction(prediction, officialAwards)
      : { points: 0, hits: 0, items: [] as ReturnType<typeof scoreTournamentPrediction>["items"] };

    return {
      id: user.id,
      name: user.displayName,
      totalPoints: score.points,
      hits: score.hits,
      exactScores: score.hits,
      outcomes: 0,
      bonusHits: score.hits,
      picks: {
        champion: prediction.champion,
        runnerUp: prediction.runnerUp,
        goldenBoot: prediction.goldenBoot,
        bestYoungPlayer: prediction.bestYoungPlayer,
        goldenGlove: prediction.goldenGlove,
        bestPlayer: prediction.bestPlayer
      },
      breakdown: score.items
    };
  });

  return [...entries].sort(
    (a, b) => b.totalPoints - a.totalPoints || b.hits - a.hits || a.name.localeCompare(b.name)
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
          },
          tournamentPredictions: {
            where: { leagueId },
            take: 1
          }
        }
      }
    }
  });

  return members.map((member) => member.user);
}

async function getLeagueOfficialAwards(leagueId: string) {
  const league = await prisma.league.findUnique({
    where: { id: leagueId },
    select: { officialAwardsJson: true }
  });

  return parseOfficialAwards(league?.officialAwardsJson);
}

export async function computeKnockoutRankMap(leagueId: string) {
  const [users, officialAwards] = await Promise.all([
    getLeagueUsersWithPredictions(leagueId),
    getLeagueOfficialAwards(leagueId)
  ]);

  return buildRankMap(buildLeaderboardEntries(users, officialAwards, "knockout"));
}

function getLeaderboardStateClient() {
  if (!("leaderboardState" in prisma) || !prisma.leaderboardState) {
    return null;
  }

  return prisma.leaderboardState;
}

function getKnockoutLeaderboardStateClient() {
  if (!("knockoutLeaderboardState" in prisma) || !prisma.knockoutLeaderboardState) {
    return null;
  }

  return prisma.knockoutLeaderboardState;
}

function getRoundOf32LeaderboardStateClient() {
  if (!("roundOf32LeaderboardState" in prisma) || !prisma.roundOf32LeaderboardState) {
    return null;
  }

  return prisma.roundOf32LeaderboardState;
}

export async function loadGroupStageLeaderboardSnapshot(leagueId: string): Promise<LeaderboardSnapshot> {
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

export type LeaderboardSnapshot = {
  hasSnapshot: boolean;
  previousRanks: Record<string, number>;
  afterRanks: Record<string, number>;
};

export async function loadKnockoutLeaderboardSnapshot(leagueId: string): Promise<LeaderboardSnapshot> {
  const knockoutLeaderboardState = getKnockoutLeaderboardStateClient();

  if (!knockoutLeaderboardState) {
    return {
      hasSnapshot: false,
      previousRanks: {},
      afterRanks: {}
    };
  }

  const state = await knockoutLeaderboardState.findUnique({
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

export async function recordKnockoutLeaderboardSnapshot(
  leagueId: string,
  ranksBefore: Record<string, number>,
  ranksAfter: Record<string, number>
) {
  const knockoutLeaderboardState = getKnockoutLeaderboardStateClient();

  if (!knockoutLeaderboardState) {
    return;
  }

  await knockoutLeaderboardState.upsert({
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

export async function loadRoundOf32LeaderboardSnapshot(leagueId: string): Promise<LeaderboardSnapshot> {
  const roundOf32LeaderboardState = getRoundOf32LeaderboardStateClient();

  if (!roundOf32LeaderboardState) {
    return {
      hasSnapshot: false,
      previousRanks: {},
      afterRanks: {}
    };
  }

  const state = await roundOf32LeaderboardState.findUnique({
    where: { leagueId }
  });

  if (!state) {
    return {
      hasSnapshot: false,
      previousRanks: {},
      afterRanks: {}
    };
  }

  const afterRanks = parseRankMap(state.ranksJson);

  return {
    hasSnapshot: Object.keys(afterRanks).length > 0,
    previousRanks: parseRankMap(state.previousRanksJson),
    afterRanks
  };
}

export async function recordRoundOf32LeaderboardSnapshot(
  leagueId: string,
  ranksBefore: Record<string, number>,
  ranksAfter: Record<string, number>
) {
  const roundOf32LeaderboardState = getRoundOf32LeaderboardStateClient();

  if (!roundOf32LeaderboardState) {
    return;
  }

  await roundOf32LeaderboardState.upsert({
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

export async function computeRoundOf32RankMap(leagueId: string) {
  const [users, officialAwards] = await Promise.all([
    getLeagueUsersWithPredictions(leagueId),
    getLeagueOfficialAwards(leagueId)
  ]);

  return buildRankMap(buildLeaderboardEntries(users, officialAwards, "round-of-32"));
}

export async function isRoundOf32PhaseFinalized(leagueId: string) {
  const snapshot = await loadRoundOf32LeaderboardSnapshot(leagueId);
  return snapshot.hasSnapshot;
}

export async function captureKnockoutLeaderboardSnapshotForMaintenance() {
  const leagues = await prisma.league.findMany({
    select: { id: true }
  });
  const ranksBeforeByLeague: Record<string, Record<string, number>> = {};

  for (const league of leagues) {
    ranksBeforeByLeague[league.id] = await computeKnockoutRankMap(league.id);
  }

  return ranksBeforeByLeague;
}

export async function finalizeKnockoutLeaderboardSnapshot(
  ranksBeforeByLeague: Record<string, Record<string, number>>
) {
  const leaderboard: Record<string, { ranksBefore: Record<string, number>; ranksAfter: Record<string, number> }> =
    {};

  for (const [leagueId, ranksBefore] of Object.entries(ranksBeforeByLeague)) {
    const ranksAfter = await computeKnockoutRankMap(leagueId);
    await recordKnockoutLeaderboardSnapshot(leagueId, ranksBefore, ranksAfter);
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
    rankChange?: number;
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

    const rankChange =
      previousRank !== undefined ? getRankChange(previousRank, afterRank ?? rank) : undefined;

    return {
      ...entry,
      rank,
      previousRank,
      afterRank,
      rankChange,
      hasSnapshot: snapshot.hasSnapshot,
      trend
    };
  });
}

export async function buildKnockoutLeaderboard(leagueId: string) {
  const [users, snapshot, officialAwards] = await Promise.all([
    getLeagueUsersWithPredictions(leagueId),
    loadKnockoutLeaderboardSnapshot(leagueId),
    getLeagueOfficialAwards(leagueId)
  ]);

  return attachRankMomentum(buildLeaderboardEntries(users, officialAwards, "knockout"), snapshot);
}

export async function buildGroupStageLeaderboard(leagueId: string) {
  const [users, snapshot, officialAwards] = await Promise.all([
    getLeagueUsersWithPredictions(leagueId),
    loadGroupStageLeaderboardSnapshot(leagueId),
    getLeagueOfficialAwards(leagueId)
  ]);

  return attachRankMomentum(buildLeaderboardEntries(users, officialAwards, "group-stage"), snapshot);
}

export async function buildRoundOf32Leaderboard(leagueId: string) {
  const [users, snapshot, officialAwards] = await Promise.all([
    getLeagueUsersWithPredictions(leagueId),
    loadRoundOf32LeaderboardSnapshot(leagueId),
    getLeagueOfficialAwards(leagueId)
  ]);

  return attachRankMomentum(buildLeaderboardEntries(users, officialAwards, "round-of-32"), snapshot);
}

export async function buildTopPicksLeaderboard(leagueId: string): Promise<TopPicksStanding[]> {
  const [users, officialAwards] = await Promise.all([
    getLeagueUsersWithPredictions(leagueId),
    getLeagueOfficialAwards(leagueId)
  ]);

  return buildTopPicksEntries(users, officialAwards).map((entry, index) => ({
    ...entry,
    rank: index + 1,
    hasSnapshot: false,
    trend: "neutral" as PlayerMomentum
  }));
}

export async function getOfficialAwardsForLeague(leagueId: string) {
  return getLeagueOfficialAwards(leagueId);
}

export async function finalizeRoundOf32PhaseIfComplete() {
  const { isRoundOf32Complete } = await import("@/lib/round-of-32");

  if (!(await isRoundOf32Complete())) {
    return { finalized: false, leagues: [] as string[] };
  }

  const leagues = await prisma.league.findMany({ select: { id: true } });
  const finalizedLeagues: string[] = [];

  for (const league of leagues) {
    if (await isRoundOf32PhaseFinalized(league.id)) {
      continue;
    }

    const ranksAfter = await computeRoundOf32RankMap(league.id);
    await recordRoundOf32LeaderboardSnapshot(league.id, ranksAfter, ranksAfter);
    await recordKnockoutLeaderboardSnapshot(league.id, {}, {});
    finalizedLeagues.push(league.id);
  }

  return { finalized: finalizedLeagues.length > 0, leagues: finalizedLeagues };
}

/** @deprecated Use buildKnockoutLeaderboard */
export const buildLeagueLeaderboard = buildKnockoutLeaderboard;
