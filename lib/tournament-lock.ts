import { getAppTimezone } from "@/lib/match-urgency";
import { getZonedDateStart } from "@/lib/timezone";

const DEFAULT_TOURNAMENT_PICKS_LOCK_DATE = "2026-06-28";
const DEFAULT_TOURNAMENT_PICKS_LOCK_AT = "2026-07-05T16:46:55.000Z";

export function getTournamentPicksLockDateLabel() {
  return process.env.TOURNAMENT_PICKS_LOCK_DATE?.trim() || DEFAULT_TOURNAMENT_PICKS_LOCK_DATE;
}

export function getTournamentPicksLockAtIso() {
  const raw = process.env.TOURNAMENT_PICKS_LOCK_AT?.trim() || DEFAULT_TOURNAMENT_PICKS_LOCK_AT;

  if (!raw) {
    return null;
  }

  const lockAt = new Date(raw);

  if (Number.isNaN(lockAt.getTime())) {
    return null;
  }

  return lockAt;
}

export function hasPreciseTournamentPicksLockAt() {
  return getTournamentPicksLockAtIso() !== null;
}

export function getTournamentPicksLockAt(timeZone = getAppTimezone()) {
  const lockAtIso = getTournamentPicksLockAtIso();

  if (lockAtIso) {
    return lockAtIso;
  }

  return getZonedDateStart(timeZone, getTournamentPicksLockDateLabel());
}

export function getTournamentPicksUnlockUntil() {
  const raw = process.env.TOURNAMENT_PICKS_UNLOCK_UNTIL?.trim();

  if (!raw) {
    return null;
  }

  const unlockUntil = new Date(raw);

  if (Number.isNaN(unlockUntil.getTime())) {
    return null;
  }

  return unlockUntil;
}

export function buildTournamentPicksUnlockUntilIso(hours: number, fromDate = new Date()) {
  return new Date(fromDate.getTime() + hours * 60 * 60 * 1000).toISOString();
}

export function isTournamentPicksTemporarilyUnlocked(referenceDate = new Date()) {
  const unlockUntil = getTournamentPicksUnlockUntil();

  if (!unlockUntil) {
    return false;
  }

  return referenceDate.getTime() < unlockUntil.getTime();
}

export function isTournamentPicksLocked(referenceDate = new Date(), timeZone = getAppTimezone()) {
  if (isTournamentPicksTemporarilyUnlocked(referenceDate)) {
    return false;
  }

  return referenceDate.getTime() >= getTournamentPicksLockAt(timeZone).getTime();
}

export function formatTournamentPicksLockLabel(timeZone = getAppTimezone()) {
  const lockAt = getTournamentPicksLockAt(timeZone);

  if (hasPreciseTournamentPicksLockAt()) {
    return new Intl.DateTimeFormat("en-US", {
      timeZone,
      weekday: "short",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    }).format(lockAt);
  }

  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(lockAt);
}

export function formatTournamentPicksUnlockUntilLabel(
  timeZone = getAppTimezone(),
  referenceDate = new Date()
) {
  const unlockUntil = getTournamentPicksUnlockUntil();

  if (!unlockUntil || referenceDate.getTime() >= unlockUntil.getTime()) {
    return null;
  }

  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(unlockUntil);
}
