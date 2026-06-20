import { seedMatches } from "@/lib/seed-data";

const PLACEHOLDER_TEAM_PATTERN =
  /winner|runner up|loser|3rd group|match \d+/i;

function isNationalTeam(name: string) {
  return name.trim().length > 0 && !PLACEHOLDER_TEAM_PATTERN.test(name);
}

export function getWorldCupTeams() {
  const teams = new Set<string>();

  for (const match of seedMatches) {
    if (isNationalTeam(match.homeTeam)) {
      teams.add(match.homeTeam);
    }

    if (isNationalTeam(match.awayTeam)) {
      teams.add(match.awayTeam);
    }
  }

  return [...teams].sort((left, right) => left.localeCompare(right));
}
