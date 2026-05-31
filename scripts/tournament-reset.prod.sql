-- Tournament prep reset (Neon SQL Editor)
-- Restores Match 1 (Mexico vs South Africa), removes test fixtures,
-- clears ALL match picks + leaderboard snapshots, and resets tournament picks.

DELETE FROM "MatchPrediction";

DELETE FROM "LeaderboardState";

UPDATE "TournamentPrediction"
SET
  "champion" = NULL,
  "runnerUp" = NULL,
  "goldenBoot" = NULL,
  "bestYoungPlayer" = NULL,
  "groupWinners" = '{}';

DELETE FROM "Match"
WHERE "id" IN (9001, 9002, 9003);

INSERT INTO "Match" (
  "id",
  "stage",
  "kickoff",
  "venue",
  "homeTeam",
  "awayTeam",
  "isLocked",
  "finalHomeScore",
  "finalAwayScore",
  "finalYellowCards",
  "finalTotalCorners",
  "finalRedCards",
  "createdAt",
  "updatedAt"
)
VALUES (
  1,
  'Group A',
  '2026-06-11T19:00:00.000Z',
  'Estadio Azteca, Mexico City',
  'Mexico',
  'South Africa',
  false,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT ("id") DO UPDATE SET
  "stage" = EXCLUDED."stage",
  "kickoff" = EXCLUDED."kickoff",
  "venue" = EXCLUDED."venue",
  "homeTeam" = EXCLUDED."homeTeam",
  "awayTeam" = EXCLUDED."awayTeam",
  "isLocked" = false,
  "finalHomeScore" = NULL,
  "finalAwayScore" = NULL,
  "finalYellowCards" = NULL,
  "finalTotalCorners" = NULL,
  "finalRedCards" = NULL,
  "updatedAt" = NOW();

UPDATE "Match"
SET
  "isLocked" = false,
  "finalHomeScore" = NULL,
  "finalAwayScore" = NULL,
  "finalYellowCards" = NULL,
  "finalTotalCorners" = NULL,
  "finalRedCards" = NULL;
