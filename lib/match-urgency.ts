import { getZonedDayBounds } from "@/lib/timezone";

export const DEFAULT_APP_TIMEZONE = "America/Chicago";

export function getAppTimezone() {
  return (
    process.env.NEXT_PUBLIC_CRON_TIMEZONE?.trim() ||
    process.env.CRON_TIMEZONE?.trim() ||
    DEFAULT_APP_TIMEZONE
  );
}

export type MatchUrgency = "today-needs-pick" | "today-ready" | null;

export function getMatchUrgency(input: {
  kickoff: Date | string;
  isLocked: boolean;
  isFinished: boolean;
  hasPrediction: boolean;
  timeZone?: string;
  referenceDate?: Date;
}): MatchUrgency {
  if (input.isFinished || input.isLocked) {
    return null;
  }

  const kickoff = typeof input.kickoff === "string" ? new Date(input.kickoff) : input.kickoff;
  const timeZone = input.timeZone || getAppTimezone();
  const { start, end } = getZonedDayBounds(timeZone, input.referenceDate ?? new Date());
  const kickoffMs = kickoff.getTime();

  if (kickoffMs < start.getTime() || kickoffMs > end.getTime()) {
    return null;
  }

  return input.hasPrediction ? "today-ready" : "today-needs-pick";
}

export function sortMatchesByUrgency<T extends { kickoff: string; urgency: MatchUrgency }>(matches: T[]) {
  const rank = (urgency: MatchUrgency) => {
    if (urgency === "today-needs-pick") {
      return 0;
    }

    if (urgency === "today-ready") {
      return 1;
    }

    return 2;
  };

  return [...matches].sort((left, right) => {
    const rankDiff = rank(left.urgency) - rank(right.urgency);

    if (rankDiff !== 0) {
      return rankDiff;
    }

    return new Date(left.kickoff).getTime() - new Date(right.kickoff).getTime();
  });
}

export function sortMatchesByKickoffAsc<T extends { kickoff: string }>(matches: T[]) {
  return [...matches].sort(
    (left, right) => new Date(left.kickoff).getTime() - new Date(right.kickoff).getTime()
  );
}

export function formatTodayLabel(timeZone: string, referenceDate = new Date()) {
  const { start } = getZonedDayBounds(timeZone, referenceDate);

  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "long",
    month: "long",
    day: "numeric"
  }).format(start);
}

/** @deprecated Use formatTodayLabel instead. */
export const formatTomorrowLabel = formatTodayLabel;

export function formatTimezoneShortName(timeZone: string, referenceDate = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    timeZoneName: "short"
  }).formatToParts(referenceDate);

  return parts.find((part) => part.type === "timeZoneName")?.value || timeZone;
}
