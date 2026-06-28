import { getCanonicalGroupRosters } from "@/lib/world-cup-groups";
import type {
  GroupQualificationStatus,
  GroupStandingRow,
  GroupStandingTable
} from "@/lib/group-standings-types";
import { prisma } from "@/lib/prisma";

export type { GroupQualificationStatus, GroupStandingRow, GroupStandingTable } from "@/lib/group-standings-types";

const GROUP_KEYS = "ABCDEFGHIJKL".split("");

type GroupMatch = {
  stage: string;
  homeTeam: string;
  awayTeam: string;
  finalHomeScore: number | null;
  finalAwayScore: number | null;
};

type TeamStats = Omit<GroupStandingRow, "rank" | "qualificationStatus">;

function isFinishedMatch(
  match: GroupMatch
): match is GroupMatch & { finalHomeScore: number; finalAwayScore: number } {
  return match.finalHomeScore !== null && match.finalAwayScore !== null;
}

function emptyStats(team: string): TeamStats {
  return {
    team,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    points: 0
  };
}

function applyResult(stats: TeamStats, goalsFor: number, goalsAgainst: number) {
  stats.played += 1;
  stats.goalsFor += goalsFor;
  stats.goalsAgainst += goalsAgainst;
  stats.goalDifference = stats.goalsFor - stats.goalsAgainst;

  if (goalsFor > goalsAgainst) {
    stats.won += 1;
    stats.points += 3;
    return;
  }

  if (goalsFor < goalsAgainst) {
    stats.lost += 1;
    return;
  }

  stats.drawn += 1;
  stats.points += 1;
}

const THIRD_PLACE_QUALIFIERS = 8;

function compareStandingStats(
  left: Pick<GroupStandingRow, "points" | "goalDifference" | "goalsFor" | "team">,
  right: Pick<GroupStandingRow, "points" | "goalDifference" | "goalsFor" | "team">
) {
  if (left.points !== right.points) {
    return right.points - left.points;
  }

  if (left.goalDifference !== right.goalDifference) {
    return right.goalDifference - left.goalDifference;
  }

  if (left.goalsFor !== right.goalsFor) {
    return right.goalsFor - left.goalsFor;
  }

  return left.team.localeCompare(right.team);
}

function comparePrimaryStats(left: TeamStats, right: TeamStats) {
  return compareStandingStats(left, right);
}

function computeStatsForTeams(teams: string[], matches: Array<GroupMatch & { finalHomeScore: number; finalAwayScore: number }>) {
  const stats = new Map<string, TeamStats>();

  for (const team of teams) {
    stats.set(team, emptyStats(team));
  }

  for (const match of matches) {
    const homeStats = stats.get(match.homeTeam);
    const awayStats = stats.get(match.awayTeam);

    if (!homeStats || !awayStats) {
      continue;
    }

    applyResult(homeStats, match.finalHomeScore, match.finalAwayScore);
    applyResult(awayStats, match.finalAwayScore, match.finalHomeScore);
  }

  return stats;
}

function sortGroupRows(teams: string[], matches: GroupMatch[]) {
  const finishedMatches = matches.filter(isFinishedMatch);
  const overallStats = computeStatsForTeams(teams, finishedMatches);
  const rows = teams.map((team) => overallStats.get(team) ?? emptyStats(team));

  rows.sort((left, right) => {
    const primary = comparePrimaryStats(left, right);

    if (primary !== 0) {
      return primary;
    }

    const tiedTeams = rows
      .filter(
        (row) =>
          row.points === left.points &&
          row.goalDifference === left.goalDifference &&
          row.goalsFor === left.goalsFor
      )
      .map((row) => row.team);

    if (tiedTeams.length <= 1) {
      return left.team.localeCompare(right.team);
    }

    const headToHeadMatches = finishedMatches.filter(
      (match) => tiedTeams.includes(match.homeTeam) && tiedTeams.includes(match.awayTeam)
    );
    const headToHeadStats = computeStatsForTeams(tiedTeams, headToHeadMatches);
    const leftHeadToHead = headToHeadStats.get(left.team) ?? emptyStats(left.team);
    const rightHeadToHead = headToHeadStats.get(right.team) ?? emptyStats(right.team);
    const headToHeadComparison = comparePrimaryStats(leftHeadToHead, rightHeadToHead);

    if (headToHeadComparison !== 0) {
      return headToHeadComparison;
    }

    return left.team.localeCompare(right.team);
  });

  return rows.map((row, index) => ({
    ...row,
    rank: index + 1
  }));
}

