-- CreateTable
CREATE TABLE "TournamentRevealSeen" (
    "id" TEXT NOT NULL,
    "leagueId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "seenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TournamentRevealSeen_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TournamentRevealSeen_userId_idx" ON "TournamentRevealSeen"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TournamentRevealSeen_leagueId_userId_key" ON "TournamentRevealSeen"("leagueId", "userId");

-- AddForeignKey
ALTER TABLE "TournamentRevealSeen" ADD CONSTRAINT "TournamentRevealSeen_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentRevealSeen" ADD CONSTRAINT "TournamentRevealSeen_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
