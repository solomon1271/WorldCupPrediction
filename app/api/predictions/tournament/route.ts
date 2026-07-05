export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { z } from "zod";

import { requireActiveLeagueMembership } from "@/lib/leagues";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth/session-user";
import { isTournamentPicksLocked } from "@/lib/tournament-lock";
import { resolveCanonicalPlayerName } from "@/lib/world-cup-players";
import { getWorldCupTeams } from "@/lib/world-cup-teams";

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

function normalizePlayerAward(value: string | undefined) {
  const trimmed = value?.trim() ?? "";

  if (!trimmed) {
    return null;
  }

  const canonical = resolveCanonicalPlayerName(trimmed);

  if (!canonical) {
    return { error: `Unknown player: ${trimmed}. Choose a name from the official player list.` };
  }

  return canonical;
}

function normalizeTeamAward(value: string | undefined) {
  const trimmed = value?.trim() ?? "";

  if (!trimmed) {
    return null;
  }

  if (!getWorldCupTeams().includes(trimmed)) {
    return { error: `Unknown country: ${trimmed}. Choose a team from the World Cup list.` };
  }

  return trimmed;
}

function parseAwards(incoming: z.infer<typeof schema>) {
  const champion = normalizeTeamAward(incoming.champion);
  if (typeof champion === "object" && champion && "error" in champion) {
    return champion;
  }

  const runnerUp = normalizeTeamAward(incoming.runnerUp);
  if (typeof runnerUp === "object" && runnerUp && "error" in runnerUp) {
    return runnerUp;
  }

  const goldenBoot = normalizePlayerAward(incoming.goldenBoot);
  if (typeof goldenBoot === "object" && goldenBoot && "error" in goldenBoot) {
    return goldenBoot;
  }

  const bestYoungPlayer = normalizePlayerAward(incoming.bestYoungPlayer);
  if (typeof bestYoungPlayer === "object" && bestYoungPlayer && "error" in bestYoungPlayer) {
    return bestYoungPlayer;
  }

  const goldenGlove = normalizePlayerAward(incoming.goldenGlove);
  if (typeof goldenGlove === "object" && goldenGlove && "error" in goldenGlove) {
    return goldenGlove;
  }

  const bestPlayer = normalizePlayerAward(incoming.bestPlayer);
  if (typeof bestPlayer === "object" && bestPlayer && "error" in bestPlayer) {
    return bestPlayer;
  }

  return {
    champion,
    runnerUp,
    goldenBoot,
    bestYoungPlayer,
    goldenGlove,
    bestPlayer
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

  if ("error" in awards) {
    return NextResponse.json({ error: awards.error }, { status: 400 });
  }

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
