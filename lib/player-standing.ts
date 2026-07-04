import {
  getPredictionScoreBreakdown,
  normalizeRedCardsLine,
  normalizeThresholdLine,
  scorePrediction,
  type PredictionInput
} from "@/lib/match-scoring";
import { isActiveKnockoutMatchId, isGroupStageMatchId, isRoundOf32MatchId } from "@/lib/knockout-stage";
import {
  countSavedTournamentTopPicks,
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

export type PlayerStandingScope = "knockout" | "round-of-32" | "group-stage";

export type PlayerStandingDetail = {
  playerId: string;
  playerName: string;
  totalPoints: number;
  matchPoints: number;
  tournamentPoints: number;
  exactScores: number;
  outcomes: number;
  bonusHits: number;
  scope: PlayerStandingScope;
  topPicksRedacted: boolean;
  matches: PlayerMatchStanding[];
  tournament: {
    champion: string | null;
    runnerUp: string | null;
    goldenBoot: string | null;
    bestYoungPlayer: string | null;
    goldenGlove: string | null;
    bestPlayer: string | null;
    savedPickCount: number;
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

export function buildPlayerStandingDetail(
  input: BuildPlayerStandingInput,
  options?: { scope?: PlayerStandingScope; redactTopPicks?: boolean }
): PlayerStandingDetail {
  const scope = options?.scope ?? "knockout";
  const redactTopPicks = options?.redactTopPicks ?? false;
  const matchPredictions = input.matchPredictions.filter((prediction) => {
    if (scope === "knockout") {
      return isActiveKnockoutMatchId(prediction.matchId);
    }

    if (scope === "round-of-32") {
      return isRoundOf32MatchId(prediction.matchId);
    }

    return isGroupStageMatchId(prediction.matchId);
  });

  let matchPoints = 0;
  let exactScores = 0;
  let outcomes = 0;
  let bonusHits = 0;

  const matches = matchPredictions
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
    .filter((match) => match.isFinished)
    .sort((left, right) => new Date(right.kickoff).getTime() - new Date(left.kickoff).getTime());

  const tournamentPrediction = input.tournamentPrediction || {
    champion: null,
    runnerUp: null,
    goldenBoot: null,
    bestYoungPlayer: null,
    goldenGlove: null,
    bestPlayer: null
  };
  const tournamentSavedPickCount = countSavedTournamentTopPicks(tournamentPrediction);
  const tournamentScore =
    scope === "group-stage"
      ? scoreTournamentPrediction(tournamentPrediction, input.officialAwards)
      : { points: 0, hits: 0, items: [] as ReturnType<typeof scoreTournamentPrediction>["items"] };

  return {
    playerId: input.playerId,
    playerName: input.playerName,
    totalPoints: matchPoints + tournamentScore.points,
    matchPoints,
    tournamentPoints: tournamentScore.points,
    exactScores,
    outcomes,
    bonusHits: bonusHits + tournamentScore.hits,
    scope,
    topPicksRedacted: redactTopPicks,
    matches,
    tournament: redactTopPicks
      ? {
          champion: null,
          runnerUp: null,
          goldenBoot: null,
          bestYoungPlayer: null,
          goldenGlove: null,
          bestPlayer: null,
          savedPickCount: tournamentSavedPickCount,
          breakdown: [],
          points: tournamentScore.points
        }
      : {
          ...tournamentPrediction,
          savedPickCount: tournamentSavedPickCount,
          breakdown: tournamentScore.items,
          points: tournamentScore.points
        }
  };
}

export { parseOfficialAwards };
