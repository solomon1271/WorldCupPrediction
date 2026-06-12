-- Unlock South Korea vs Czech Republic (match id 2) for 1 hour on production.
UPDATE "Match"
SET "predictionUnlockUntil" = NOW() + INTERVAL '1 hour'
WHERE "id" = 2;
