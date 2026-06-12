-- Open South Korea vs Czech Republic (match id 2) for predictions until kickoff.
-- Safe: only updates lock fields on one match; does not touch predictions or scores.
UPDATE "Match"
SET
  "isLocked" = false,
  "predictionUnlockUntil" = "kickoff"
WHERE "id" = 2;
