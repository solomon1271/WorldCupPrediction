import { NextResponse } from "next/server";
import { z } from "zod";

import { userBelongsToLeague, getLeagueBySlug } from "@/lib/leagues";
import { prisma } from "@/lib/prisma";
import { isConfiguredAdminEmail, userHasAdminAccess } from "@/lib/auth/admin-email";
import { getPostLoginRedirectPath } from "@/lib/auth/post-login-redirect";
import { attachSessionCookie, issueSessionToken } from "@/lib/auth/session";
import { attachTopPicksReminderPendingCookie } from "@/lib/top-picks-reminder-cookie";
import { verifyPassword } from "@/lib/auth/password";

export const runtime = "nodejs";

const schema = z.object({
  email: z.email("Enter a valid email address.").transform((value) => value.toLowerCase()),
  password: z.string().min(1, "Password is required."),
  leagueSlug: z.string().trim().optional()
});

export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
    }

    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Could not sign in." }, { status: 400 });
    }

    const { email, password, leagueSlug } = parsed.data;

    let user;
    try {
      user = await prisma.user.findUnique({ where: { email } });
    } catch (dbReadErr) {
      console.error("login prisma findUnique error", dbReadErr);
      return NextResponse.json(
        { error: "Database is unavailable. Try again in a moment.", code: "E_DB_READ" },
        { status: 500 }
      );
    }

    if (!user) {
      return NextResponse.json({ error: "No account exists for that email." }, { status: 404 });
    }

    let passwordMatches: boolean;
    try {
      passwordMatches = await verifyPassword(password, user.passwordHash);
    } catch (verifyErr) {
      console.error("login bcrypt verify error", verifyErr);
      return NextResponse.json(
        { error: "Could not verify password. If this persists, reset your password or contact an admin.", code: "E_BCRYPT" },
        { status: 500 }
      );
    }

    if (!passwordMatches) {
      return NextResponse.json({ error: "Incorrect password." }, { status: 400 });
    }

    let userForSession = user;
    if (!user.isAdmin && isConfiguredAdminEmail(user.email)) {
      try {
        userForSession = await prisma.user.update({
          where: { id: user.id },
          data: { isAdmin: true }
        });
      } catch (dbErr) {
        console.error("login admin promotion skipped (DB update failed; sign-in continues)", dbErr);
        userForSession = user;
      }
    }

    if (leagueSlug) {
      const league = await getLeagueBySlug(leagueSlug);

      if (!league) {
        return NextResponse.json({ error: "League not found." }, { status: 404 });
      }

      const isMember = await userBelongsToLeague(userForSession.id, league.id);

      if (!isMember && !userHasAdminAccess(userForSession)) {
        return NextResponse.json({ error: "You are not a member of this league." }, { status: 403 });
      }
    }

    const redirectPath = await getPostLoginRedirectPath(userForSession, leagueSlug);

    let token: string;
    try {
      token = await issueSessionToken({
        sub: userForSession.id,
        email: userForSession.email,
        displayName: userForSession.displayName
      });
    } catch (jwtErr) {
      console.error("login jwt issue error", jwtErr);
      return NextResponse.json(
        { error: "Could not create session. Check AUTH_SECRET is set on the server.", code: "E_JWT" },
        { status: 500 }
      );
    }

    try {
      const response = NextResponse.json({
        ok: true,
        redirectPath
      });
      attachSessionCookie(response, token);
      attachTopPicksReminderPendingCookie(response);
      return response;
    } catch (cookieErr) {
      console.error("login set-cookie error", cookieErr);
      return NextResponse.json(
        { error: "Could not attach session cookie. Try another browser or clear site cookies.", code: "E_COOKIE" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("login route error", error);
    return NextResponse.json({ error: "Could not sign in. Please try again.", code: "E_UNKNOWN" }, { status: 500 });
  }
}
