import { NextResponse } from "next/server";
import { z } from "zod";

import { userHasAdminAccess } from "@/lib/auth/admin-email";
import { getSessionUser } from "@/lib/auth/session-user";
import { createLeague, listLeagues } from "@/lib/leagues";

const schema = z.object({
  slug: z.string().trim().min(2),
  name: z.string().trim().min(3),
  inviteCode: z.string().trim().min(3),
  subtitle: z.string().trim().optional()
});

export async function GET() {
  const user = await getSessionUser();

  if (!user || !userHasAdminAccess(user)) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const leagues = await listLeagues();
  return NextResponse.json({ leagues });
}

export async function POST(request: Request) {
  const user = await getSessionUser();

  if (!user || !userHasAdminAccess(user)) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid league details." }, { status: 400 });
  }

  try {
    const league = await createLeague(parsed.data);
    return NextResponse.json({
      ok: true,
      league,
      signupUrl: `/l/${league.slug}/signup`,
      dashboardUrl: `/l/${league.slug}`
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not create league.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
