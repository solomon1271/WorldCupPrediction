export type ScorableMatchInput = {
  homeTeam: string;
  awayTeam: string;
  finalHomeScore: number | null;
  finalAwayScore: number | null;
  finalYellowCards?: number | null;
  finalTotalCorners?: number | null;
  finalRedCards?: number | null;
};

export type PredictionInput = {
  winner: string;
  homeScore: number | null;
  awayScore: number | null;
  totalGoalsLine: string;
  totalCornersLine: string;
  yellowCardsLine: string;
  redCardsLine: string;
};

export type PredictionScoreBreakdownItem = {
  label: string;
  points: number;
  maxPoints: number;
  hit: boolean;
  pickLabel: string;
  resultLabel: string;
};

export type PredictionScoreBreakdown = {
  items: PredictionScoreBreakdownItem[];
  totalPoints: number;
};

export const WINNER_POINTS = 5;
export const EXACT_SCORE_POINTS = 10;

export const statThresholdOptions = [
  "0",
  ">0.5",
  ">1.5",
  ">2.5",
  ">3.5",
  ">4.5",
  ">5.5",
  ">6.5",
  ">7.5",
  ">8.5",
  ">9.5"
] as const;

/** @deprecated Use statThresholdOptions instead. */
export const totalGoalsThresholdOptions = statThresholdOptions;

const getMatchOutcome = (homeScore: number, awayScore: number) => {
  if (homeScore > awayScore) {
    return "home";
  }

  if (awayScore > homeScore) {
    return "away";
  }

  return "draw";
};

export function normalizeThresholdLine(value: string | null | undefined) {
  return value && value.trim().length > 0 ? value : "0";
}

export function normalizeRedCardsLine(value: string | null | undefined) {
  return value === "Yes" ? "Yes" : "No";
}

export function matchesThreshold(line: string | null | undefined, actual: number) {
  const normalizedLine = normalizeThresholdLine(line);

  if (normalizedLine === "0") {
    return actual === 0;
  }

  return actual > Number(normalizedLine.replace(">", ""));
}

export function getThresholdWeight(line: string | null | undefined) {
  const normalizedLine = normalizeThresholdLine(line);

  if (normalizedLine === "0") {
    return 1;
  }

  return Number(normalizedLine.replace(">", "")) + 0.5;
}

export function scoreWeightedThreshold(line: string | null | undefined, actual: number) {
  const normalizedLine = normalizeThresholdLine(line);

  if (normalizedLine === "0") {
    return actual === 0 ? 1 : 0;
  }

  if (!matchesThreshold(normalizedLine, actual)) {
    return 0;
  }

  return getThresholdWeight(normalizedLine);
}

export function deriveWinnerFromScores(
  homeScore: number,
  awayScore: number,
  homeTeam: string,
  awayTeam: string
) {
  if (homeScore > awayScore) {
    return homeTeam;
  }

  if (awayScore > homeScore) {
    return awayTeam;
  }

  return "Draw";
}

export function deriveStatThresholdLine(actual: number) {
  if (actual === 0) {
    return "0";
  }

  for (let index = statThresholdOptions.length - 1; index >= 0; index -= 1) {
    const option = statThresholdOptions[index];

    if (option === "0") {
      continue;
    }

    if (actual > Number(option.replace(">", ""))) {
      return option;
    }
  }

  return ">0.5";
}

/** @deprecated Use deriveStatThresholdLine instead. */
export const deriveTotalGoalsLine = deriveStatThresholdLine;

export function hasOfficialResult(match: ScorableMatchInput) {
  return match.finalHomeScore !== null && match.finalAwayScore !== null;
}

export function scorePrediction(prediction: PredictionInput, match: ScorableMatchInput) {
  if (match.finalHomeScore === null || match.finalAwayScore === null) {
    return { points: 0, exact: 0, outcome: 0, bonus: 0 };
  }

  let points = 0;
  let exact = 0;
  let outcome = 0;
  let bonus = 0;
  const pickedOutcome =
    prediction.winner === "Draw" ? "draw" : prediction.winner === match.homeTeam ? "home" : "away";
  const finalOutcome = getMatchOutcome(match.finalHomeScore, match.finalAwayScore);

  if (pickedOutcome === finalOutcome) {
    points += WINNER_POINTS;
    outcome += 1;
  }

  if (
    prediction.homeScore !== null &&
    prediction.awayScore !== null &&
    prediction.homeScore === match.finalHomeScore &&
    prediction.awayScore === match.finalAwayScore
  ) {
    points += EXACT_SCORE_POINTS;
    exact += 1;
  }

  const finalGoalsTotal = match.finalHomeScore + match.finalAwayScore;
  const totalGoalsPoints = scoreWeightedThreshold(prediction.totalGoalsLine, finalGoalsTotal);
  if (totalGoalsPoints > 0) {
    points += totalGoalsPoints;
    bonus += 1;
  }

  if (match.finalTotalCorners != null) {
    const cornersPoints = scoreWeightedThreshold(prediction.totalCornersLine, match.finalTotalCorners);
    if (cornersPoints > 0) {
      points += cornersPoints;
      bonus += 1;
    }
  }

  if (match.finalYellowCards != null) {
    const yellowPoints = scoreWeightedThreshold(prediction.yellowCardsLine, match.finalYellowCards);
    if (yellowPoints > 0) {
      points += yellowPoints;
      bonus += 1;
    }
  }

  if (match.finalRedCards != null && prediction.redCardsLine === "Yes" && match.finalRedCards > 0) {
    points += 1;
    bonus += 1;
  }

  return { points, exact, outcome, bonus };
}

