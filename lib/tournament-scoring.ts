export const TOURNAMENT_AWARD_POINTS = 100;

export type TournamentAwards = {
  champion?: string | null;
  runnerUp?: string | null;
  goldenBoot?: string | null;
  bestYoungPlayer?: string | null;
  goldenGlove?: string | null;
  bestPlayer?: string | null;
};

export type TournamentPredictionInput = {
  champion: string | null;
  runnerUp: string | null;
  goldenBoot: string | null;
  bestYoungPlayer: string | null;
  goldenGlove?: string | null;
  bestPlayer?: string | null;
};

export type TournamentScoreBreakdownItem = {
  label: string;
  points: number;
  maxPoints: number;
  hit: boolean;
  pickLabel: string;
  resultLabel: string;
};

function normalizeAward(value: string | null | undefined) {
  return value?.trim().toLowerCase() || "";
}

function awardsMatch(pick: string | null | undefined, official: string | null | undefined) {
  const normalizedPick = normalizeAward(pick);
  const normalizedOfficial = normalizeAward(official);

  return normalizedPick.length > 0 && normalizedPick === normalizedOfficial;
}

export function parseOfficialAwards(value: string | null | undefined): TournamentAwards {
  if (!value) {
    return {};
  }

  try {
    return JSON.parse(value) as TournamentAwards;
  } catch {
    return {};
  }
}

export function hasConfiguredOfficialAwards(awards: TournamentAwards) {
  return Object.values(awards).some((value) => typeof value === "string" && value.trim().length > 0);
}

export function scoreTournamentPrediction(
  prediction: TournamentPredictionInput,
  officialAwards: TournamentAwards
) {
  const categories: Array<{
    label: string;
    pick: string | null | undefined;
    official: string | null | undefined;
  }> = [
    { label: "Champion", pick: prediction.champion, official: officialAwards.champion },
    { label: "Runner-up", pick: prediction.runnerUp, official: officialAwards.runnerUp },
    { label: "Golden Boot", pick: prediction.goldenBoot, official: officialAwards.goldenBoot },
    { label: "Best Young Player", pick: prediction.bestYoungPlayer, official: officialAwards.bestYoungPlayer },
    { label: "Golden Glove", pick: prediction.goldenGlove, official: officialAwards.goldenGlove },
    { label: "Best Player", pick: prediction.bestPlayer, official: officialAwards.bestPlayer }
  ];

  const items: TournamentScoreBreakdownItem[] = categories.map(({ label, pick, official }) => {
    const hit = awardsMatch(pick, official);

    return {
      label,
      points: hit ? TOURNAMENT_AWARD_POINTS : 0,
      maxPoints: TOURNAMENT_AWARD_POINTS,
      hit,
      pickLabel: pick?.trim() || "Not picked",
      resultLabel: official?.trim() || "Not announced"
    };
  });

  const points = items.reduce((sum, item) => sum + item.points, 0);
  const hits = items.filter((item) => item.hit).length;

  return { points, hits, items };
}
