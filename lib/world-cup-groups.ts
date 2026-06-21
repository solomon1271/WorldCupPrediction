import { seedMatches } from "@/lib/seed-data";

const GROUP_STAGE_PATTERN = /^Group ([A-L])$/i;
const GROUP_KEYS = "ABCDEFGHIJKL".split("");

function parseGroupKey(stage: string) {
  const match = stage.match(GROUP_STAGE_PATTERN);
  return match ? match[1].toUpperCase() : null;
}

function buildCanonicalGroupData() {
  const rosters = new Map<string, Set<string>>();
  const teamToGroup = new Map<string, string>();

  for (const group of GROUP_KEYS) {
    rosters.set(group, new Set());
  }

  for (const match of seedMatches) {
    const group = parseGroupKey(match.stage);

    if (!group) {
      continue;
    }

    for (const team of [match.homeTeam, match.awayTeam]) {
      if (teamToGroup.has(team)) {
        continue;
      }

      teamToGroup.set(team, group);
      rosters.get(group)?.add(team);
    }
  }

  return { rosters, teamToGroup };
}

const canonicalGroupData = buildCanonicalGroupData();

export function getCanonicalGroupRosters() {
  return canonicalGroupData.rosters;
}

export function getCanonicalTeamGroup(team: string) {
  return canonicalGroupData.teamToGroup.get(team);
}

export function getCanonicalGroupTeams(group: string) {
  return [...(canonicalGroupData.rosters.get(group.toUpperCase()) ?? [])].sort((left, right) =>
    left.localeCompare(right)
  );
}
