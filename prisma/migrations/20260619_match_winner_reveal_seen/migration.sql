CREATE TABLE "MatchWinnerRevealSeen" (
    "id" TEXT NOT NULL,
    "leagueId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "matchId" INTEGER NOT NULL,
    "seenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MatchWinnerRevealSeen_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "MatchWinnerRevealSeen_leagueId_userId_matchId_key" ON "MatchWinnerRevealSeen"("leagueId", "userId", "matchId");

CREATE INDEX "MatchWinnerRevealSeen_userId_idx" ON "MatchWinnerRevealSeen"("userId");

ALTER TABLE "MatchWinnerRevealSeen" ADD CONSTRAINT "MatchWinnerRevealSeen_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "MatchWinnerRevealSeen" ADD CONSTRAINT "MatchWinnerRevealSeen_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "MatchWinnerRevealSeen" ADD CONSTRAINT "MatchWinnerRevealSeen_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;
