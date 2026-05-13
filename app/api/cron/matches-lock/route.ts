import { NextResponse } from "next/server";

import { isCronAuthorized } from "@/lib/cron-auth";
import { lockMatchesNearKickoff } from "@/lib/match-sync";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    if (!isCronAuthorized(request)) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const lock = await lockMatchesNearKickoff();
    return NextResponse.json({ ok: true, lock });
  } catch (error) {
    console.error("matches-lock cron failed", error);
    const detail = error instanceof Error ? error.message : "Cron execution failed.";
    const message = process.env.NODE_ENV === "development" ? detail : "Cron execution failed.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
