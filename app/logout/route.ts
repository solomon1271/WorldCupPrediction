import { NextResponse } from "next/server";

import { clearSessionCookieOnResponse } from "@/lib/auth/session";

export async function GET(request: Request) {
  const response = NextResponse.redirect(new URL("/login", request.url));
  clearSessionCookieOnResponse(response);
  return response;
}

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/login", request.url));
  clearSessionCookieOnResponse(response);
  return response;
}
