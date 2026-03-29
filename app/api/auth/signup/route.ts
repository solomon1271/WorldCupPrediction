import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { createSessionCookie } from "@/lib/auth/session";
import { isConfiguredAdminEmail } from "@/lib/auth/admin-email";
import { hashPassword } from "@/lib/auth/password";

const schema = z.object({
  displayName: z.string().trim().min(2, "Display name must be at least 2 characters."),
  email: z.email("Enter a valid email address.").transform((value) => value.toLowerCase()),
  password: z.string().min(8, "Password must be at least 8 characters."),
  inviteCode: z.string().trim().min(1, "Invite code is required.")
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Could not create account." }, { status: 400 });
  }

  const { displayName, email, password, inviteCode } = parsed.data;

  if (inviteCode !== (process.env.INVITE_CODE || "WORLD-CUP-2026")) {
    return NextResponse.json({ error: "Invite code does not match this private league." }, { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return NextResponse.json({ error: "That email is already in use." }, { status: 400 });
  }

  const user = await prisma.user.create({
    data: {
      displayName,
      email,
      passwordHash: await hashPassword(password),
      isAdmin: isConfiguredAdminEmail(email),
      tournamentPrediction: {
        create: {
          groupWinners: "{}"
        }
      }
    }
  });

  await createSessionCookie({
    sub: user.id,
    email: user.email,
    displayName: user.displayName
  });

  return NextResponse.json({ ok: true });
}
