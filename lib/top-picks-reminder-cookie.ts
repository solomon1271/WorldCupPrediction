import type { NextResponse } from "next/server";

export const TOP_PICKS_REMINDER_PENDING_COOKIE = "top-picks-reminder-pending";

export function topPicksReminderPendingCookieOptions() {
  return {
    httpOnly: false,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 5 * 60
  };
}

export function attachTopPicksReminderPendingCookie(response: NextResponse) {
  response.cookies.set(
    TOP_PICKS_REMINDER_PENDING_COOKIE,
    "1",
    topPicksReminderPendingCookieOptions()
  );
}

export function readTopPicksReminderPendingCookie() {
  if (typeof document === "undefined") {
    return false;
  }

  return document.cookie
    .split("; ")
    .some((entry) => entry === `${TOP_PICKS_REMINDER_PENDING_COOKIE}=1`);
}

export function clearTopPicksReminderPendingCookie() {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${TOP_PICKS_REMINDER_PENDING_COOKIE}=; path=/; max-age=0`;
}
