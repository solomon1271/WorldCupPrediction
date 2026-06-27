type ZonedParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
};

export function getZonedParts(date: Date, timeZone: string): ZonedParts {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });

  const parts = Object.fromEntries(formatter.formatToParts(date).map((part) => [part.type, part.value]));
  const hour = parts.hour === "24" ? "0" : parts.hour;

  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(hour),
    minute: Number(parts.minute),
    second: Number(parts.second)
  };
}

function zonedLocalToUtc(
  input: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
    millisecond?: number;
  },
  timeZone: string
): Date {
  const targetMs = input.millisecond ?? 0;
  let utcGuess = Date.UTC(input.year, input.month - 1, input.day, input.hour, input.minute, input.second, targetMs);

  for (let attempt = 0; attempt < 6; attempt++) {
    const parts = getZonedParts(new Date(utcGuess), timeZone);
    const asUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
    const targetAsUtc = Date.UTC(input.year, input.month - 1, input.day, input.hour, input.minute, input.second);
    const diff = targetAsUtc - asUtc;

    if (diff === 0) {
      break;
    }

    utcGuess += diff;
  }

  return new Date(utcGuess);
}

function weekdayFromYmd(year: number, month: number, day: number) {
  const monthAdjustments = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4];
  let adjustedYear = year;

  if (month < 3) {
    adjustedYear -= 1;
  }

  return (
    (adjustedYear +
      Math.floor(adjustedYear / 4) -
      Math.floor(adjustedYear / 100) +
      Math.floor(adjustedYear / 400) +
      monthAdjustments[month - 1] +
      day) %
    7
  );
}

const WEEKDAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;

function formatHour12(hour: number, minute: number) {
  const normalizedHour = hour % 24;
  const period = normalizedHour >= 12 ? "PM" : "AM";
  const hour12 = normalizedHour % 12 || 12;

  return `${hour12}:${String(minute).padStart(2, "0")} ${period}`;
}

export function formatKickoffPartsInTimeZone(kickoff: string | Date, timeZone: string) {
  const date = typeof kickoff === "string" ? new Date(kickoff) : kickoff;
  const { year, month, day, hour, minute } = getZonedParts(date, timeZone);
  const weekday = WEEKDAY_SHORT[weekdayFromYmd(year, month, day)];

  return {
    dateLine: `${weekday}, ${MONTH_SHORT[month - 1]} ${day}`,
    timeLine: formatHour12(hour, minute)
  };
}

export function formatKickoffInTimeZone(kickoff: string | Date, timeZone: string) {
  const { dateLine, timeLine } = formatKickoffPartsInTimeZone(kickoff, timeZone);

  return `${dateLine}, ${timeLine}`;
}

export function getZonedDayBounds(timeZone: string, referenceDate = new Date()) {
  const { year, month, day } = getZonedParts(referenceDate, timeZone);
  const dateLabel = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const start = zonedLocalToUtc({ year, month, day, hour: 0, minute: 0, second: 0, millisecond: 0 }, timeZone);
  const end = zonedLocalToUtc({ year, month, day, hour: 23, minute: 59, second: 59, millisecond: 999 }, timeZone);

  return { start, end, dateLabel };
}

export function getZonedDateStart(timeZone: string, dateLabel: string) {
  const [year, month, day] = dateLabel.split("-").map(Number);

  if (!year || !month || !day) {
    throw new Error(`Invalid date label: ${dateLabel}`);
  }

  return zonedLocalToUtc({ year, month, day, hour: 0, minute: 0, second: 0, millisecond: 0 }, timeZone);
}

export function getTomorrowDayBounds(timeZone: string, referenceDate = new Date()) {
  const { end } = getZonedDayBounds(timeZone, referenceDate);
  const tomorrowReference = new Date(end.getTime() + 1);

  return getZonedDayBounds(timeZone, tomorrowReference);
}
