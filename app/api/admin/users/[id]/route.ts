import { NextResponse } from "next/server";
import { z } from "zod";

import { getSessionUser } from "@/lib/auth/session-user";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  isAdmin: z.boolean()
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();

  if (!user?.isAdmin) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const { id } = await params;
  const parsed = schema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid user update." }, { status: 400 });
  }

  if (user.id === id && !parsed.data.isAdmin) {
    return NextResponse.json({ error: "You cannot remove your own admin access." }, { status: 400 });
  }

  await prisma.user.update({
    where: { id },
    data: {
      isAdmin: parsed.data.isAdmin
    }
  });

  return NextResponse.json({ ok: true });
}
