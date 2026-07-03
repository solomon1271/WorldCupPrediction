import { NextResponse } from "next/server";
import { z } from "zod";

import { addUserToLeague, getLeagueJoinEligibility } from "@/lib/leagues";
import { prisma } from "@/lib/prisma";
import { attachSessionCookie, issueSessionToken } from "@/lib/auth/session";
import { isConfiguredAdminEmail } from "@/lib/auth/admin-email";
import { hashPassword } from "@/lib/auth/password";

export const runtime = "nodejs";

const schema = z.object({
  displayName: z.string().trim().min(2, "Display name must be at least 2 characters."),
  email: z.email("Enter a valid email address.").transform((value) => value.toLowerCase()),
  password: z.string().min(8, "Password must be at least 8 characters."),
  inviteCode: z.string().trim().min(1, "Invite code is required.")
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
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Could not create account." }, { status: 400 });
    }

    const { displayName, email, password, inviteCode } = parsed.data;
    const eligibility = await getLeagueJoinEligibility(inviteCode);

    if (eligibility.kind === "not_found") {
      return NextResponse.json({ error: "Invite code does not match any league." }, { status: 400 });
    }

    if (eligibility.kind === "unavailable") {
      return NextResponse.json({ error: "This league is not accepting new members right now." }, { status: 400 });
    }

    if (eligibility.kind === "paused") {
      return NextResponse.json({ error: "This league is temporarily paused. Try again later." }, { status: 400 });
    }

    const league = eligibility.league;

    let existingUser;
    try {
      existingUser = await prisma.user.findUnique({ where: { email } });
    } catch (dbReadErr) {
      console.error("signup prisma findUnique error", dbReadErr);
      return NextResponse.json(
        { error: "Database is unavailable. Try again in a moment.", code: "E_DB_READ" },
        { status: 500 }
      );
    }

    if (existingUser) {
      return NextResponse.json(
        {
          error: "That email is already in use. Sign in, then join this league with the same invite code from your league page."
        },
        { status: 400 }
      );
    }

    let passwordHash: string;
    try {
      passwordHash = await hashPassword(password);
    } catch (hashErr) {
      console.error("signup hashPassword error", hashErr);
      return NextResponse.json({ error: "Could not hash password. Please try again.", code: "E_HASH" }, { status: 500 });
    }

    let user;
    try {
      user = await prisma.user.create({
        data: {
          displayName,
          email,
          passwordHash,
          isAdmin: isConfiguredAdminEmail(email)
        }
      });
      await addUserToLeague(user.id, league.id);
    } catch (createErr) {
      console.error("signup prisma create error", createErr);
      return NextResponse.json({ error: "Could not create account. Please try again.", code: "E_DB_WRITE" }, { status: 500 });
    }

    let token: string;
    try {
      token = await issueSessionToken({
        sub: user.id,
        email: user.email,
        displayName: user.displayName
      });
    } catch (jwtErr) {
      console.error("signup jwt issue error", jwtErr);
      return NextResponse.json(
        { error: "Could not create session. Check AUTH_SECRET is set on the server.", code: "E_JWT" },
        { status: 500 }
      );
    }

    try {
      const response = NextResponse.json({ ok: true, leagueSlug: league.slug });
      attachSessionCookie(response, token);
      return response;
    } catch (cookieErr) {
      console.error("signup set-cookie error", cookieErr);
      return NextResponse.json(
        { error: "Could not attach session cookie. Try another browser or clear site cookies.", code: "E_COOKIE" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("signup route error", error);
    return NextResponse.json({ error: "Could not create account. Please try again.", code: "E_UNKNOWN" }, { status: 500 });
  }
}
