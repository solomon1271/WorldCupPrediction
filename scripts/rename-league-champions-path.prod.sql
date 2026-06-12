-- Rename league display name to Champion's Path (does not touch predictions or scores)
UPDATE "League"
SET "name" = 'Champion''s Path'
WHERE "slug" IN ('newrez', 'rez-company-world-cup-prediction-challenge');
