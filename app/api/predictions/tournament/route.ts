export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { z } from "zod";

import { requireActiveLeagueMembership } from "@/lib/leagues";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth/session-user";
import { isTournamentPicksLocked } from "@/lib/tournament-lock";

const awardField = z.string().trim().max(120);

const schema = z.object({
  leagueSlug: z.string().trim().min(1),
  champion: awardField.optional().default(""),
  runnerUp: awardField.optional().default(""),
  goldenBoot: awardField.optional().default(""),
  bestYoungPlayer: awardField.optional().default(""),
  goldenGlove: awardField.optional().default(""),
  bestPlayer: awardField.optional().default("")
});

function normalizeAward(value: string | undefined) {
  const trimmed = value?.trim() ?? "";
  return trimmed.length > 0 ? trimmed : null;
}

function parseAwards(incoming: z.infer<typeof schema>) {
  return {
    champion: normalizeAward(incoming.champion),
    runnerUp: normalizeAward(incoming.runnerUp),
    goldenBoot: normalizeAward(incoming.goldenBoot),
    bestYoungPlayer: normalizeAward(incoming.bestYoungPlayer),
    goldenGlove: normalizeAward(incoming.goldenGlove),
    bestPlayer: normalizeAward(incoming.bestPlayer)
  };
}

export async function POST(request: Request) {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid tournament prediction." }, { status: 400 });
  }

  const membership = await requireActiveLeagueMembership(user.id, parsed.data.leagueSlug);

  if ("error" in membership) {
    return NextResponse.json({ error: membership.error }, { status: 403 });
  }

  if (isTournamentPicksLocked()) {
    return NextResponse.json({ error: "Top picks are locked for this tournament." }, { status: 400 });
  }

  const awards = parseAwards(parsed.data);

  if (!Object.values(awards).some(Boolean)) {
    return NextResponse.json({ error: "Enter at least one tournament pick before saving." }, { status: 400 });
  }

  await prisma.tournamentPrediction.upsert({
    where: {
      leagueId_userId: {
        leagueId: membership.league.id,
        userId: user.id
      }
    },
    update: awards,
    create: {
      leagueId: membership.league.id,
      userId: user.id,
      ...awards,
      groupWinners: "{}"
    }
  });

  return NextResponse.json({ ok: true });
}
