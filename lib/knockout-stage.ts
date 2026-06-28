/** First knockout fixture (Round of 32). Leaderboard points count from here onward. */
export const KNOCKOUT_FIRST_MATCH_ID = 73;

export function isKnockoutMatchId(matchId: number) {
  return matchId >= KNOCKOUT_FIRST_MATCH_ID;
}

export function isGroupStageMatchId(matchId: number) {
  return matchId < KNOCKOUT_FIRST_MATCH_ID;
}