function buildTeamRosters() {
  return getCanonicalGroupRosters();
}

function isGroupTableComplete(table: GroupStandingTable, matches: GroupMatch[]) {
  const roster = new Set(table.rows.map((row) => row.team));
  const groupMatches = getGroupMatchesForRoster(matches, roster);

  return groupMatches.length > 0 && groupMatches.every(isFinishedMatch);
}

function isAllGroupsComplete(matches: GroupMatch[]) {
  const rosters = buildTeamRosters();

  return GROUP_KEYS.every((group) => {
    const roster = rosters.get(group) ?? new Set<string>();
    const groupMatches = getGroupMatchesForRoster(matches, roster);

    return groupMatches.length > 0 && groupMatches.every(isFinishedMatch);
  });
}

function getLuckyThirdPlaceTeams(tables: GroupStandingTable[]) {
  const thirdPlaceRows = tables
    .map((table) => table.rows.find((row) => row.rank === 3))
    .filter((row): row is GroupStandingRow => Boolean(row));

  return new Set(
    [...thirdPlaceRows]
      .sort((left, right) => compareStandingStats(left, right))
      .slice(0, THIRD_PLACE_QUALIFIERS)
      .map((row) => row.team)
  );
}

function getQualificationStatus(
  row: Omit<GroupStandingRow, "qualificationStatus">,
  groupComplete: boolean,
  allGroupsComplete: boolean,
  luckyThirdTeams: Set<string>
): GroupQualificationStatus {
  if (row.rank <= 2) {
    return groupComplete ? "through" : "through-live";
  }

  if (row.rank === 3) {
    if (allGroupsComplete) {
      return luckyThirdTeams.has(row.team) ? "lucky-third" : "eliminated";
    }

    return "third-hope";
  }

  return "eliminated";
}

function attachQualificationStatus(tables: GroupStandingTable[], matches: GroupMatch[]) {
  const allGroupsComplete = isAllGroupsComplete(matches);
  const luckyThirdTeams = allGroupsComplete ? getLuckyThirdPlaceTeams(tables) : new Set<string>();

  return tables.map((table) => {
    const groupComplete = isGroupTableComplete(table, matches);

    return {
      ...table,
      rows: table.rows.map((row) => ({
        ...row,
        qualificationStatus: getQualificationStatus(row, groupComplete, allGroupsComplete, luckyThirdTeams)
      }))
    };
  });
}

export function buildGroupStandingsFromMatches(matches: GroupMatch[]): GroupStandingTable[] {
  const rosters = buildTeamRosters();

  const tables = GROUP_KEYS.map((group) => {
    const roster = rosters.get(group) ?? new Set<string>();
    const teams = [...roster].sort((left, right) => left.localeCompare(right));
    const groupMatches = getGroupMatchesForRoster(matches, roster);
    const rows = sortGroupRows(teams, groupMatches).map((row) => ({
      ...row,
      qualificationStatus: "third-hope" as GroupQualificationStatus
    }));

    return {
      group,
      label: `Group ${group}`,
      rows
    };
  }).filter((table) => table.rows.length > 0);

  return attachQualificationStatus(tables, matches);
}

function getGroupMatchesForRoster(matches: GroupMatch[], roster: Set<string>) {
  return matches.filter((match) => roster.has(match.homeTeam) && roster.has(match.awayTeam));
}

export async function getGroupStandings(): Promise<GroupStandingTable[]> {
  const matches = await prisma.match.findMany({
    where: {
      stage: {
        startsWith: "Group "
      }
    },
    select: {
      stage: true,
      homeTeam: true,
      awayTeam: true,
      finalHomeScore: true,
      finalAwayScore: true
    },
    orderBy: {
      kickoff: "asc"
    }
  });

  return buildGroupStandingsFromMatches(matches);
}
