import { NextResponse } from "next/server";
import { z } from "zod";

import { getSessionUser } from "@/lib/auth/session-user";
import { addUserToLeague, getLeagueByInviteCode } from "@/lib/leagues";

const schema = z.object({
  inviteCode: z.string().trim().min(1, "Invite code is required.")
});

export async function POST(request: Request) {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid invite code." }, { status: 400 });
  }

  const league = await getLeagueByInviteCode(parsed.data.inviteCode);

  if (!league) {
    return NextResponse.json({ error: "Invite code does not match any league." }, { status: 400 });
  }

  await addUserToLeague(user.id, league.id);

  return NextResponse.json({ ok: true, leagueSlug: league.slug, leagueName: league.name });
}
