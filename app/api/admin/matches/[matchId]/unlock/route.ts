import { NextResponse } from "next/server";
import { z } from "zod";

import { getSessionUser } from "@/lib/auth/session-user";
import { userHasAdminAccess } from "@/lib/auth/admin-email";
import { unlockMatchPredictions } from "@/lib/match-unlock";

const bodySchema = z.object({
  hours: z.number().positive().max(168).optional()
});

export async function POST(request: Request, { params }: { params: Promise<{ matchId: string }> }) {
  const user = await getSessionUser();

  if (!user || !userHasAdminAccess(user)) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const { matchId: matchIdParam } = await params;
  const matchId = Number.parseInt(matchIdParam, 10);

  if (!Number.isFinite(matchId) || matchId <= 0) {
    return NextResponse.json({ error: "Invalid match id." }, { status: 400 });
  }

  let hours: number | undefined;

  try {
    const rawBody = await request.text();

    if (rawBody.trim()) {
      const parsed = bodySchema.safeParse(JSON.parse(rawBody));

      if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid request." }, { status: 400 });
      }

      hours = parsed.data.hours;
    }
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  try {
    const result = await unlockMatchPredictions(matchId, { hours });

    return NextResponse.json({
      ok: true,
      ...result,
      note:
        hours !== undefined
          ? `Predictions for match ${matchId} are open for ${hours} hour(s).`
          : `Predictions for match ${matchId} stay open until kickoff via admin override.`
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not unlock this match.";
    return NextResponse.json({ error: message }, { status: 404 });
  }
}
