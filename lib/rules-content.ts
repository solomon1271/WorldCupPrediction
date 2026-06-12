import { EXACT_SCORE_POINTS, RED_CARDS_POINTS, WINNER_POINTS } from "@/lib/match-scoring";
import { TOURNAMENT_AWARD_POINTS } from "@/lib/tournament-scoring";

export type PointRule = {
  label: string;
  points: number | string;
  detail: string;
};

export const matchPointRules: PointRule[] = [
  {
    label: "Winner",
    points: WINNER_POINTS,
    detail: "Pick the correct winning team, or call a draw correctly."
  },
  {
    label: "Exact score",
    points: EXACT_SCORE_POINTS,
    detail:
      "Optional bonus. Enter both home and away goals correctly. You can leave the score blank and still earn winner points."
  },
  {
    label: "Total goals line",
    points: "Up to 10",
    detail: "Pick an over/under style line for combined goals in the match."
  },
  {
    label: "Total corners line",
    points: "Up to 10",
    detail: "Same line scoring as total goals, using the official total corners in the match."
  },
  {
    label: "Yellow cards line",
    points: "Up to 10",
    detail: "Same line scoring as total goals, using the official yellow-card count in the match."
  },
  {
    label: "Red cards",
    points: RED_CARDS_POINTS,
    detail: "Pick Yes for 3 points when at least one red card is shown, or No for 3 points when the match finishes with zero red cards."
  }
];

export const tournamentPointRules: PointRule[] = [
  {
    label: "Champion",
    points: TOURNAMENT_AWARD_POINTS,
    detail: "Pick the team that wins the tournament."
  },
  {
    label: "Runner-up",
    points: TOURNAMENT_AWARD_POINTS,
    detail: "Pick the team that finishes second."
  },
  {
    label: "Golden Boot",
    points: TOURNAMENT_AWARD_POINTS,
    detail: "Pick the tournament's top scorer."
  },
  {
    label: "Best Young Player",
    points: TOURNAMENT_AWARD_POINTS,
    detail: "Pick the best young player of the tournament."
  },
  {
    label: "Golden Glove",
    points: TOURNAMENT_AWARD_POINTS,
    detail: "Pick the best goalkeeper of the tournament."
  },
  {
    label: "Best Player",
    points: TOURNAMENT_AWARD_POINTS,
    detail: "Pick the best player of the tournament."
  }
];

/** @deprecated Use matchPointRules and tournamentPointRules instead. */
export const pointRules = [...matchPointRules, ...tournamentPointRules];

export const thresholdExamples = [
  { actual: 0, pick: "0", points: 1, note: "Exactly zero goals, corners, or yellow cards — earns 1 point." },
  { actual: 3, pick: ">0.5", points: 1, note: "Any total of 1 or more clears >0.5." },
  { actual: 3, pick: ">1.5", points: 2, note: "A total of 3 clears >1.5 and earns 2 points." },
  { actual: 5, pick: ">4.5", points: 5, note: "Higher lines earn more when you are right." }
];
