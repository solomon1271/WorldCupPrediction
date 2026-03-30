import { NextResponse } from "next/server";

import { isCronAuthorized } from "@/lib/cron-auth";
import { lockMatchesNearKickoff, syncMatchFixtures } from "@/lib/match-sync";

export async function GET(request: Request) {
  try {
    if (!isCronAuthorized(request)) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const sync = await syncMatchFixtures();
    const lock = await lockMatchesNearKickoff();

    return NextResponse.json({ ok: true, sync, lock });
  } catch (error) {
    console.error("matches-maintain cron failed", error);
    return NextResponse.json({ ok: false, error: "Cron execution failed." }, { status: 500 });
  }
}
