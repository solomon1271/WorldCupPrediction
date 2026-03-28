export type Team = {
  id: string;
  name: string;
  group: string;
  fifaRank: number;
};

export type Match = {
  id: number;
  stage: "Group" | "Round of 16" | "Quarterfinal" | "Semifinal" | "Final";
  kickoff: string;
  venue: string;
  homeTeam: string;
  awayTeam: string;
  locked: boolean;
  finalScore?: {
    home: number;
    away: number;
  };
};

export type MatchPrediction = {
  matchId: number;
  homeScore: number;
  awayScore: number;
  winner: string;
  totalGoals: number;
  bothTeamsToScore: boolean;
  firstGoalScorer: string;
};

export type TournamentPrediction = {
  champion: string;
  runnerUp: string;
  goldenBoot: string;
  bestYoungPlayer: string;
  groupWinners: Record<string, string>;
};

export type UserStanding = {
  name: string;
  totalPoints: number;
  exactScores: number;
  outcomes: number;
  bonusHits: number;
  trend: "up" | "same" | "down";
};

export type PointRule = {
  label: string;
  points: number;
  detail: string;
};
