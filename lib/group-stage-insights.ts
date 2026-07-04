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
  | "consensus-miss"
  | "best-pick"
  | "exact-gem"
  | "bold-call"
  | "near-miss"
  | "wild-miss"
  | "stat-snipe";

export type GroupStageInsight = {
  id: string;
  category: GroupStageInsightCategory;
  emoji: string;
  title: string;
  headline: string;
  detail: string;
  playerName: string;
  userId?: string;
  matchId?: number;
  matchLabel?: string;
  points?: number;
};

export type GroupStageInsightsPayload = {
  leagueHighlights: GroupStageInsight[];
  managerInsights: GroupStageInsight[];
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

type InsightContext = {
  exactCountsByMatch: Map<number, number>;
  winnerCorrectByMatch: Map<number, number>;
  predictionsByMatch: Map<number, EvaluatedPick[]>;
  statHitCounts: Map<number, Map<string, number>>;
};

type ScoredCandidate = {
  insight: GroupStageInsight;
  score: number;
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
    const key = `${insight.category}:${insight.userId ?? insight.playerName}:${insight.matchId ?? "none"}`;
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    result.push(insight);
  }

  return result;
}

function buildManagerInsight(picks: EvaluatedPick[], context: InsightContext): GroupStageInsight | null {
  if (picks.length === 0) {
    return null;
  }

  const playerName = picks[0].playerName;
  const userId = picks[0].userId;
  const candidates: ScoredCandidate[] = [];

  for (const pick of picks) {
    const matchLabel = formatMatchLabel(pick.homeTeam, pick.awayTeam);
    const matchPicks = context.predictionsByMatch.get(pick.matchId) ?? [];
    const winnerCorrectCount = context.winnerCorrectByMatch.get(pick.matchId) ?? 0;
    const exactCountForMatch = context.exactCountsByMatch.get(pick.matchId) ?? 0;

    if (pick.breakdownPossible >= 4 && pick.breakdownHits === pick.breakdownPossible) {
      candidates.push({
        score: 1000 + pick.points,
        insight: {
          id: `manager-perfect-${userId}-${pick.matchId}`,
          category: "perfect",
          emoji: "🎯",
          title: "Perfect call",
          headline: "Nailed every recorded line on one match",
          detail: `${formatScore(pick.prediction.homeScore, pick.prediction.awayScore)} in ${matchLabel} — score, winner, and every bonus stat (${pick.points} pts).`,
          playerName,
          userId,
          matchId: pick.matchId,
          matchLabel,
          points: pick.points
        }
      });
    }

    if (pick.exact) {
      candidates.push({
        score: 900 + pick.points + (exactCountForMatch === 1 ? 20 : 0),
        insight: {
          id: `manager-exact-${userId}-${pick.matchId}`,
          category: "exact-gem",
          emoji: pick.exact && exactCountForMatch === 1 ? "🦄" : "💎",
          title: exactCountForMatch === 1 ? "League-only exact score" : "Exact scoreline",
          headline:
            exactCountForMatch === 1
              ? "The only manager with this exact score"
              : `Called ${formatScore(pick.finalHomeScore, pick.finalAwayScore)} spot on`,
          detail: `${matchLabel} finished ${formatScore(pick.finalHomeScore, pick.finalAwayScore)}${exactCountForMatch === 1 ? " — nobody else in the league matched it." : "."}`,
          playerName,
          userId,
          matchId: pick.matchId,
          matchLabel,
          points: pick.points
        }
      });
    }

    if (pick.outcome && winnerCorrectCount === 1 && matchPicks.length >= 4) {
      candidates.push({
        score: 850 + pick.points,
        insight: {
          id: `manager-lone-upset-${userId}-${pick.matchId}`,
          category: "lone-upset",
          emoji: "🔮",
          title: "Sole upset caller",
          headline: `Only one in the league who picked ${pick.actualWinner}`,
          detail: `${matchLabel} ended ${formatScore(pick.finalHomeScore, pick.finalAwayScore)} — ${playerName} stood alone among ${matchPicks.length} managers.`,
          playerName,
          userId,
          matchId: pick.matchId,
          matchLabel,
          points: pick.points
        }
      });
    }

    if (pick.outcome && matchPicks.length >= 4 && winnerCorrectCount / matchPicks.length <= 0.25) {
      candidates.push({
        score: 780 + pick.points,
        insight: {
          id: `manager-bold-${userId}-${pick.matchId}`,
          category: "bold-call",
          emoji: "🦁",
          title: "Bold call",
          headline: `Backed ${pick.actualWinner} when most of the league did not`,
          detail: `Only ${winnerCorrectCount} of ${matchPicks.length} managers picked the winner in ${matchLabel}.`,
          playerName,
          userId,
          matchId: pick.matchId,
          matchLabel,
          points: pick.points
        }
      });
    }

    for (const statLabel of pick.statHits) {
      const hitCount = context.statHitCounts.get(pick.matchId)?.get(statLabel) ?? 0;
      if (hitCount === 1) {
        candidates.push({
          score: 760 + pick.points,
          insight: {
            id: `manager-stat-${userId}-${pick.matchId}-${statLabel}`,
            category: "stat-oracle",
            emoji: "🧠",
            title: "Stat oracle",
            headline: `Alone in the league on ${statLabel.toLowerCase()}`,
            detail: `The only manager to hit ${statLabel.toLowerCase()} in ${matchLabel}.`,
            playerName,
            userId,
            matchId: pick.matchId,
            matchLabel,
            points: pick.points
          }
        });
      } else if (hitCount <= 2) {
        candidates.push({
          score: 620 + pick.points,
          insight: {
            id: `manager-stat-snipe-${userId}-${pick.matchId}-${statLabel}`,
            category: "stat-snipe",
            emoji: "📊",
            title: "Stat sniper",
            headline: `One of only ${hitCount} to nail ${statLabel.toLowerCase()}`,
            detail: `Hit ${statLabel.toLowerCase()} in ${matchLabel} when almost everyone else missed it.`,
            playerName,
            userId,
            matchId: pick.matchId,
            matchLabel,
            points: pick.points
          }
        });
      }
    }

    if (!pick.outcome && pick.scoreDiff <= 1 && pick.prediction.homeScore !== null && pick.prediction.awayScore !== null) {
      candidates.push({
        score: 700,
        insight: {
          id: `manager-near-${userId}-${pick.matchId}`,
          category: "near-miss",
          emoji: "😮‍💨",
          title: "So close",
          headline: "Almost had the scoreline, just missed the winner",
          detail: `Predicted ${formatScore(pick.prediction.homeScore, pick.prediction.awayScore)} in ${matchLabel}; final was ${formatScore(pick.finalHomeScore, pick.finalAwayScore)}.`,
          playerName,
          userId,
          matchId: pick.matchId,
          matchLabel,
          points: pick.points
        }
      });
    }

    if (!pick.outcome && pick.scoreDiff >= 5) {
      candidates.push({
        score: 650 + pick.scoreDiff,
        insight: {
          id: `manager-wild-${userId}-${pick.matchId}`,
          category: "wild-miss",
          emoji: "🎪",
          title: "Wild miss",
          headline: "Predicted a completely different match",
          detail: `Went with ${formatScore(pick.prediction.homeScore, pick.prediction.awayScore)} and ${pick.prediction.winner} in ${matchLabel}; reality was ${formatScore(pick.finalHomeScore, pick.finalAwayScore)} (${pick.actualWinner}).`,
          playerName,
          userId,
          matchId: pick.matchId,
          matchLabel
        }
      });
    }

    candidates.push({
      score: 400 + pick.points,
      insight: {
        id: `manager-best-${userId}-${pick.matchId}`,
        category: "best-pick",
        emoji: "⭐",
        title: "Peak group stage pick",
        headline: `Best scoring line: ${pick.points} pts`,
        detail: `${formatScore(pick.prediction.homeScore, pick.prediction.awayScore)} in ${matchLabel}${pick.outcome ? ` — correct winner (${pick.actualWinner}).` : "."}`,
        playerName,
        userId,
        matchId: pick.matchId,
        matchLabel,
        points: pick.points
      }
    });
  }

  const exactTotal = picks.filter((pick) => pick.exact).length;
  if (exactTotal >= 2) {
    candidates.push({
      score: 820 + exactTotal * 10,
      insight: {
        id: `manager-sharp-${userId}`,
        category: "sharpshooter",
        emoji: "🏆",
        title: "Scoreline hunter",
        headline: `${exactTotal} exact scorelines in the group stage`,
        detail: `${playerName} nailed the full score ${exactTotal} time${exactTotal === 1 ? "" : "s"} across matches 1–72.`,
        playerName,
        userId,
        points: exactTotal
      }
    });
  }

  const bestCandidate = pickBest(candidates, (candidate) => candidate.score);
  return bestCandidate?.insight ?? null;
}

