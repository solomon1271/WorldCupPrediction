import { getAppTimezone } from "@/lib/match-urgency";
import { getZonedDateStart } from "@/lib/timezone";

const DEFAULT_TOURNAMENT_PICKS_LOCK_DATE = "2026-06-28";

export function getTournamentPicksLockDateLabel() {
  return process.env.TOURNAMENT_PICKS_LOCK_DATE?.trim() || DEFAULT_TOURNAMENT_PICKS_LOCK_DATE;
}

export function getTournamentPicksLockAt(timeZone = getAppTimezone()) {
  return getZonedDateStart(timeZone, getTournamentPicksLockDateLabel());
}

export function isTournamentPicksLocked(referenceDate = new Date(), timeZone = getAppTimezone()) {
  return referenceDate.getTime() >= getTournamentPicksLockAt(timeZone).getTime();
}

export function formatTournamentPicksLockLabel(timeZone = getAppTimezone()) {
  const lockAt = getTournamentPicksLockAt(timeZone);

  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(lockAt);
}
