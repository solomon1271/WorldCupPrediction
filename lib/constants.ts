import { PointRule } from "@/lib/types";

export const pointRules: PointRule[] = [
  { label: "Winner", points: 3, detail: "Pick the correct winner or draw." },
  { label: "Exact score", points: 5, detail: "Optional bonus if you enter the exact final scoreline correctly." },
  { label: "Total goals line", points: 1, detail: "Pick the correct total-goals threshold such as 0, >1.5, or >2.5." },
  { label: "Total corners line", points: 1, detail: "Pick the correct total-corners threshold such as 0, >1.5, or >2.5." },
  { label: "Yellow cards line", points: 1, detail: "Pick the correct yellow-cards threshold such as 0, >1.5, or >3.5." },
  { label: "Red cards", points: 1, detail: "You get the point only if you pick Yes and at least one red card happens." },
  { label: "Champion", points: 10, detail: "Call the tournament winner before kickoff." },
  { label: "Golden Boot", points: 6, detail: "Pick the top scorer for the tournament." }
];
