import { PredictionScoreBreakdown } from "@/lib/match-scoring";

type MatchScoreBreakdownProps = {
  breakdown: PredictionScoreBreakdown | null | undefined;
  hasPrediction: boolean;
};

export function MatchScoreBreakdown({ breakdown, hasPrediction }: MatchScoreBreakdownProps) {
  if (!hasPrediction) {
    return <p className="status-note">You did not submit a pick for this match.</p>;
  }

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
