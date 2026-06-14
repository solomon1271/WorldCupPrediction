import { getTomorrowDayBounds } from "@/lib/timezone";

export const DEFAULT_APP_TIMEZONE = "America/Chicago";

export function getAppTimezone() {
  return process.env.CRON_TIMEZONE?.trim() || DEFAULT_APP_TIMEZONE;
}

export type MatchUrgency = "tomorrow-needs-pick" | "tomorrow-ready" | null;

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
  const { start, end } = getTomorrowDayBounds(timeZone, input.referenceDate ?? new Date());
  const kickoffMs = kickoff.getTime();

  if (kickoffMs < start.getTime() || kickoffMs > end.getTime()) {
    return null;
  }

  return input.hasPrediction ? "tomorrow-ready" : "tomorrow-needs-pick";
}

export function sortMatchesByUrgency<T extends { kickoff: string; urgency: MatchUrgency }>(matches: T[]) {
  const rank = (urgency: MatchUrgency) => {
    if (urgency === "tomorrow-needs-pick") {
      return 0;
    }

    if (urgency === "tomorrow-ready") {
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

export function formatTomorrowLabel(timeZone: string, referenceDate = new Date()) {
  const { start } = getTomorrowDayBounds(timeZone, referenceDate);

  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "long",
    month: "long",
    day: "numeric"
  }).format(start);
}

export function formatTimezoneShortName(timeZone: string, referenceDate = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    timeZoneName: "short"
  }).formatToParts(referenceDate);

  return parts.find((part) => part.type === "timeZoneName")?.value || timeZone;
}
