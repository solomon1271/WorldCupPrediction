const PLACEHOLDER_TEAM_PATTERN = /winner|runner up|loser|3rd group|match \d+/i;

export type PlaceholderTeamMeta = {
  raw: string;
  kind: "winner" | "runner-up" | "third-place" | "match-winner" | "match-loser" | "unknown";
  groups: string[];
  headline: string;
  sublabel: string;
  accent: string;
};

const GROUP_ACCENTS: Record<string, string> = {
  A: "#2eb872",
  B: "#e63946",
  C: "#f4a261",
  D: "#3c3b6e",
  E: "#ffcc00",
  F: "#ff6600",
  G: "#8ecae6",
  H: "#aa151b",
  I: "#0055a4",
  J: "#74acdf",
  K: "#fcd116",
  L: "#cf081f"
};

const DEFAULT_TBD_ACCENT = "#c9a227";

export function isPlaceholderTeam(team: string) {
  return team.trim().length > 0 && PLACEHOLDER_TEAM_PATTERN.test(team);
}

export function getGroupAccent(group: string) {
  return GROUP_ACCENTS[group.toUpperCase()] ?? DEFAULT_TBD_ACCENT;
}

function accentForGroups(groups: string[]) {
  if (groups.length === 0) {
    return DEFAULT_TBD_ACCENT;
  }

  return getGroupAccent(groups[0]);
}

function parseThirdPlaceGroups(value: string) {
  return value
    .toUpperCase()
    .split("/")
    .map((part) => part.replace(/[^A-L]/g, ""))
    .filter(Boolean);
}

export function parsePlaceholderTeam(team: string): PlaceholderTeamMeta | null {
  const raw = team.trim();

  if (!isPlaceholderTeam(raw)) {
    return null;
  }

  const winnerGroup = raw.match(/^Winner\s+Group\s+([A-L])$/i);
  if (winnerGroup) {
    const group = winnerGroup[1].toUpperCase();
    return {
      raw,
      kind: "winner",
      groups: [group],
      headline: `Group ${group} winner`,
      sublabel: "Awaiting confirmation",
      accent: getGroupAccent(group)
    };
  }

  const runnerUpGroup = raw.match(/^Runner\s+up\s+Group\s+([A-L])$/i);
  if (runnerUpGroup) {
    const group = runnerUpGroup[1].toUpperCase();
    return {
      raw,
      kind: "runner-up",
      groups: [group],
      headline: `Group ${group} runner-up`,
      sublabel: "Awaiting confirmation",
      accent: getGroupAccent(group)
    };
  }

  const thirdPlace = raw.match(/^3rd\s+Group\s+([A-Z/]+)$/i);
  if (thirdPlace) {
    const groups = parseThirdPlaceGroups(thirdPlace[1]);
    return {
      raw,
      kind: "third-place",
      groups,
      headline: "Best 3rd-place team",
      sublabel: groups.length > 0 ? `From groups ${groups.join(" · ")}` : "Awaiting confirmation",
      accent: accentForGroups(groups)
    };
  }

  const matchWinner = raw.match(/^Winner\s+Match\s+(\d+)$/i);
  if (matchWinner) {
    return {
      raw,
      kind: "match-winner",
      groups: [],
      headline: `Match ${matchWinner[1]} winner`,
      sublabel: "Knockout path TBD",
      accent: DEFAULT_TBD_ACCENT
    };
  }

  const matchLoser = raw.match(/^Loser\s+Match\s+(\d+)$/i);
  if (matchLoser) {
    return {
      raw,
      kind: "match-loser",
      groups: [],
      headline: `Match ${matchLoser[1]} loser`,
      sublabel: "Knockout path TBD",
      accent: DEFAULT_TBD_ACCENT
    };
  }

  return {
    raw,
    kind: "unknown",
    groups: [],
    headline: "Team TBD",
    sublabel: "Awaiting confirmation",
    accent: DEFAULT_TBD_ACCENT
  };
}
