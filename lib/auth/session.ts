import type { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { SESSION_COOKIE_NAME, sessionCookieOptions } from "@/lib/auth/session-constants";
import { signNewSessionToken, verifySessionToken, type SessionPublicClaims } from "@/lib/auth/session-token";

export type SessionPayload = SessionPublicClaims;

export async function issueSessionToken(payload: SessionPayload): Promise<string> {
  return signNewSessionToken(payload);
}

/** Set session on a Route Handler / Middleware response (avoids `cookies().set` errors in API routes). */
export function attachSessionCookie(response: NextResponse, token: string) {
  try {
    response.cookies.set(SESSION_COOKIE_NAME, token, sessionCookieOptions());
  } catch {
    const opts = sessionCookieOptions();
    const secure = opts.secure ? "; Secure" : "";
    const header = `${SESSION_COOKIE_NAME}=${token}; Path=${opts.path}; Max-Age=${String(opts.maxAge)}; HttpOnly; SameSite=Lax${secure}`;
    response.headers.append("Set-Cookie", header);
  }
}

export function clearSessionCookieOnResponse(response: NextResponse) {
  response.cookies.delete(SESSION_COOKIE_NAME);
}

export async function readSessionCookie() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const verified = await verifySessionToken(token);
  if (!verified.ok) {
    return null;
  }

  return verified.claims;
}
