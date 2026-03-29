import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { isConfiguredAdminEmail } from "@/lib/auth/admin-email";
import { createSessionCookie } from "@/lib/auth/session";
import { verifyPassword } from "@/lib/auth/password";

const schema = z.object({
  email: z.email("Enter a valid email address.").transform((value) => value.toLowerCase()),
  password: z.string().min(1, "Password is required.")
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Could not sign in." }, { status: 400 });
  }

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return NextResponse.json({ error: "No account exists for that email." }, { status: 404 });
  }

  const passwordMatches = await verifyPassword(password, user.passwordHash);

  if (!passwordMatches) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 400 });
  }

  const userForSession =
    !user.isAdmin && isConfiguredAdminEmail(user.email)
      ? await prisma.user.update({
          where: { id: user.id },
          data: { isAdmin: true }
        })
      : user;

  await createSessionCookie({
    sub: userForSession.id,
    email: userForSession.email,
    displayName: userForSession.displayName
  });

  return NextResponse.json({ ok: true });
}
