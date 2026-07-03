#!/usr/bin/env tsx

import { getAppTimezone } from "@/lib/match-urgency";
import {
  buildTournamentPicksUnlockUntilIso,
  formatTournamentPicksUnlockUntilLabel,
  isTournamentPicksLocked,
  isTournamentPicksTemporarilyUnlocked
} from "@/lib/tournament-lock";

const hoursArg = process.argv.find((arg) => arg.startsWith("--hours="));
const hours = Number.parseFloat(hoursArg?.split("=")[1] || process.env.UNLOCK_HOURS || "48");

if (!Number.isFinite(hours) || hours <= 0) {
  throw new Error("Set --hours=48 or UNLOCK_HOURS to a positive number.");
}

const unlockUntilIso = buildTournamentPicksUnlockUntilIso(hours);
const timeZone = getAppTimezone();

process.env.TOURNAMENT_PICKS_UNLOCK_UNTIL = unlockUntilIso;

console.log(
  JSON.stringify(
    {
      ok: true,
      hours,
      unlockUntil: unlockUntilIso,
      unlockUntilLabel: formatTournamentPicksUnlockUntilLabel(timeZone),
      currentlyOpen: !isTournamentPicksLocked(new Date(), timeZone),
      temporarilyUnlocked: isTournamentPicksTemporarilyUnlocked(),
      env: {
        TOURNAMENT_PICKS_UNLOCK_UNTIL: unlockUntilIso
      },
      note: `Set TOURNAMENT_PICKS_UNLOCK_UNTIL on Vercel (Production), redeploy, then remove it after ${formatTournamentPicksUnlockUntilLabel(timeZone)} to lock again.`
    },
    null,
    2
  )
);
