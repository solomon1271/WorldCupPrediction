const DEFAULT_LOCK_LEAD_MINUTES = 5;

export type MatchLockState = {
  kickoff: Date | string;
  predictionUnlockUntil: Date | null;
  finalHomeScore?: number | null;
  finalAwayScore?: number | null;
};

export function getMatchLockLeadMinutes() {
  const parsed = Number.parseInt(process.env.MATCH_LOCK_LEAD_MINUTES || "", 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : DEFAULT_LOCK_LEAD_MINUTES;
}

export function isMatchLocked(match: MatchLockState, referenceDate = new Date()) {
  if (match.predictionUnlockUntil && match.predictionUnlockUntil.getTime() > referenceDate.getTime()) {
    return false;
  }

  if (match.finalHomeScore !== null && match.finalHomeScore !== undefined && match.finalAwayScore !== null && match.finalAwayScore !== undefined) {
    return true;
  }

  const kickoff = typeof match.kickoff === "string" ? new Date(match.kickoff) : match.kickoff;
  const lockAtMs = kickoff.getTime() - getMatchLockLeadMinutes() * 60 * 1000;

  return referenceDate.getTime() >= lockAtMs;
}
