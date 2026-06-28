-- CreateTable
CREATE TABLE "KnockoutLeaderboardState" (
    "leagueId" TEXT NOT NULL,
    "ranksJson" TEXT NOT NULL DEFAULT '{}',
    "previousRanksJson" TEXT NOT NULL DEFAULT '{}',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KnockoutLeaderboardState_pkey" PRIMARY KEY ("leagueId")
);

-- AddForeignKey
ALTER TABLE "KnockoutLeaderboardState" ADD CONSTRAINT "KnockoutLeaderboardState_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League"("id") ON DELETE CASCADE ON UPDATE CASCADE;
