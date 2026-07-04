-- CreateTable
CREATE TABLE "RoundOf32LeaderboardState" (
    "leagueId" TEXT NOT NULL,
    "ranksJson" TEXT NOT NULL DEFAULT '{}',
    "previousRanksJson" TEXT NOT NULL DEFAULT '{}',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoundOf32LeaderboardState_pkey" PRIMARY KEY ("leagueId")
);

-- CreateTable
CREATE TABLE "RoundOf32RevealSeen" (
    "id" TEXT NOT NULL,
    "leagueId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "seenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RoundOf32RevealSeen_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RoundOf32RevealSeen_userId_idx" ON "RoundOf32RevealSeen"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "RoundOf32RevealSeen_leagueId_userId_key" ON "RoundOf32RevealSeen"("leagueId", "userId");

-- AddForeignKey
ALTER TABLE "RoundOf32LeaderboardState" ADD CONSTRAINT "RoundOf32LeaderboardState_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoundOf32RevealSeen" ADD CONSTRAINT "RoundOf32RevealSeen_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoundOf32RevealSeen" ADD CONSTRAINT "RoundOf32RevealSeen_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
