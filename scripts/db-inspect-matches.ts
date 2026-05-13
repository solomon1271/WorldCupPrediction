import { PrismaClient } from "../generated/prisma";

/**
 * Read-only check against the DB pointed to by DATABASE_URL.
 * Use the same postgresql URL as Vercel Production (Settings → Environment Variables).
 *
 *   DATABASE_URL='postgresql://…' npm run db:inspect:prod
 *
 * If MATCH_SYNC_URL is set in your shell or .env, it does not affect this script.
 */

function describeTarget(url: string): string {
  try {
    const u = new URL(url);
    return `${u.hostname}${u.pathname || ""}`;
  } catch {
    return "(unparseable DATABASE_URL)";
  }
}

async function main() {
  const raw = process.env.DATABASE_URL?.trim();
  if (!raw || raw.startsWith("file:")) {
    console.error("Set DATABASE_URL to your Neon URL, e.g. DATABASE_URL='postgresql://…' npm run db:inspect:prod");
    process.exit(1);
  }

  console.log("Target:", describeTarget(raw));

  const prisma = new PrismaClient();
  const count = await prisma.match.count();
  const sample = await prisma.match.findMany({
    take: 3,
    orderBy: { id: "asc" },
    select: { id: true, homeTeam: true, awayTeam: true }
  });
  const m2 = await prisma.match.findUnique({
    where: { id: 2 },
    select: { id: true, homeTeam: true, awayTeam: true, stage: true }
  });

  console.log(JSON.stringify({ matchRowCount: count, firstRowsById: sample, matchId2: m2 }, null, 2));
  await prisma.$disconnect();
}

main().catch(async (error) => {
  console.error(error);
  process.exit(1);
});
