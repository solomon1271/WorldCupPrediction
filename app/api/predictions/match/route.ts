export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { z } from "zod";

import { requireLeagueMembership } from "@/lib/leagues";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth/session-user";

const schema = z.object({
  leagueSlug: z.string().trim().min(1),
  matchId: z.number().int().positive(),
  homeScore: z.number().int().min(0).max(20).nullable(),
  awayScore: z.number().int().min(0).max(20).nullable(),
  winner: z.string().trim().min(2),
  totalGoalsLine: z.string().trim().min(1),
  totalCornersLine: z.string().trim().min(1),
  yellowCardsLine: z.string().trim().min(1),
  redCardsLine: z.enum(["Yes", "No"])
});

export async function POST(request: Request) {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid prediction." }, { status: 400 });
  }

  const { leagueSlug, matchId, homeScore, awayScore, winner, totalGoalsLine, totalCornersLine, yellowCardsLine, redCardsLine } =
    parsed.data;
  const membership = await requireLeagueMembership(user.id, leagueSlug);

  if ("error" in membership) {
    return NextResponse.json({ error: membership.error }, { status: 403 });
  }

  const hasOnlyOneScore = (homeScore === null) !== (awayScore === null);

  if (hasOnlyOneScore) {
    return NextResponse.json({ error: "Enter both scores for an exact-score pick, or leave both blank." }, { status: 400 });
  }

  const match = await prisma.match.findUnique({
    where: { id: matchId }
  });

  if (!match) {
    return NextResponse.json({ error: "Match not found." }, { status: 404 });
  }

  if (match.isLocked) {
    return NextResponse.json({ error: "This match is already locked." }, { status: 400 });
  }

  await prisma.matchPrediction.upsert({
    where: {
      leagueId_userId_matchId: {
        leagueId: membership.league.id,
        userId: user.id,
        matchId
      }
    },
    update: {
      winner,
      homeScore,
      awayScore,
      totalGoalsLine,
      totalCornersLine,
      yellowCardsLine,
      redCardsLine
    },
    create: {
      leagueId: membership.league.id,
      userId: user.id,
      matchId,
      winner,
      homeScore,
      awayScore,
      totalGoalsLine,
      totalCornersLine,
      yellowCardsLine,
      redCardsLine
    }
  });

  return NextResponse.json({ ok: true });
}
