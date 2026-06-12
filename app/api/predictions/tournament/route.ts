export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { z } from "zod";

import { requireLeagueMembership } from "@/lib/leagues";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth/session-user";

const schema = z.object({
  leagueSlug: z.string().trim().min(1),
  champion: z.string().trim().min(2),
  runnerUp: z.string().trim().min(2),
  goldenBoot: z.string().trim().min(2),
  bestYoungPlayer: z.string().trim().min(2),
  goldenGlove: z.string().trim().min(2),
  bestPlayer: z.string().trim().min(2)
});

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

  const membership = await requireLeagueMembership(user.id, parsed.data.leagueSlug);

  if ("error" in membership) {
    return NextResponse.json({ error: membership.error }, { status: 403 });
  }

  const { champion, runnerUp, goldenBoot, bestYoungPlayer, goldenGlove, bestPlayer } = parsed.data;

  await prisma.tournamentPrediction.upsert({
    where: {
      leagueId_userId: {
        leagueId: membership.league.id,
        userId: user.id
      }
    },
    update: {
      champion,
      runnerUp,
      goldenBoot,
      bestYoungPlayer,
      goldenGlove,
      bestPlayer
    },
    create: {
      leagueId: membership.league.id,
      userId: user.id,
      champion,
      runnerUp,
      goldenBoot,
      bestYoungPlayer,
      goldenGlove,
      bestPlayer,
      groupWinners: "{}"
    }
  });

  return NextResponse.json({ ok: true });
}
