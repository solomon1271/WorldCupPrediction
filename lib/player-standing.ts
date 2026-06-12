import {
  getPredictionScoreBreakdown,
  normalizeRedCardsLine,
  normalizeThresholdLine,
  scorePrediction,
  type PredictionInput
} from "@/lib/match-scoring";
import {
  parseOfficialAwards,
  scoreTournamentPrediction,
  type TournamentAwards
} from "@/lib/tournament-scoring";

export type PlayerMatchStanding = {
  matchId: number;
  stage: string;
  kickoff: string;
  homeTeam: string;
  awayTeam: string;
  isFinished: boolean;
  hasPrediction: boolean;
  points: number;
  breakdown: ReturnType<typeof getPredictionScoreBreakdown>;
  prediction: {
    winner: string;
    homeScore: number | null;
    awayScore: number | null;
    totalGoalsLine: string;
    totalCornersLine: string;
    yellowCardsLine: string;
    redCardsLine: string;
  } | null;
};

export type PlayerStandingDetail = {
  playerId: string;
  playerName: string;
  totalPoints: number;
  matchPoints: number;
  tournamentPoints: number;
  exactScores: number;
  outcomes: number;
  bonusHits: number;
  matches: PlayerMatchStanding[];
  tournament: {
    champion: string | null;
    runnerUp: string | null;
    goldenBoot: string | null;
    bestYoungPlayer: string | null;
    goldenGlove: string | null;
    bestPlayer: string | null;
    breakdown: ReturnType<typeof scoreTournamentPrediction>["items"];
    points: number;
  };
};

type BuildPlayerStandingInput = {
  playerId: string;
  playerName: string;
  matchPredictions: Array<{
    matchId: number;
    winner: string;
    homeScore: number | null;
    awayScore: number | null;
    totalGoalsLine: string;
    totalCornersLine: string;
    yellowCardsLine: string;
    redCardsLine: string;
    match: {
      id: number;
      stage: string;
      kickoff: Date;
      homeTeam: string;
      awayTeam: string;
      finalHomeScore: number | null;
      finalAwayScore: number | null;
      finalYellowCards: number | null;
      finalTotalCorners: number | null;
      finalRedCards: number | null;
    };
  }>;
  tournamentPrediction: {
    champion: string | null;
    runnerUp: string | null;
    goldenBoot: string | null;
    bestYoungPlayer: string | null;
    goldenGlove: string | null;
    bestPlayer: string | null;
  } | null;
  officialAwards: TournamentAwards;
};

function toPredictionInput(prediction: BuildPlayerStandingInput["matchPredictions"][number]): PredictionInput {
  return {
    winner: prediction.winner,
    homeScore: prediction.homeScore,
    awayScore: prediction.awayScore,
    totalGoalsLine: normalizeThresholdLine(prediction.totalGoalsLine),
    totalCornersLine: normalizeThresholdLine(prediction.totalCornersLine),
    yellowCardsLine: normalizeThresholdLine(prediction.yellowCardsLine),
    redCardsLine: normalizeRedCardsLine(prediction.redCardsLine)
  };
}

export function buildPlayerStandingDetail(input: BuildPlayerStandingInput): PlayerStandingDetail {
  let matchPoints = 0;
  let exactScores = 0;
  let outcomes = 0;
  let bonusHits = 0;

  const matches = input.matchPredictions
    .map((prediction) => {
      const score = scorePrediction(toPredictionInput(prediction), prediction.match);
      const breakdown = getPredictionScoreBreakdown(toPredictionInput(prediction), prediction.match);
      const isFinished = prediction.match.finalHomeScore !== null && prediction.match.finalAwayScore !== null;

      matchPoints += score.points;
      exactScores += score.exact;
      outcomes += score.outcome;
      bonusHits += score.bonus;

      return {
        matchId: prediction.match.id,
        stage: prediction.match.stage,
        kickoff: prediction.match.kickoff.toISOString(),
        homeTeam: prediction.match.homeTeam,
        awayTeam: prediction.match.awayTeam,
        isFinished,
        hasPrediction: true,
        points: score.points,
        breakdown,
        prediction: {
          winner: prediction.winner,
          homeScore: prediction.homeScore,
          awayScore: prediction.awayScore,
          totalGoalsLine: normalizeThresholdLine(prediction.totalGoalsLine),
          totalCornersLine: normalizeThresholdLine(prediction.totalCornersLine),
          yellowCardsLine: normalizeThresholdLine(prediction.yellowCardsLine),
          redCardsLine: normalizeRedCardsLine(prediction.redCardsLine)
        }
      };
    })
    .sort((left, right) => new Date(left.kickoff).getTime() - new Date(right.kickoff).getTime());

  const tournamentPrediction = input.tournamentPrediction || {
    champion: null,
    runnerUp: null,
    goldenBoot: null,
    bestYoungPlayer: null,
    goldenGlove: null,
    bestPlayer: null
  };
  const tournamentScore = scoreTournamentPrediction(tournamentPrediction, input.officialAwards);

  return {
    playerId: input.playerId,
    playerName: input.playerName,
    totalPoints: matchPoints + tournamentScore.points,
    matchPoints,
    tournamentPoints: tournamentScore.points,
    exactScores,
    outcomes,
    bonusHits: bonusHits + tournamentScore.hits,
    matches,
    tournament: {
      ...tournamentPrediction,
      breakdown: tournamentScore.items,
      points: tournamentScore.points
    }
  };
}

export { parseOfficialAwards };
