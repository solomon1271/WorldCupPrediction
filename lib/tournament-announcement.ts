import { getTeamShowcase } from "@/lib/team-showcase";
import {
  hasConfiguredOfficialAwards,
  parseOfficialAwards,
  scoreTournamentPrediction,
  type TournamentAwards
} from "@/lib/tournament-scoring";
import { prisma } from "@/lib/prisma";

export const TOURNAMENT_FINALE_MATCH_ID = 104;

export type TournamentCelebrationWinner = {
  userId: string;
  displayName: string;
  totalPoints: number;
  hits: number;
};

export type TournamentCelebration = {
  champion: string;
  runnerUp: string | null;
  finaleLabel: string;
  championAccent: string;
  fireworkHues: number[];
  awards: TournamentAwards;
  topPicksWinners: TournamentCelebrationWinner[];
};

const SPAIN_FIREWORK_HUES = [0, 6, 352, 42, 48];

function getTournamentRevealClient() {
  if (!("tournamentRevealSeen" in prisma) || !prisma.tournamentRevealSeen) {
    return null;
  }

  return prisma.tournamentRevealSeen;
}

export async function isTournamentComplete() {
  const finale = await prisma.match.findUnique({
    where: { id: TOURNAMENT_FINALE_MATCH_ID },
    select: {
      finalHomeScore: true,
      finalAwayScore: true,
      homeTeam: true,
      awayTeam: true
    }
  });

  return (
    finale !== null &&
    finale.finalHomeScore !== null &&
    finale.finalAwayScore !== null
  );
}

export async function markTournamentCelebrationSeen(leagueId: string, userId: string) {
  const revealClient = getTournamentRevealClient();

  if (!revealClient) {
    return;
  }

  await revealClient.upsert({
    where: {
      leagueId_userId: {
        leagueId,
        userId
      }
    },
    update: {},
    create: {
      leagueId,
      userId
    }
  });
}

async function buildTopPicksWinners(leagueId: string, awards: TournamentAwards) {
  const members = await prisma.leagueMember.findMany({
    where: { leagueId },
    include: {
      user: {
        include: {
          tournamentPredictions: {
            where: { leagueId },
            take: 1
          }
        }
      }
    }
  });

  const scored = members.map((member) => {
    const prediction = member.user.tournamentPredictions[0] ?? {
      champion: null,
      runnerUp: null,
      goldenBoot: null,
      bestYoungPlayer: null,
      goldenGlove: null,
      bestPlayer: null
    };
    const score = scoreTournamentPrediction(prediction, awards);

    return {
      userId: member.user.id,
      displayName: member.user.displayName,
      totalPoints: score.points,
      hits: score.hits
    };
  });

  const best = Math.max(0, ...scored.map((entry) => entry.totalPoints));

  if (best <= 0) {
    return [];
  }

  return scored
    .filter((entry) => entry.totalPoints === best)
    .sort((left, right) => left.displayName.localeCompare(right.displayName));
}

export async function getPendingTournamentCelebration(
  leagueId: string,
  userId: string
): Promise<TournamentCelebration | null> {
  if (!(await isTournamentComplete())) {
    return null;
  }

  const league = await prisma.league.findUnique({
    where: { id: leagueId },
    select: { officialAwardsJson: true }
  });
  const awards = parseOfficialAwards(league?.officialAwardsJson);

  if (!hasConfiguredOfficialAwards(awards) || !awards.champion?.trim()) {
    return null;
  }

  const revealClient = getTournamentRevealClient();

  if (revealClient) {
    const seen = await revealClient.findUnique({
      where: {
        leagueId_userId: {
          leagueId,
          userId
        }
      }
    });

    if (seen) {
      return null;
    }
  }

  const finale = await prisma.match.findUnique({
    where: { id: TOURNAMENT_FINALE_MATCH_ID },
    select: {
      homeTeam: true,
      awayTeam: true,
      finalHomeScore: true,
      finalAwayScore: true
    }
  });

  if (!finale || finale.finalHomeScore === null || finale.finalAwayScore === null) {
    return null;
  }

  const champion = awards.champion.trim();
  const showcase = getTeamShowcase(champion);
  const fireworkHues =
    champion === "Spain" ? SPAIN_FIREWORK_HUES : [18, 28, 38, 48, 58];
  const topPicksWinners = await buildTopPicksWinners(leagueId, awards);

  return {
    champion,
    runnerUp: awards.runnerUp?.trim() || null,
    finaleLabel: `${finale.homeTeam} ${finale.finalHomeScore}–${finale.finalAwayScore} ${finale.awayTeam}`,
    championAccent: showcase?.accent ?? "#aa151b",
    fireworkHues,
    awards,
    topPicksWinners
  };
}