function formatScorePick(prediction: PredictionInput) {
  if (prediction.homeScore !== null && prediction.awayScore !== null) {
    return `${prediction.homeScore} - ${prediction.awayScore}`;
  }

  return "Not set";
}

function formatThresholdActual(value: number | null | undefined, unavailable = "Not recorded") {
  if (value === null || value === undefined) {
    return unavailable;
  }

  return String(value);
}

function buildWeightedThresholdBreakdownItem(
  label: string,
  line: string,
  actual: number | null | undefined
): PredictionScoreBreakdownItem {
  const pickLabel = normalizeThresholdLine(line);
  const maxPoints = getThresholdWeight(pickLabel);

  if (actual === null || actual === undefined) {
    return {
      label,
      points: 0,
      maxPoints,
      hit: false,
      pickLabel,
      resultLabel: "Not recorded"
    };
  }

  const points = scoreWeightedThreshold(pickLabel, actual);

  return {
    label,
    points,
    maxPoints,
    hit: points > 0,
    pickLabel,
    resultLabel: String(actual)
  };
}

export function getPredictionScoreBreakdown(
  prediction: PredictionInput,
  match: ScorableMatchInput
): PredictionScoreBreakdown | null {
  if (match.finalHomeScore === null || match.finalAwayScore === null) {
    return null;
  }

  const finalGoalsTotal = match.finalHomeScore + match.finalAwayScore;
  const pickedOutcome =
    prediction.winner === "Draw" ? "draw" : prediction.winner === match.homeTeam ? "home" : "away";
  const finalOutcome = getMatchOutcome(match.finalHomeScore, match.finalAwayScore);
  const winnerHit = pickedOutcome === finalOutcome;
  const exactHit =
    prediction.homeScore !== null &&
    prediction.awayScore !== null &&
    prediction.homeScore === match.finalHomeScore &&
    prediction.awayScore === match.finalAwayScore;
  const redHit = match.finalRedCards != null && prediction.redCardsLine === "Yes" && match.finalRedCards > 0;

  const finalWinnerLabel =
    finalOutcome === "draw" ? "Draw" : finalOutcome === "home" ? match.homeTeam : match.awayTeam;

  const items: PredictionScoreBreakdownItem[] = [
    {
      label: "Your score",
      points: exactHit ? EXACT_SCORE_POINTS : 0,
      maxPoints: EXACT_SCORE_POINTS,
      hit: exactHit,
      pickLabel: formatScorePick(prediction),
      resultLabel: `${match.finalHomeScore} - ${match.finalAwayScore}`
    },
    {
      label: "Winner",
      points: winnerHit ? WINNER_POINTS : 0,
      maxPoints: WINNER_POINTS,
      hit: winnerHit,
      pickLabel: prediction.winner,
      resultLabel: finalWinnerLabel
    },
    buildWeightedThresholdBreakdownItem("Total goals", prediction.totalGoalsLine, finalGoalsTotal),
    buildWeightedThresholdBreakdownItem("Total corners", prediction.totalCornersLine, match.finalTotalCorners),
    buildWeightedThresholdBreakdownItem("Yellow cards", prediction.yellowCardsLine, match.finalYellowCards),
    {
      label: "Red cards",
      points: redHit ? 1 : 0,
      maxPoints: 1,
      hit: redHit,
      pickLabel: normalizeRedCardsLine(prediction.redCardsLine),
      resultLabel:
        match.finalRedCards === null || match.finalRedCards === undefined
          ? "Not recorded"
          : match.finalRedCards > 0
            ? "Yes"
            : "No"
    }
  ];

  return {
    items,
    totalPoints: items.reduce((sum, item) => sum + item.points, 0)
  };
}
