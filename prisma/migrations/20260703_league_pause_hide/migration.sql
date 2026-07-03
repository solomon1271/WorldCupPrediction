-- AlterTable
ALTER TABLE "League" ADD COLUMN "isPaused" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "League" ADD COLUMN "isHidden" BOOLEAN NOT NULL DEFAULT false;

-- Pause and hide Champion's Path
UPDATE "League" SET "isPaused" = true, "isHidden" = true WHERE "slug" = 'newrez';
