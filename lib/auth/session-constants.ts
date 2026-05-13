/** HttpOnly session cookie name (shared by Route Handlers and middleware). */
export const SESSION_COOKIE_NAME = "world-cup-session";

/** No requests for this long → session is invalid (sliding window). */
export const SESSION_IDLE_SECONDS = 15 * 60;

/** Re-issue cookie with a new activity timestamp at most this often (limits churn). */
export const SESSION_SLIDE_REFRESH_SECONDS = 60;

/** Absolute maximum session length from first sign-in. */
export const SESSION_MAX_SECONDS = 14 * 24 * 60 * 60;

export function sessionCookieOptions(): {
  httpOnly: true;
  sameSite: "lax";
  secure: boolean;
  path: string;
  maxAge: number;
} {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_SECONDS
  };
}
