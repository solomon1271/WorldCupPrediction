import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { SESSION_COOKIE_NAME, sessionCookieOptions } from "@/lib/auth/session-constants";
import { signRefreshedSessionToken, verifySessionToken } from "@/lib/auth/session-token";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // API routes read the session cookie directly — avoid refreshing or deleting it here.
  if (path.startsWith("/api/")) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.next();
  }

  const verified = await verifySessionToken(token);
  if (!verified.ok) {
    const res = NextResponse.next();
    res.cookies.delete(SESSION_COOKIE_NAME);
    return res;
  }

  if (verified.shouldRefreshSlide) {
    const newToken = await signRefreshedSessionToken(verified.claims, verified.expiresAtSec);
    const res = NextResponse.next();
    res.cookies.set(SESSION_COOKIE_NAME, newToken, sessionCookieOptions());
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"]
};
