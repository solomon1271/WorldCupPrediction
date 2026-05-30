import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

const DEFAULT_LEAGUE_ID = "clleague00000000000000001";

async function tableExists(name: string) {
  const rows = await prisma.$queryRaw<Array<{ name: string }>>`
    SELECT name FROM sqlite_master WHERE type = 'table' AND name = ${name}
  `;
  return rows.length > 0;
}

async function columnExists(table: string, column: string) {
  const rows = await prisma.$queryRawUnsafe<Array<{ name: string }>>(`PRAGMA table_info("${table}")`);
  return rows.some((row) => row.name === column);
}

async function main() {
  const hasLeagueTable = await tableExists("League");

  if (hasLeagueTable && (await columnExists("LeaderboardState", "leagueId"))) {
    console.log("Multi-league schema already backfilled.");
    return;
  }

  const defaultInvite = process.env.INVITE_CODE?.trim().toLowerCase() || "newrez-invite-code";
  let leagueId = DEFAULT_LEAGUE_ID;

  if (!hasLeagueTable) {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE "League" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "slug" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "inviteCode" TEXT NOT NULL,
        "subtitle" TEXT NOT NULL DEFAULT '2026 World Cup Challenge',
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL
      );
      CREATE UNIQUE INDEX "League_slug_key" ON "League"("slug");
      CREATE UNIQUE INDEX "League_inviteCode_key" ON "League"("inviteCode");

      INSERT INTO "League" ("id", "slug", "name", "inviteCode", "subtitle", "updatedAt")
      VALUES ('${DEFAULT_LEAGUE_ID}', 'newrez', 'NewRez World Cup Prediction', '${defaultInvite}', '2026 World Cup Challenge', CURRENT_TIMESTAMP);
    `);
  } else {
    const leagues = await prisma.$queryRaw<Array<{ id: string }>>`SELECT "id" FROM "League" WHERE "slug" = 'newrez' LIMIT 1`;
    leagueId = leagues[0]?.id || DEFAULT_LEAGUE_ID;
  }

  if (!(await tableExists("LeagueMember"))) {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE "LeagueMember" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "leagueId" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("leagueId") REFERENCES "League" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
      CREATE UNIQUE INDEX "LeagueMember_leagueId_userId_key" ON "LeagueMember"("leagueId", "userId");
      CREATE INDEX "LeagueMember_userId_idx" ON "LeagueMember"("userId");
    `);
  }

  const users = await prisma.user.findMany({ select: { id: true, createdAt: true } });

  for (const user of users) {
    await prisma.$executeRawUnsafe(`
      INSERT OR IGNORE INTO "LeagueMember" ("id", "leagueId", "userId", "joinedAt")
      VALUES ('clmember${user.id.slice(0, 16)}', '${leagueId}', '${user.id}', '${user.createdAt.toISOString()}');
    `);
  }

  if (!(await columnExists("MatchPrediction", "leagueId"))) {
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "MatchPrediction" ADD COLUMN "leagueId" TEXT;
      UPDATE "MatchPrediction" SET "leagueId" = '${leagueId}';
    `);
  }

  if (!(await columnExists("TournamentPrediction", "leagueId"))) {
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "TournamentPrediction" ADD COLUMN "leagueId" TEXT;
      UPDATE "TournamentPrediction" SET "leagueId" = '${leagueId}';
    `);
  }

  if (!(await columnExists("LeaderboardState", "leagueId"))) {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE "LeaderboardState_new" (
        "leagueId" TEXT NOT NULL PRIMARY KEY,
        "ranksJson" TEXT NOT NULL DEFAULT '{}',
        "previousRanksJson" TEXT NOT NULL DEFAULT '{}',
        "updatedAt" DATETIME NOT NULL,
        FOREIGN KEY ("leagueId") REFERENCES "League" ("id") ON DELETE CASCADE ON UPDATE CASCADE
      );

      INSERT INTO "LeaderboardState_new" ("leagueId", "ranksJson", "previousRanksJson", "updatedAt")
      SELECT '${leagueId}', COALESCE("ranksJson", '{}'), COALESCE("previousRanksJson", '{}'), COALESCE("updatedAt", CURRENT_TIMESTAMP)
      FROM "LeaderboardState";

      INSERT OR IGNORE INTO "LeaderboardState_new" ("leagueId", "ranksJson", "previousRanksJson", "updatedAt")
      VALUES ('${leagueId}', '{}', '{}', CURRENT_TIMESTAMP);

      DROP TABLE "LeaderboardState";
      ALTER TABLE "LeaderboardState_new" RENAME TO "LeaderboardState";
    `);
  }

  console.log(`Backfill complete. Default league slug: newrez (invite: ${defaultInvite}).`);
  console.log("Next: run `npm run db:push` to align indexes/constraints with the Prisma schema.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
