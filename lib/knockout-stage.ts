/** First knockout fixture (Round of 32). */
export const ROUND_OF_32_FIRST_MATCH_ID = 73;

/** First Round of 16 fixture — active knockout leaderboard counts from here onward. */
export const ROUND_OF_16_FIRST_MATCH_ID = 89;

/** @deprecated Use ROUND_OF_32_FIRST_MATCH_ID */
export const KNOCKOUT_FIRST_MATCH_ID = ROUND_OF_32_FIRST_MATCH_ID;

/** Colombia vs Ghana — final Round of 32 fixture in the official schedule. */
export const ROUND_OF_32_FINALE_MATCH_ID = 88;

export function isGroupStageMatchId(matchId: number) {
  return matchId < ROUND_OF_32_FIRST_MATCH_ID;
}

export function isRoundOf32MatchId(matchId: number) {
  return matchId >= ROUND_OF_32_FIRST_MATCH_ID && matchId < ROUND_OF_16_FIRST_MATCH_ID;
}

export function isActiveKnockoutMatchId(matchId: number) {
  return matchId >= ROUND_OF_16_FIRST_MATCH_ID;
}

export function isKnockoutMatchId(matchId: number) {
  return matchId >= ROUND_OF_32_FIRST_MATCH_ID;
}
