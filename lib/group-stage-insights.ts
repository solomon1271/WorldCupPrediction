import { isGroupStageMatchId } from "@/lib/knockout-stage";
import {
  deriveWinnerFromScores,
  getPredictionScoreBreakdown,
  normalizeRedCardsLine,
  normalizeThresholdLine,
  scorePrediction,
  type PredictionInput
} from "@/lib/match-scoring";
import { prisma } from "@/lib/prisma";

export type GroupStageInsightCategory =
  | "perfect"
  | "unicorn-exact"
  | "bizarre"
  | "lone-upset"
  | "stat-oracle"
  | "sharpshooter"
  | "consensus-miss";

export type GroupStageInsight = {
  id: string;
  category: GroupStageInsightCategory;
  emoji: string;
  title: string;
  headline: string;
  detail: string;
  playerName: string;
  matchId?: number;
  matchLabel?: string;
  points?: number;
};

type EvaluatedPick = {
  userId: string;
  playerName: string;
  matchId: number;
  homeTeam: string;
  awayTeam: string;
  finalHomeScore: number;
  finalAwayScore: number;
  prediction: PredictionInput;
  points: number;
  exact: boolean;
  outcome: boolean;
  breakdownHits: number;
  breakdownPossible: number;
  scoreDiff: number;
  actualWinner: string;
  statHits: string[];
};

function toPredictionInput(prediction: {
  winner: string;
  homeScore: number | null;
  awayScore: number | null;
  totalGoalsLine: string;
  totalCornersLine: string;
  yellowCardsLine: string;
  redCardsLine: string;
}): PredictionInput {
  return {
    winner: prediction.winner,
    homeScore: prediction.homeScore,
    awayScore: prediction.awayScore,
    totalGoalsLine: normalizeThresholdLine(prediction.totalGoalsLine),
    totalCornersLine: normalizeThresholdLine(prediction.totalCornersLine),
    yellowCardsLine: normalizeThresholdLine(prediction.yellowCardsLine),
    redCardsLine: normalizeRedCardsLine(prediction.redCardsLine)
  };
}

function formatScore(home: number | null, away: number | null) {
  if (home === null || away === null) {
    return "—";
  }

  return `${home}–${away}`;
}

function formatMatchLabel(homeTeam: string, awayTeam: string) {
  return `${homeTeam} vs ${awayTeam}`;
}

function evaluatePick(
  prediction: PredictionInput,
  match: {
    id: number;
    homeTeam: string;
    awayTeam: string;
    finalHomeScore: number;
    finalAwayScore: number;
    finalYellowCards: number | null;
    finalTotalCorners: number | null;
    finalRedCards: number | null;
  },
  playerName: string,
  userId: string
): EvaluatedPick {
  const score = scorePrediction(prediction, match);
  const breakdown = getPredictionScoreBreakdown(prediction, match);
  const recordedItems = breakdown?.items.filter((item) => item.resultLabel !== "Not recorded") ?? [];
  const statHits = recordedItems
    .filter((item) => item.hit && item.label !== "Your score" && item.label !== "Winner")
    .map((item) => item.label);

  const predictedHome = prediction.homeScore ?? 0;
  const predictedAway = prediction.awayScore ?? 0;

  return {
    userId,
    playerName,
    matchId: match.id,
    homeTeam: match.homeTeam,
    awayTeam: match.awayTeam,
    finalHomeScore: match.finalHomeScore,
    finalAwayScore: match.finalAwayScore,
    prediction,
    points: score.points,
    exact: score.exact === 1,
    outcome: score.outcome === 1,
    breakdownHits: recordedItems.filter((item) => item.hit).length,
    breakdownPossible: recordedItems.length,
    scoreDiff: Math.abs(predictedHome - match.finalHomeScore) + Math.abs(predictedAway - match.finalAwayScore),
    actualWinner: deriveWinnerFromScores(
      match.finalHomeScore,
      match.finalAwayScore,
      match.homeTeam,
      match.awayTeam
    ),
    statHits
  };
}

