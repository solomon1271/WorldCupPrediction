-- Tournament prep reset (Neon SQL Editor)
-- Removes cron/test fixtures, restores Match 1, clears all official results, and wipes rank snapshots.

DELETE FROM "MatchPrediction"
WHERE "matchId" IN (1, 9001, 9002, 9003);

DELETE FROM "Match"
WHERE "id" IN (9001, 9002, 9003);

UPDATE "Match"
SET
  "stage" = 'Group A',
  "kickoff" = '2026-06-11T19:00:00.000Z',
  "venue" = 'Estadio Azteca, Mexico City',
  "homeTeam" = 'Mexico',
  "awayTeam" = 'South Africa',
  "isLocked" = false,
  "finalHomeScore" = NULL,
  "finalAwayScore" = NULL,
  "finalYellowCards" = NULL,
  "finalTotalCorners" = NULL,
  "finalRedCards" = NULL
WHERE "id" = 1;

UPDATE "Match"
SET
  "isLocked" = false,
  "finalHomeScore" = NULL,
  "finalAwayScore" = NULL,
  "finalYellowCards" = NULL,
  "finalTotalCorners" = NULL,
  "finalRedCards" = NULL;

DELETE FROM "LeaderboardState";
