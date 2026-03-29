import { NextResponse } from "next/server";

import { syncMatchFixtures } from "@/lib/match-sync";

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

    const sync = await syncMatchFixtures();
    return NextResponse.json({ ok: true, sync });
  } catch (error) {
    console.error("matches-sync cron failed", error);
    return NextResponse.json({ ok: false, error: "Cron execution failed." }, { status: 500 });
  }
}
