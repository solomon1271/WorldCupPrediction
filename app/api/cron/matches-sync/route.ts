import { NextResponse } from "next/server";

import { isCronAuthorized } from "@/lib/cron-auth";
import { syncMatchFixtures } from "@/lib/match-sync";

export async function GET(request: Request) {
  try {
    if (!isCronAuthorized(request)) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const sync = await syncMatchFixtures();
    return NextResponse.json({ ok: true, sync });
  } catch (error) {
    console.error("matches-sync cron failed", error);
    return NextResponse.json({ ok: false, error: "Cron execution failed." }, { status: 500 });
  }
}
