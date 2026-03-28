import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth/session-user";

const schema = z.object({
  champion: z.string().trim().min(2),
  runnerUp: z.string().trim().min(2),
  goldenBoot: z.string().trim().min(2),
  bestYoungPlayer: z.string().trim().min(2)
});

export async function POST(request: Request) {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid tournament prediction." }, { status: 400 });
  }

  await prisma.tournamentPrediction.upsert({
    where: { userId: user.id },
    update: {
      champion: parsed.data.champion,
      runnerUp: parsed.data.runnerUp,
      goldenBoot: parsed.data.goldenBoot,
      bestYoungPlayer: parsed.data.bestYoungPlayer
    },
    create: {
      userId: user.id,
      champion: parsed.data.champion,
      runnerUp: parsed.data.runnerUp,
      goldenBoot: parsed.data.goldenBoot,
      bestYoungPlayer: parsed.data.bestYoungPlayer,
      groupWinners: "{}"
    }
  });

  return NextResponse.json({ ok: true });
}
