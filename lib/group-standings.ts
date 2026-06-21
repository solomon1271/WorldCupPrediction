import { prisma } from "@/lib/prisma";

const GROUP_STAGE_PATTERN = /^Group ([A-L])$/i;
const GROUP_KEYS = "ABCDEFGHIJKL".split("");

export type GroupStandingRow = {
  rank: number;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
};

export type GroupStandingTable = {
  group: string;
  label: string;
  rows: GroupStandingRow[];
};

type GroupMatch = {
  stage: string;
  homeTeam: string;
  awayTeam: string;
  finalHomeScore: number | null;
  finalAwayScore: number | null;
};

type TeamStats = Omit<GroupStandingRow, "rank">;

function parseGroupKey(stage: string) {
  const match = stage.match(GROUP_STAGE_PATTERN);
  return match ? match[1].toUpperCase() : null;
}

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

function comparePrimaryStats(left: TeamStats, right: TeamStats) {
  if (left.points !== right.points) {
    return right.points - left.points;
  }

  if (left.goalDifference !== right.goalDifference) {
    return right.goalDifference - left.goalDifference;
  }

  if (left.goalsFor !== right.goalsFor) {
    return right.goalsFor - left.goalsFor;
  }

  return 0;
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

function buildTeamRosters(matches: GroupMatch[]) {
  const rosters = new Map<string, Set<string>>();

  for (const group of GROUP_KEYS) {
    rosters.set(group, new Set());
  }

  for (const match of matches) {
    const group = parseGroupKey(match.stage);

    if (!group) {
      continue;
    }

    const roster = rosters.get(group);

    if (!roster) {
      continue;
    }

    roster.add(match.homeTeam);
    roster.add(match.awayTeam);
  }

  return rosters;
}

export function buildGroupStandingsFromMatches(matches: GroupMatch[]): GroupStandingTable[] {
  const groupMatches = new Map<string, GroupMatch[]>();

  for (const group of GROUP_KEYS) {
    groupMatches.set(group, []);
  }

  for (const match of matches) {
    const group = parseGroupKey(match.stage);

    if (!group) {
      continue;
    }

    groupMatches.get(group)?.push(match);
  }

  const rosters = buildTeamRosters(matches);

  return GROUP_KEYS.map((group) => {
    const teams = [...(rosters.get(group) ?? [])].sort((left, right) => left.localeCompare(right));
    const rows = sortGroupRows(teams, groupMatches.get(group) ?? []);

    return {
      group,
      label: `Group ${group}`,
      rows
    };
  }).filter((table) => table.rows.length > 0);
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
