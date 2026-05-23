import { PointRule } from "@/lib/types";
import { EXACT_SCORE_POINTS, WINNER_POINTS } from "@/lib/match-scoring";

export const pointRules: PointRule[] = [
  { label: "Winner", points: WINNER_POINTS, detail: "Pick the correct winner or draw." },
  { label: "Exact score", points: EXACT_SCORE_POINTS, detail: "Optional bonus if you enter the exact final scoreline correctly." },
  { label: "Total goals line", points: 10, detail: "Weighted over/under line starting at >0.5. If the result is 5 goals, >0.5 earns 1 pt, >1.5 earns 2 pts, up to >4.5 for 5 pts. Pick 0 for a shutout." },
  { label: "Total corners line", points: 10, detail: "Same weighted line scoring as total goals, using the official total corners in the match." },
  { label: "Yellow cards line", points: 10, detail: "Same weighted line scoring as total goals, using the official yellow-card count in the match." },
  { label: "Red cards", points: 1, detail: "You get the point only if you pick Yes and at least one red card happens." },
  { label: "Champion", points: 10, detail: "Call the tournament winner before kickoff." },
  { label: "Golden Boot", points: 6, detail: "Pick the top scorer for the tournament." }
];
