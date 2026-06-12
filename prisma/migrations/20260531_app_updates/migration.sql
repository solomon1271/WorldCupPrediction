-- AlterTable
ALTER TABLE "Match" ADD COLUMN "predictionUnlockUntil" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "League" ADD COLUMN "officialAwardsJson" TEXT NOT NULL DEFAULT '{}';

-- AlterTable
ALTER TABLE "TournamentPrediction" ADD COLUMN "goldenGlove" TEXT;
ALTER TABLE "TournamentPrediction" ADD COLUMN "bestPlayer" TEXT;

-- Rename default league display name (does not touch predictions or scores)
UPDATE "League"
SET "name" = 'Champion''s Path'
WHERE "slug" IN ('newrez', 'rez-company-world-cup-prediction-challenge');
