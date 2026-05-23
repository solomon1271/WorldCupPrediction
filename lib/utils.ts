export const formatKickoff = (kickoff: string) =>
  new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(kickoff));

export type PlayerMomentum = "neutral" | "up" | "down";

export function getRankMomentum(currentRank: number, previousRank?: number): PlayerMomentum {
  if (previousRank === undefined) {
    return "neutral";
  }

  if (currentRank < previousRank) {
    return "up";
  }

  if (currentRank > previousRank) {
    return "down";
  }

  return "neutral";
}

/** @deprecated Use getRankMomentum instead. */
export function getPlayerMomentum(_scoredMatches: number, _totalPoints: number): PlayerMomentum {
  return "neutral";
}

export const momentumLabel = (momentum: PlayerMomentum) => {
  if (momentum === "up") {
    return "Moved up";
  }

  if (momentum === "down") {
    return "Moved down";
  }

  return "No change";
};

export const momentumHint = (momentum: PlayerMomentum, currentRank?: number, previousRank?: number) => {
  if (momentum === "up" && currentRank !== undefined && previousRank !== undefined) {
    return `Moved up from #${previousRank} to #${currentRank} since the last update.`;
  }

  if (momentum === "down" && currentRank !== undefined && previousRank !== undefined) {
    return `Moved down from #${previousRank} to #${currentRank} since the last update.`;
  }

  if (momentum === "up") {
    return "Rank moved up since the last leaderboard update.";
  }

  if (momentum === "down") {
    return "Rank moved down since the last leaderboard update.";
  }

  return "Rank unchanged since the last leaderboard update.";
};

/** @deprecated Use momentumLabel instead. */
export const trendLabel = momentumLabel;