function buildLeagueHighlights(
  finishedGroupPicks: EvaluatedPick[],
  context: InsightContext
): GroupStageInsight[] {
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
      userId: bestPerfectPick.userId,
      matchId: bestPerfectPick.matchId,
      matchLabel: formatMatchLabel(bestPerfectPick.homeTeam, bestPerfectPick.awayTeam),
      points: bestPerfectPick.points
    });
  }

  const bestUnicornPick = pickBest(
    finishedGroupPicks.filter(
      (pick) => pick.exact && (context.exactCountsByMatch.get(pick.matchId) ?? 0) === 1
    ),
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
      userId: bestUnicornPick.userId,
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
      userId: bestBizarrePick.userId,
      matchId: bestBizarrePick.matchId,
      matchLabel: formatMatchLabel(bestBizarrePick.homeTeam, bestBizarrePick.awayTeam)
    });
  }

  const bestLoneUpsetPick = pickBest(
    finishedGroupPicks.filter((pick) => {
      const matchPicks = context.predictionsByMatch.get(pick.matchId) ?? [];
      return pick.outcome && (context.winnerCorrectByMatch.get(pick.matchId) ?? 0) === 1 && matchPicks.length >= 4;
    }),
    (pick) => pick.points
  );
  if (bestLoneUpsetPick) {
    const matchPicks = context.predictionsByMatch.get(bestLoneUpsetPick.matchId) ?? [];
    candidates.push({
      id: `lone-upset-${bestLoneUpsetPick.userId}-${bestLoneUpsetPick.matchId}`,
      category: "lone-upset",
      emoji: "🔮",
      title: "Sole upset caller",
      headline: `${bestLoneUpsetPick.playerName} was the only manager who saw ${bestLoneUpsetPick.actualWinner} winning`,
      detail: `One correct winner pick out of ${matchPicks.length} managers in ${formatMatchLabel(bestLoneUpsetPick.homeTeam, bestLoneUpsetPick.awayTeam)}. Final score: ${formatScore(bestLoneUpsetPick.finalHomeScore, bestLoneUpsetPick.finalAwayScore)}.`,
      playerName: bestLoneUpsetPick.playerName,
      userId: bestLoneUpsetPick.userId,
      matchId: bestLoneUpsetPick.matchId,
      matchLabel: formatMatchLabel(bestLoneUpsetPick.homeTeam, bestLoneUpsetPick.awayTeam),
      points: bestLoneUpsetPick.points
    });
  }

  const bestConsensusMiss = pickBest(
    [...context.predictionsByMatch.entries()]
      .filter(([matchId, matchPicks]) => (context.winnerCorrectByMatch.get(matchId) ?? 0) === 0 && matchPicks.length >= 4)
      .map(([matchId, matchPicks]) => ({
        matchId,
        total: matchPicks.length,
        sample: matchPicks[0]
      })),
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
    "consensus-miss": 60,
    "best-pick": 50,
    "exact-gem": 55,
    "bold-call": 58,
    "near-miss": 45,
    "wild-miss": 40,
    "stat-snipe": 35
  };

  return dedupeInsights(candidates)
    .sort((left, right) => priority[right.category] - priority[left.category])
    .slice(0, 5);
}