function pickBest<T>(items: T[], score: (item: T) => number) {
  return items.reduce<T | null>((best, item) => {
    if (!best) {
      return item;
    }

    return score(item) > score(best) ? item : best;
  }, null);
}

function dedupeInsights(insights: GroupStageInsight[]) {
  const seen = new Set<string>();
  const result: GroupStageInsight[] = [];

  for (const insight of insights) {
    const key = `${insight.category}:${insight.playerName}:${insight.matchId ?? "none"}`;
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    result.push(insight);
  }

  return result;
}

export async function buildGroupStageInsights(leagueId: string): Promise<GroupStageInsight[]> {
  const predictions = await prisma.matchPrediction.findMany({
    where: { leagueId },
    include: {
      match: true,
      user: {
        select: {
          id: true,
          displayName: true
        }
      }
    }
  });

  const finishedGroupPicks = predictions
    .filter(
      (entry) =>
        isGroupStageMatchId(entry.matchId) &&
        entry.match.finalHomeScore !== null &&
        entry.match.finalAwayScore !== null
    )
    .map((entry) =>
      evaluatePick(
        toPredictionInput(entry),
        {
          id: entry.match.id,
          homeTeam: entry.match.homeTeam,
          awayTeam: entry.match.awayTeam,
          finalHomeScore: entry.match.finalHomeScore as number,
          finalAwayScore: entry.match.finalAwayScore as number,
          finalYellowCards: entry.match.finalYellowCards,
          finalTotalCorners: entry.match.finalTotalCorners,
          finalRedCards: entry.match.finalRedCards
        },
        entry.user.displayName,
        entry.user.id
      )
    );

  if (finishedGroupPicks.length === 0) {
    return [];
  }

  const exactCountsByMatch = new Map<number, number>();
  const winnerCorrectByMatch = new Map<number, number>();
  const predictionsByMatch = new Map<number, EvaluatedPick[]>();
  const exactCountsByUser = new Map<string, { name: string; count: number }>();
  const statHitCounts = new Map<number, Map<string, number>>();

  for (const pick of finishedGroupPicks) {
    exactCountsByMatch.set(pick.matchId, (exactCountsByMatch.get(pick.matchId) ?? 0) + (pick.exact ? 1 : 0));
    winnerCorrectByMatch.set(
      pick.matchId,
      (winnerCorrectByMatch.get(pick.matchId) ?? 0) + (pick.outcome ? 1 : 0)
    );

    const matchPicks = predictionsByMatch.get(pick.matchId) ?? [];
    matchPicks.push(pick);
    predictionsByMatch.set(pick.matchId, matchPicks);

    const userExact = exactCountsByUser.get(pick.userId) ?? { name: pick.playerName, count: 0 };
    userExact.count += pick.exact ? 1 : 0;
    exactCountsByUser.set(pick.userId, userExact);

    for (const statLabel of pick.statHits) {
      const matchStats = statHitCounts.get(pick.matchId) ?? new Map<string, number>();
      matchStats.set(statLabel, (matchStats.get(statLabel) ?? 0) + 1);
      statHitCounts.set(pick.matchId, matchStats);
    }
  }

  const candidates: GroupStageInsight[] = [];

  const bestPerfectPick = pickBest(
    finishedGroupPicks.filter((pick) => pick.breakdownPossible >= 4 && pick.breakdownHits === pick.breakdownPossible),
    (pick) => pick.points
  );
  if (bestPerfectPick) {
    candidates.push({
      id: `perfect-${bestPerfectPick.userId}-${bestPerfectPick.matchId}`,
      category: "perfect",
      emoji: "🎯",
      title: "Perfect prediction",
      headline: `${bestPerfectPick.playerName} nailed every recorded line`,
      detail: `Called ${formatScore(bestPerfectPick.prediction.homeScore, bestPerfectPick.prediction.awayScore)} in ${formatMatchLabel(bestPerfectPick.homeTeam, bestPerfectPick.awayTeam)} — score, winner, and every bonus stat that was recorded (${bestPerfectPick.points} pts).`,
      playerName: bestPerfectPick.playerName,
      matchId: bestPerfectPick.matchId,
      matchLabel: formatMatchLabel(bestPerfectPick.homeTeam, bestPerfectPick.awayTeam),
      points: bestPerfectPick.points
    });
  }

  const bestUnicornPick = pickBest(
    finishedGroupPicks.filter((pick) => pick.exact && (exactCountsByMatch.get(pick.matchId) ?? 0) === 1),
    (pick) => pick.points
  );
  if (bestUnicornPick) {
    candidates.push({
      id: `unicorn-${bestUnicornPick.userId}-${bestUnicornPick.matchId}`,
      category: "unicorn-exact",
      emoji: "🦄",
      title: "League-only exact score",
      headline: `${bestUnicornPick.playerName} was the only manager with the exact score`,
      detail: `${formatMatchLabel(bestUnicornPick.homeTeam, bestUnicornPick.awayTeam)} finished ${formatScore(bestUnicornPick.finalHomeScore, bestUnicornPick.finalAwayScore)} — nobody else in the league got it spot on.`,
      playerName: bestUnicornPick.playerName,
      matchId: bestUnicornPick.matchId,
      matchLabel: formatMatchLabel(bestUnicornPick.homeTeam, bestUnicornPick.awayTeam),
      points: bestUnicornPick.points
    });
  }

  const bestBizarrePick = pickBest(
    finishedGroupPicks.filter((pick) => !pick.outcome && pick.scoreDiff >= 5),
    (pick) => pick.scoreDiff
  );
  if (bestBizarrePick) {
    candidates.push({
      id: `bizarre-${bestBizarrePick.userId}-${bestBizarrePick.matchId}`,
      category: "bizarre",
      emoji: "🎪",
      title: "Most bizarre miss",
      headline: `${bestBizarrePick.playerName} predicted a completely different universe`,
      detail: `Picked ${formatScore(bestBizarrePick.prediction.homeScore, bestBizarrePick.prediction.awayScore)} with ${bestBizarrePick.prediction.winner} winning in ${formatMatchLabel(bestBizarrePick.homeTeam, bestBizarrePick.awayTeam)}, but the final was ${formatScore(bestBizarrePick.finalHomeScore, bestBizarrePick.finalAwayScore)} (${bestBizarrePick.actualWinner}).`,
      playerName: bestBizarrePick.playerName,
      matchId: bestBizarrePick.matchId,
      matchLabel: formatMatchLabel(bestBizarrePick.homeTeam, bestBizarrePick.awayTeam)
    });
  }

  const bestLoneUpsetPick = pickBest(
    finishedGroupPicks.filter((pick) => {
      const matchPicks = predictionsByMatch.get(pick.matchId) ?? [];
      return pick.outcome && (winnerCorrectByMatch.get(pick.matchId) ?? 0) === 1 && matchPicks.length >= 4;
    }),
    (pick) => pick.points
  );
  if (bestLoneUpsetPick) {
    const matchPicks = predictionsByMatch.get(bestLoneUpsetPick.matchId) ?? [];
    candidates.push({
      id: `lone-upset-${bestLoneUpsetPick.userId}-${bestLoneUpsetPick.matchId}`,
      category: "lone-upset",
      emoji: "🔮",
      title: "Sole upset caller",
      headline: `${bestLoneUpsetPick.playerName} was the only manager who saw ${bestLoneUpsetPick.actualWinner} winning`,
      detail: `One correct winner pick out of ${matchPicks.length} managers in ${formatMatchLabel(bestLoneUpsetPick.homeTeam, bestLoneUpsetPick.awayTeam)}. Final score: ${formatScore(bestLoneUpsetPick.finalHomeScore, bestLoneUpsetPick.finalAwayScore)}.`,
      playerName: bestLoneUpsetPick.playerName,
      matchId: bestLoneUpsetPick.matchId,
      matchLabel: formatMatchLabel(bestLoneUpsetPick.homeTeam, bestLoneUpsetPick.awayTeam),
      points: bestLoneUpsetPick.points
    });
  }

  for (const pick of finishedGroupPicks) {
    for (const statLabel of pick.statHits) {
      const hitCount = statHitCounts.get(pick.matchId)?.get(statLabel) ?? 0;
      if (hitCount !== 1) {
        continue;
      }

      candidates.push({
        id: `stat-${pick.userId}-${pick.matchId}-${statLabel}`,
        category: "stat-oracle",
        emoji: "🧠",
        title: "Stat oracle",
        headline: `${pick.playerName} alone cracked ${statLabel.toLowerCase()}`,
        detail: `The only manager in the league to hit ${statLabel.toLowerCase()} in ${formatMatchLabel(pick.homeTeam, pick.awayTeam)}.`,
        playerName: pick.playerName,
        matchId: pick.matchId,
        matchLabel: formatMatchLabel(pick.homeTeam, pick.awayTeam),
        points: pick.points
      });
    }
  }

  const bestSharpshooter = pickBest(
    [...exactCountsByUser.entries()].filter(([, entry]) => entry.count >= 2),
    ([, entry]) => entry.count
  );
  if (bestSharpshooter) {
    const [, entry] = bestSharpshooter;
    const [userId] = bestSharpshooter;
    candidates.push({
      id: `sharpshooter-${userId}`,
      category: "sharpshooter",
      emoji: "🏆",
      title: "Group stage sharpshooter",
      headline: `${entry.name} led the league on exact scores`,
      detail: `${entry.count} perfect scorelines across the group stage — more than anyone else in the league.`,
      playerName: entry.name,
      points: entry.count
    });
  }

  const bestConsensusMiss = pickBest(
    [...predictionsByMatch.entries()]
      .filter(([matchId, matchPicks]) => (winnerCorrectByMatch.get(matchId) ?? 0) === 0 && matchPicks.length >= 4)
      .map(([matchId, matchPicks]) => {
        const sample = matchPicks[0];
        return {
          matchId,
          total: matchPicks.length,
          sample
        };
      }),
    (entry) => entry.total
  );
  if (bestConsensusMiss) {
    const { sample, matchId, total } = bestConsensusMiss;
    candidates.push({
      id: `consensus-${matchId}`,
      category: "consensus-miss",
      emoji: "😬",
      title: "Total group whiff",
      headline: `Every manager missed the winner in ${formatMatchLabel(sample.homeTeam, sample.awayTeam)}`,
      detail: `Not a single winner pick for ${sample.actualWinner} (${formatScore(sample.finalHomeScore, sample.finalAwayScore)}) among ${total} managers.`,
      playerName: "Everyone",
      matchId,
      matchLabel: formatMatchLabel(sample.homeTeam, sample.awayTeam)
    });
  }

  const priority: Record<GroupStageInsightCategory, number> = {
    perfect: 100,
    "unicorn-exact": 90,
    bizarre: 85,
    "lone-upset": 80,
    "stat-oracle": 70,
    sharpshooter: 65,
    "consensus-miss": 60
  };

  let statOracleCount = 0;

  return dedupeInsights(candidates)
    .sort((left, right) => {
      const leftPriority = priority[left.category];
      const rightPriority = priority[right.category];
      if (leftPriority !== rightPriority) {
        return rightPriority - leftPriority;
      }

      return (right.points ?? 0) - (left.points ?? 0);
    })
    .filter((insight) => {
      if (insight.category !== "stat-oracle") {
        return true;
      }

      if (statOracleCount >= 2) {
        return false;
      }

      statOracleCount += 1;
      return true;
    })
    .slice(0, 8);
}
