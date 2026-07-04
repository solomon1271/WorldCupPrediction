export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

import { getSessionUser } from "@/lib/auth/session-user";
import { buildGroupStageInsights } from "@/lib/group-stage-insights";
import { requireLeagueMembership } from "@/lib/leagues";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { slug } = await params;
  const membership = await requireLeagueMembership(user.id, slug);

  if ("error" in membership) {
    return NextResponse.json({ error: membership.error }, { status: 403 });
  }

  const insights = await buildGroupStageInsights(membership.league.id);

  return NextResponse.json(
    { ok: true, insights },
    {
      headers: {
        "Cache-Control": "no-store"
      }
    }
  );
}
