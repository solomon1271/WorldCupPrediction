import { NextResponse } from "next/server";

import { getSessionUser } from "@/lib/auth/session-user";
import { prisma } from "@/lib/prisma";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();

  if (!user?.isAdmin) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const { id } = await params;

  if (user.id === id) {
    return NextResponse.json({ error: "You cannot remove your own account." }, { status: 400 });
  }

  await prisma.user.delete({
    where: { id }
  });

  return NextResponse.json({ ok: true });
}
