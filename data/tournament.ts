import { Match, MatchPrediction, PointRule, Team, TournamentPrediction, UserStanding } from "@/lib/types";

export const teams: Team[] = [
  { id: "arg", name: "Argentina", group: "A", fifaRank: 1 },
  { id: "bra", name: "Brazil", group: "B", fifaRank: 5 },
  { id: "fra", name: "France", group: "C", fifaRank: 2 },
  { id: "eng", name: "England", group: "D", fifaRank: 4 },
  { id: "esp", name: "Spain", group: "E", fifaRank: 8 },
  { id: "ger", name: "Germany", group: "F", fifaRank: 16 },
  { id: "por", name: "Portugal", group: "G", fifaRank: 6 },
  { id: "ned", name: "Netherlands", group: "H", fifaRank: 7 }
];

export const matches: Match[] = [
  {
    id: 1,
    stage: "Group",
    kickoff: "2026-06-12T19:00:00",
    venue: "MetLife Stadium",
    homeTeam: "Argentina",
    awayTeam: "Germany",
    locked: true,
    finalScore: { home: 2, away: 1 }
  },
  {
    id: 2,
    stage: "Group",
    kickoff: "2026-06-13T14:00:00",
    venue: "SoFi Stadium",
    homeTeam: "Brazil",
    awayTeam: "Spain",
    locked: false
  },
  {
    id: 3,
    stage: "Group",
    kickoff: "2026-06-13T19:00:00",
    venue: "AT&T Stadium",
    homeTeam: "France",
    awayTeam: "England",
    locked: false
  },
  {
    id: 4,
    stage: "Round of 16",
    kickoff: "2026-06-28T17:00:00",
    venue: "Mercedes-Benz Stadium",
    homeTeam: "Winner Group A",
    awayTeam: "Runner-up Group B",
    locked: false
  }
];

export const myPredictions: MatchPrediction[] = [
  {
    matchId: 1,
    homeScore: 2,
    awayScore: 1,
    winner: "Argentina",
    totalGoals: 3,
    bothTeamsToScore: true,
    firstGoalScorer: "Lautaro Martinez"
  },
  {
    matchId: 2,
    homeScore: 1,
    awayScore: 1,
    winner: "Draw",
    totalGoals: 2,
    bothTeamsToScore: true,
    firstGoalScorer: "Vinicius Junior"
  },
  {
    matchId: 3,
    homeScore: 2,
    awayScore: 0,
    winner: "France",
    totalGoals: 2,
    bothTeamsToScore: false,
    firstGoalScorer: "Kylian Mbappe"
  },
  {
    matchId: 4,
    homeScore: 3,
    awayScore: 1,
    winner: "Winner Group A",
    totalGoals: 4,
    bothTeamsToScore: true,
    firstGoalScorer: "To be decided"
  }
];

export const tournamentPrediction: TournamentPrediction = {
  champion: "Argentina",
  runnerUp: "France",
  goldenBoot: "Kylian Mbappe",
  bestYoungPlayer: "Lamine Yamal",
  groupWinners: {
    A: "Argentina",
    B: "Brazil",
    C: "France",
    D: "England",
    E: "Spain",
    F: "Germany",
    G: "Portugal",
    H: "Netherlands"
  }
};

export const leaderboard: UserStanding[] = [
  { name: "Solomon", totalPoints: 34, exactScores: 3, outcomes: 6, bonusHits: 7, trend: "up" },
  { name: "Nati", totalPoints: 31, exactScores: 2, outcomes: 7, bonusHits: 6, trend: "same" },
  { name: "Miki", totalPoints: 28, exactScores: 2, outcomes: 5, bonusHits: 7, trend: "up" },
  { name: "Rahel", totalPoints: 25, exactScores: 1, outcomes: 6, bonusHits: 5, trend: "down" }
];

export const pointRules: PointRule[] = [
  { label: "Exact score", points: 5, detail: "Nail the final scoreline exactly." },
  { label: "Correct outcome", points: 3, detail: "Pick the right winner or draw." },
  { label: "Goal difference", points: 2, detail: "Correct winning margin on the match." },
  { label: "Both teams to score", points: 1, detail: "Predict whether both sides score." },
  { label: "First goal scorer", points: 2, detail: "Pick the player who opens scoring." },
  { label: "Champion", points: 10, detail: "Call the tournament winner before kickoff." },
  { label: "Golden Boot", points: 6, detail: "Pick the top scorer for the tournament." }
];
