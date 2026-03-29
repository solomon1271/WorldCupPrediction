import { NextResponse } from "next/server";

import { getSessionUser } from "@/lib/auth/session-user";
import { prisma } from "@/lib/prisma";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();

  if (!user?.isAdmin) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const { id } = await params;

  await prisma.$transaction([
    prisma.matchPrediction.deleteMany({
      where: { userId: id }
    }),
    prisma.tournamentPrediction.upsert({
      where: { userId: id },
      update: {
        champion: null,
        runnerUp: null,
        goldenBoot: null,
        bestYoungPlayer: null,
        groupWinners: "{}"
      },
      create: {
        userId: id,
        groupWinners: "{}"
      }
    })
  ]);

  return NextResponse.json({ ok: true });
}
