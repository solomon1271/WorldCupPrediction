import { Prisma } from "../generated/prisma";

import { prisma } from "@/lib/prisma";

export type AdminUser = {
  id: string;
  displayName: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
  matchPickCount: number;
  tournamentReady: boolean;
};

type UserWithAdminData = Prisma.UserGetPayload<{
  include: {
    matchPredictions: {
      include: {
        match: true;
      };
    };
    tournamentPrediction: true;
  };
}>;

type AdminMatchPrediction = UserWithAdminData["matchPredictions"][number];

const getMatchOutcome = (homeScore: number, awayScore: number) => {
  if (homeScore > awayScore) return "home";
  if (awayScore > homeScore) return "away";
  return "draw";
};

function normalizeThresholdLine(value: string | null | undefined) {
  return value && value.trim().length > 0 ? value : "0";
}

function matchesThreshold(line: string | null | undefined, actual: number) {
  const normalizedLine = normalizeThresholdLine(line);

  if (normalizedLine === "0") {
    return actual === 0;
  }

  return actual > Number(normalizedLine.replace(">", ""));
}

function scorePrediction(prediction: AdminMatchPrediction) {
  const match = prediction.match;

  if (match.finalHomeScore === null || match.finalAwayScore === null) {
    return { points: 0, exact: 0, outcome: 0, bonus: 0 };
  }

  let points = 0;
  let exact = 0;
  let outcome = 0;
  let bonus = 0;
  const pickedOutcome =
    prediction.winner === "Draw" ? "draw" : prediction.winner === match.homeTeam ? "home" : "away";
  const finalOutcome = getMatchOutcome(match.finalHomeScore, match.finalAwayScore);

  if (pickedOutcome === finalOutcome) {
    points += 3;
    outcome += 1;
  }

  if (
    prediction.homeScore !== null &&
    prediction.awayScore !== null &&
    prediction.homeScore === match.finalHomeScore &&
    prediction.awayScore === match.finalAwayScore
  ) {
    points += 5;
    exact += 1;
  }

  if (matchesThreshold(prediction.totalGoalsLine, match.finalHomeScore + match.finalAwayScore)) {
    points += 1;
    bonus += 1;
  }

  if (match.finalTotalCorners !== null && matchesThreshold(prediction.totalCornersLine, match.finalTotalCorners)) {
    points += 1;
    bonus += 1;
  }

  if (match.finalYellowCards !== null && matchesThreshold(prediction.yellowCardsLine, match.finalYellowCards)) {
    points += 1;
    bonus += 1;
  }

  if (match.finalRedCards !== null && prediction.redCardsLine === "Yes" && match.finalRedCards > 0) {
    points += 1;
    bonus += 1;
  }

  return { points, exact, outcome, bonus };
}

export async function getAdminDashboardData() {
  const users = await prisma.user.findMany({
    include: {
      matchPredictions: {
        include: {
          match: true
        }
      },
      tournamentPrediction: true
    },
    orderBy: [{ createdAt: "asc" }]
  });

  return {
    users: users.map((user) => {
      return {
        id: user.id,
        displayName: user.displayName,
        email: user.email,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt.toISOString(),
        matchPickCount: user.matchPredictions.length,
        tournamentReady: Boolean(
          user.tournamentPrediction?.champion &&
            user.tournamentPrediction?.runnerUp &&
            user.tournamentPrediction?.goldenBoot &&
            user.tournamentPrediction?.bestYoungPlayer
        )
      };
    }) as AdminUser[]
  };
}
