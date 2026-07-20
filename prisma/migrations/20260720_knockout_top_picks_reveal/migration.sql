-- CreateTable
CREATE TABLE "KnockoutRevealSeen" (
    "id" TEXT NOT NULL,
    "leagueId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "seenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KnockoutRevealSeen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TopPicksRevealSeen" (
    "id" TEXT NOT NULL,
    "leagueId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "seenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TopPicksRevealSeen_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "KnockoutRevealSeen_userId_idx" ON "KnockoutRevealSeen"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "KnockoutRevealSeen_leagueId_userId_key" ON "KnockoutRevealSeen"("leagueId", "userId");

-- CreateIndex
CREATE INDEX "TopPicksRevealSeen_userId_idx" ON "TopPicksRevealSeen"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TopPicksRevealSeen_leagueId_userId_key" ON "TopPicksRevealSeen"("leagueId", "userId");

-- AddForeignKey
ALTER TABLE "KnockoutRevealSeen" ADD CONSTRAINT "KnockoutRevealSeen_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnockoutRevealSeen" ADD CONSTRAINT "KnockoutRevealSeen_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopPicksRevealSeen" ADD CONSTRAINT "TopPicksRevealSeen_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopPicksRevealSeen" ADD CONSTRAINT "TopPicksRevealSeen_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
