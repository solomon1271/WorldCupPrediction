import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { isConfiguredAdminEmail } from "@/lib/auth/admin-email";
import { attachSessionCookie, issueSessionToken } from "@/lib/auth/session";
import { verifyPassword } from "@/lib/auth/password";

export const runtime = "nodejs";

const schema = z.object({
  email: z.email("Enter a valid email address.").transform((value) => value.toLowerCase()),
  password: z.string().min(1, "Password is required.")
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

    const { email, password } = parsed.data;

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
        // Non-fatal: configured admin email still gets access via userHasAdminAccess without this flag.
        console.error("login admin promotion skipped (DB update failed; sign-in continues)", dbErr);
        userForSession = user;
      }
    }

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
      const response = new NextResponse(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "content-type": "application/json; charset=utf-8" }
      });
      attachSessionCookie(response, token);
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
