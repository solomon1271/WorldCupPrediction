import { momentumHint, PlayerMomentum } from "@/lib/utils";

type MomentumBadgeProps = {
  momentum: PlayerMomentum;
  rank?: number;
  previousRank?: number;
  afterRank?: number;
  hasSnapshot?: boolean;
};

export function MomentumBadge({
  momentum,
  rank,
  previousRank,
  afterRank,
  hasSnapshot = false
}: MomentumBadgeProps) {
  const displayRank = afterRank ?? rank;
  const hint = momentumHint(momentum, displayRank, previousRank);
  if (momentum === "neutral") {
    if (!hasSnapshot) {
      return <span className="momentum-placeholder">—</span>;
    }

    const hint = momentumHint(momentum, displayRank, previousRank);

    return (
      <span className="momentum-placeholder" title={hint} aria-label={hint}>
        —
      </span>
    );
  }

  if (momentum === "down") {
    return (
      <span className="momentum-indicator momentum-indicator--down" title={hint} aria-label={hint} />
    );
  }

  return <span className="momentum-indicator momentum-indicator--up" title={hint} aria-label={hint} />;
}
