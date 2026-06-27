CREATE TABLE "GroupStageRevealSeen" (
    "id" TEXT NOT NULL,
    "leagueId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "seenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GroupStageRevealSeen_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "GroupStageRevealSeen_leagueId_userId_key" ON "GroupStageRevealSeen"("leagueId", "userId");
CREATE INDEX "GroupStageRevealSeen_userId_idx" ON "GroupStageRevealSeen"("userId");

ALTER TABLE "GroupStageRevealSeen" ADD CONSTRAINT "GroupStageRevealSeen_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "GroupStageRevealSeen" ADD CONSTRAINT "GroupStageRevealSeen_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
