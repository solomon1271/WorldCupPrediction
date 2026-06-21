export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { z } from "zod";

import { getSessionUser } from "@/lib/auth/session-user";
import { requireLeagueMembership } from "@/lib/leagues";
import { markMatchWinnerRevealSeen } from "@/lib/match-winner-announcement";

const schema = z.object({
  matchId: z.number().int().positive()
});

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { slug } = await params;
  const membership = await requireLeagueMembership(user.id, slug);

  if ("error" in membership) {
    return NextResponse.json({ error: membership.error }, { status: 403 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid request." }, { status: 400 });
  }

  await markMatchWinnerRevealSeen(membership.league.id, user.id, parsed.data.matchId);

  return NextResponse.json({ ok: true });
}
