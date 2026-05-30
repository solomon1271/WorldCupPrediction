import { League } from "../generated/prisma";

import { normalizeInviteCode, normalizeLeagueSlug, LeagueSummary } from "@/lib/league-types";
import { prisma } from "@/lib/prisma";

export type { LeagueBranding, LeagueSummary } from "@/lib/league-types";
export { normalizeInviteCode, normalizeLeagueSlug } from "@/lib/league-types";

function toLeagueSummary(league: League): LeagueSummary {
  return {
    id: league.id,
    slug: league.slug,
    name: league.name,
    subtitle: league.subtitle,
    inviteCode: league.inviteCode
  };
}

export async function getLeagueBySlug(slug: string) {
  const league = await prisma.league.findUnique({
    where: { slug: normalizeLeagueSlug(slug) }
  });

  return league ? toLeagueSummary(league) : null;
}

export async function getLeagueByInviteCode(inviteCode: string) {
  const normalized = normalizeInviteCode(inviteCode);
  const league = await prisma.league.findFirst({
    where: {
      inviteCode: normalized
    }
  });

  return league ? toLeagueSummary(league) : null;
}

export async function getUserLeagues(userId: string) {
  const memberships = await prisma.leagueMember.findMany({
    where: { userId },
    include: { league: true },
    orderBy: [{ joinedAt: "asc" }]
  });

  return memberships.map((membership) => toLeagueSummary(membership.league));
}

export async function userBelongsToLeague(userId: string, leagueId: string) {
  const membership = await prisma.leagueMember.findUnique({
    where: {
      leagueId_userId: {
        leagueId,
        userId
      }
    }
  });

  return Boolean(membership);
}

export async function requireLeagueMembership(userId: string, leagueSlug: string) {
  const league = await getLeagueBySlug(leagueSlug);

  if (!league) {
    return { error: "League not found." as const };
  }

  const isMember = await userBelongsToLeague(userId, league.id);

  if (!isMember) {
    return { error: "You are not a member of this league." as const };
  }

  return { league };
}

export async function addUserToLeague(userId: string, leagueId: string) {
  await prisma.leagueMember.upsert({
    where: {
      leagueId_userId: {
        leagueId,
        userId
      }
    },
    create: {
      leagueId,
      userId
    },
    update: {}
  });

  await prisma.tournamentPrediction.upsert({
    where: {
      leagueId_userId: {
        leagueId,
        userId
      }
    },
    create: {
      leagueId,
      userId,
      groupWinners: "{}"
    },
    update: {}
  });
}

export async function createLeague(input: {
  slug: string;
  name: string;
  inviteCode: string;
  subtitle?: string;
}) {
  const slug = normalizeLeagueSlug(input.slug);
  const inviteCode = normalizeInviteCode(input.inviteCode);

  if (!slug) {
    throw new Error("League slug is required.");
  }

  if (!inviteCode) {
    throw new Error("Invite code is required.");
  }

  const league = await prisma.league.create({
    data: {
      slug,
      name: input.name.trim(),
      inviteCode,
      subtitle: input.subtitle?.trim() || "2026 World Cup Challenge"
    }
  });

  await prisma.leaderboardState.create({
    data: {
      leagueId: league.id
    }
  });

  return toLeagueSummary(league);
}

export async function listLeagues() {
  const leagues = await prisma.league.findMany({
    orderBy: [{ createdAt: "asc" }]
  });

  return leagues.map(toLeagueSummary);
}
