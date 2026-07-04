export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

import { getSessionUser } from "@/lib/auth/session-user";
import { requireLeagueMembership } from "@/lib/leagues";
import { buildPlayerStandingDetail, parseOfficialAwards } from "@/lib/player-standing";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ slug: string; userId: string }>;
};

export async function GET(request: Request, { params }: RouteContext) {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { slug, userId } = await params;
  const membership = await requireLeagueMembership(user.id, slug);

  if ("error" in membership) {
    return NextResponse.json({ error: membership.error }, { status: 403 });
  }

  const [playerMember, league] = await Promise.all([
    prisma.leagueMember.findUnique({
      where: {
        leagueId_userId: {
          leagueId: membership.league.id,
          userId
        }
      },
      include: {
        user: {
          include: {
            matchPredictions: {
              where: { leagueId: membership.league.id },
              include: { match: true }
            },
            tournamentPredictions: {
              where: { leagueId: membership.league.id },
              take: 1
            }
          }
        }
      }
    }),
    prisma.league.findUnique({
      where: { id: membership.league.id },
      select: { officialAwardsJson: true }
    })
  ]);

  if (!playerMember) {
    return NextResponse.json({ error: "Player not found in this league." }, { status: 404 });
  }

  const scopeParam = new URL(request.url).searchParams.get("scope");
  const scope = scopeParam === "group-stage" ? "group-stage" : "knockout";

  const detail = buildPlayerStandingDetail(
    {
      playerId: playerMember.user.id,
      playerName: playerMember.user.displayName,
      matchPredictions: playerMember.user.matchPredictions,
      tournamentPrediction: playerMember.user.tournamentPredictions[0] || null,
      officialAwards: parseOfficialAwards(league?.officialAwardsJson)
    },
    { scope, redactTopPicks: user.id !== userId }
  );

  return NextResponse.json(
    { ok: true, detail },
    {
      headers: {
        "Cache-Control": "no-store"
      }
    }
  );
}