export async function buildGroupStageInsights(leagueId: string): Promise<GroupStageInsightsPayload> {
  const [predictions, members] = await Promise.all([
    prisma.matchPrediction.findMany({
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
    }),
    prisma.leagueMember.findMany({
      where: { leagueId },
      include: {
        user: {
          select: {
            id: true,
            displayName: true
          }
        }
      },
      orderBy: {
        user: {
          displayName: "asc"
        }
      }
    })
  ]);

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

  const picksByUser = new Map<string, EvaluatedPick[]>();
  for (const pick of finishedGroupPicks) {
    const userPicks = picksByUser.get(pick.userId) ?? [];
    userPicks.push(pick);
    picksByUser.set(pick.userId, userPicks);
  }

  if (finishedGroupPicks.length === 0) {
    return { leagueHighlights: [], managerInsights: [] };
  }

  const exactCountsByMatch = new Map<number, number>();
  const winnerCorrectByMatch = new Map<number, number>();
  const predictionsByMatch = new Map<number, EvaluatedPick[]>();
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

    for (const statLabel of pick.statHits) {
      const matchStats = statHitCounts.get(pick.matchId) ?? new Map<string, number>();
      matchStats.set(statLabel, (matchStats.get(statLabel) ?? 0) + 1);
      statHitCounts.set(pick.matchId, matchStats);
    }
  }

  const context: InsightContext = {
    exactCountsByMatch,
    winnerCorrectByMatch,
    predictionsByMatch,
    statHitCounts
  };

  const managerInsights: GroupStageInsight[] = [];

  for (const member of members) {
    const userPicks = picksByUser.get(member.user.id) ?? [];
    const insight = buildManagerInsight(userPicks, context);

    if (insight) {
      managerInsights.push(insight);
      continue;
    }

    managerInsights.push({
      id: `manager-empty-${member.user.id}`,
      category: "best-pick",
      emoji: "📝",
      title: "Still writing their story",
      headline: `${member.user.displayName} has no scored group stage picks yet`,
      detail: "Once finished group-stage matches have saved predictions, a personal highlight will appear here.",
      playerName: member.user.displayName,
      userId: member.user.id
    });
  }

  return {
    leagueHighlights: buildLeagueHighlights(finishedGroupPicks, context),
    managerInsights
  };
}
