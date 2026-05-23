import { DashboardMatch, DashboardMatchPrediction } from "@/lib/dashboard";
import { getPredictionScoreBreakdown, PredictionInput } from "@/lib/match-scoring";

type MatchScoreBreakdownProps = {
  match: DashboardMatch;
  prediction?: DashboardMatchPrediction;
};

function toScorableMatch(match: DashboardMatch) {
  return {
    homeTeam: match.homeTeam,
    awayTeam: match.awayTeam,
    finalHomeScore: match.finalScore?.home ?? null,
    finalAwayScore: match.finalScore?.away ?? null,
    finalYellowCards: match.finalStats?.yellowCards ?? null,
    finalTotalCorners: match.finalStats?.totalCorners ?? null,
    finalRedCards: match.finalStats?.redCards ?? null
  };
}

function toPredictionInput(prediction: DashboardMatchPrediction): PredictionInput {
  return {
    winner: prediction.winner,
    homeScore: prediction.homeScore,
    awayScore: prediction.awayScore,
    totalGoalsLine: prediction.totalGoalsLine,
    totalCornersLine: prediction.totalCornersLine,
    yellowCardsLine: prediction.yellowCardsLine,
    redCardsLine: prediction.redCardsLine
  };
}

export function MatchScoreBreakdown({ match, prediction }: MatchScoreBreakdownProps) {
  if (!prediction) {
    return <p className="status-note">You did not submit a pick for this match.</p>;
  }

  const breakdown = getPredictionScoreBreakdown(toPredictionInput(prediction), toScorableMatch(match));

  if (!breakdown) {
    return null;
  }

  return (
    <div className="score-breakdown">
      <div className="score-breakdown__header">
        <strong>Your points</strong>
        <span className="score-breakdown__total">{breakdown.totalPoints} pts</span>
      </div>
      <div className="prediction-strip score-breakdown__strip">
        {breakdown.items.map((item) => (
          <div className={`score-breakdown__cell${item.hit ? " score-breakdown__cell--hit" : ""}`} key={item.label}>
            <span>{item.label}</span>
            <strong className="score-breakdown__pick">{item.pickLabel}</strong>
            <strong className="score-breakdown__points">
              {item.points}/{item.maxPoints}
            </strong>
          </div>
        ))}
      </div>
    </div>
  );
}
