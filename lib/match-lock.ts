export type MatchLockState = {
  isLocked: boolean;
  predictionUnlockUntil: Date | null;
};

export function isMatchLocked(match: MatchLockState, referenceDate = new Date()) {
  if (match.predictionUnlockUntil && match.predictionUnlockUntil.getTime() > referenceDate.getTime()) {
    return false;
  }

  return match.isLocked;
}
