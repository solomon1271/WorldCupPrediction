export const runtime = "nodejs";

import { NextResponse } from "next/server";

import { getSessionUser } from "@/lib/auth/session-user";
import { requireLeagueMembership } from "@/lib/leagues";
import { markTopPicksCelebrationSeen } from "@/lib/top-picks-announcement";

export async function POST(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { slug } = await params;
  const membership = await requireLeagueMembership(user.id, slug);

  if ("error" in membership) {
    return NextResponse.json({ error: membership.error }, { status: 403 });
  }

  await markTopPicksCelebrationSeen(membership.league.id, user.id);

  return NextResponse.json({ ok: true });
}
