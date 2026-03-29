import { NextResponse } from "next/server";

import { lockMatchesNearKickoff } from "@/lib/match-sync";

function isAuthorized(request: Request) {
  const cronSecret = process.env.CRON_SECRET?.trim();

  if (!cronSecret) {
    throw new Error("CRON_SECRET is not configured.");
  }

  const authHeader = request.headers.get("authorization");
  return authHeader === `Bearer ${cronSecret}`;
}

export async function GET(request: Request) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const lock = await lockMatchesNearKickoff();
    return NextResponse.json({ ok: true, lock });
  } catch (error) {
    console.error("matches-lock cron failed", error);
    return NextResponse.json({ ok: false, error: "Cron execution failed." }, { status: 500 });
  }
}
