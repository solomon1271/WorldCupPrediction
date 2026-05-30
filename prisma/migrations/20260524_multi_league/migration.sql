-- CreateTable
CREATE TABLE "League" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "inviteCode" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL DEFAULT '2026 World Cup Challenge',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "League_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeagueMember" (
    "id" TEXT NOT NULL,
    "leagueId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeagueMember_pkey" PRIMARY KEY ("id")
);

-- Seed default league for existing production data
INSERT INTO "League" ("id", "slug", "name", "inviteCode", "subtitle", "updatedAt")
VALUES (
    'clleague00000000000000001',
    'newrez',
    'NewRez World Cup Prediction',
    'newrez-invite-code',
    '2026 World Cup Challenge',
    CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "League_slug_key" ON "League"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "League_inviteCode_key" ON "League"("inviteCode");

-- CreateIndex
CREATE INDEX "LeagueMember_userId_idx" ON "LeagueMember"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "LeagueMember_leagueId_userId_key" ON "LeagueMember"("leagueId", "userId");

-- AddForeignKey
ALTER TABLE "LeagueMember" ADD CONSTRAINT "LeagueMember_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeagueMember" ADD CONSTRAINT "LeagueMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Backfill league membership for existing users
INSERT INTO "LeagueMember" ("id", "leagueId", "userId", "joinedAt")
SELECT
    'clmember' || substr(md5("User"."id"), 1, 20),
    'clleague00000000000000001',
    "User"."id",
    "User"."createdAt"
FROM "User";

-- MatchPrediction: add league scope
ALTER TABLE "MatchPrediction" ADD COLUMN "leagueId" TEXT;

UPDATE "MatchPrediction"
SET "leagueId" = 'clleague00000000000000001'
WHERE "leagueId" IS NULL;

ALTER TABLE "MatchPrediction" ALTER COLUMN "leagueId" SET NOT NULL;

DROP INDEX IF EXISTS "MatchPrediction_userId_matchId_key";

CREATE UNIQUE INDEX "MatchPrediction_leagueId_userId_matchId_key" ON "MatchPrediction"("leagueId", "userId", "matchId");

ALTER TABLE "MatchPrediction" ADD CONSTRAINT "MatchPrediction_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- TournamentPrediction: add league scope
ALTER TABLE "TournamentPrediction" ADD COLUMN "leagueId" TEXT;

UPDATE "TournamentPrediction"
SET "leagueId" = 'clleague00000000000000001'
WHERE "leagueId" IS NULL;

ALTER TABLE "TournamentPrediction" ALTER COLUMN "leagueId" SET NOT NULL;

DROP INDEX IF EXISTS "TournamentPrediction_userId_key";

CREATE UNIQUE INDEX "TournamentPrediction_leagueId_userId_key" ON "TournamentPrediction"("leagueId", "userId");

ALTER TABLE "TournamentPrediction" ADD CONSTRAINT "TournamentPrediction_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- LeaderboardState: one row per league
CREATE TABLE "LeaderboardState_new" (
    "leagueId" TEXT NOT NULL,
    "ranksJson" TEXT NOT NULL DEFAULT '{}',
    "previousRanksJson" TEXT NOT NULL DEFAULT '{}',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeaderboardState_new_pkey" PRIMARY KEY ("leagueId")
);

INSERT INTO "LeaderboardState_new" ("leagueId", "ranksJson", "previousRanksJson", "updatedAt")
SELECT
    'clleague00000000000000001',
    COALESCE("ranksJson", '{}'),
    COALESCE("previousRanksJson", '{}'),
    COALESCE("updatedAt", CURRENT_TIMESTAMP)
FROM "LeaderboardState"
WHERE "id" = 1;

INSERT INTO "LeaderboardState_new" ("leagueId", "ranksJson", "previousRanksJson", "updatedAt")
SELECT
    'clleague00000000000000001',
    '{}',
    '{}',
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM "LeaderboardState" WHERE "id" = 1
);

DROP TABLE "LeaderboardState";

ALTER TABLE "LeaderboardState_new" RENAME TO "LeaderboardState";

ALTER TABLE "LeaderboardState" ADD CONSTRAINT "LeaderboardState_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League"("id") ON DELETE CASCADE ON UPDATE CASCADE;
