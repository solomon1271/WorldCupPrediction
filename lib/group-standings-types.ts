export type GroupQualificationStatus =
  | "through"
  | "through-live"
  | "lucky-third"
  | "third-hope"
  | "eliminated";

export type GroupStandingRow = {
  rank: number;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  qualificationStatus: GroupQualificationStatus;
};

export type GroupStandingTable = {
  group: string;
  label: string;
  rows: GroupStandingRow[];
};
