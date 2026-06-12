import { prisma } from "@/lib/prisma";

export async function unlockMatchPredictions(matchId: number, options?: { hours?: number }) {
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    select: {
      id: true,
      homeTeam: true,
      awayTeam: true,
      kickoff: true,
      isLocked: true,
      predictionUnlockUntil: true
    }
  });

  if (!match) {
    throw new Error(`Match ${matchId} not found.`);
  }

  const hours = options?.hours;
  const predictionUnlockUntil =
    hours !== undefined
      ? new Date(Date.now() + hours * 60 * 60 * 1000)
      : match.kickoff;

  const updated = await prisma.match.update({
    where: { id: matchId },
    data: {
      isLocked: false,
      predictionUnlockUntil
    },
    select: {
      id: true,
      homeTeam: true,
      awayTeam: true,
      kickoff: true,
      isLocked: true,
      predictionUnlockUntil: true
    }
  });

  return {
    match: updated,
    predictionUnlockUntil: predictionUnlockUntil.toISOString(),
    mode: hours !== undefined ? (`${hours}-hour window` as const) : ("until kickoff" as const)
  };
}
