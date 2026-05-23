-- CreateTable
CREATE TABLE "LeaderboardState" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "ranksJson" TEXT NOT NULL DEFAULT '{}',
    "previousRanksJson" TEXT NOT NULL DEFAULT '{}',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeaderboardState_pkey" PRIMARY KEY ("id")
);
