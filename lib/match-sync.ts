import { prisma } from "@/lib/prisma";
import { seedMatches } from "@/lib/seed-data";

export type MatchSyncFixture = {
  id: number;
  stage?: string;
  kickoff?: string;
  venue?: string;
  homeTeam?: string;
  awayTeam?: string;
  isLocked?: boolean;
};

const DEFAULT_LOCK_LEAD_MINUTES = 1;

function parsePositiveInteger(value: string | undefined, fallback: number) {
  const parsed = Number.parseInt(value || "", 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

function normalizeFixture(input: MatchSyncFixture): MatchSyncFixture {
  return {
    id: input.id,
    stage: input.stage?.trim(),
    kickoff: input.kickoff,
    venue: input.venue?.trim(),
    homeTeam: input.homeTeam?.trim(),
    awayTeam: input.awayTeam?.trim(),
    isLocked: input.isLocked
  };
}

async function fetchJson(url: string) {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`Could not fetch match sync feed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

async function loadFixturesFromSource(): Promise<MatchSyncFixture[]> {
  const sourceUrl = process.env.MATCH_SYNC_URL?.trim();

  if (!sourceUrl) {
    return seedMatches.map((match) => ({
      id: match.id,
      stage: match.stage,
      kickoff: match.kickoff.toISOString(),
      venue: match.venue,
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      isLocked: match.isLocked
    }));
  }

  const payload = await fetchJson(sourceUrl);
  const fixtures = Array.isArray(payload) ? payload : Array.isArray(payload?.matches) ? payload.matches : null;

  if (!fixtures) {
    throw new Error("MATCH_SYNC_URL must return a JSON array or an object with a matches array.");
  }

  return (fixtures as unknown[])
    .filter((item): item is MatchSyncFixture => {
      return Boolean(item && typeof item === "object" && "id" in item && typeof (item as { id?: unknown }).id === "number");
    })
    .map((item) => normalizeFixture(item));
}

export async function syncMatchFixtures() {
  const fixtures = await loadFixturesFromSource();
  let updated = 0;
  let unchanged = 0;
  let created = 0;

  for (const fixture of fixtures) {
    const existing = await prisma.match.findUnique({ where: { id: fixture.id } });
    const kickoff = fixture.kickoff ? new Date(fixture.kickoff) : null;

    const payload = {
      stage: fixture.stage,
      kickoff,
      venue: fixture.venue,
      homeTeam: fixture.homeTeam,
      awayTeam: fixture.awayTeam,
      ...(typeof fixture.isLocked === "boolean" ? { isLocked: fixture.isLocked } : {})
    };

    if (!existing) {
      if (!payload.stage || !payload.kickoff || !payload.venue || !payload.homeTeam || !payload.awayTeam) {
        continue;
      }

      await prisma.match.create({
        data: {
          id: fixture.id,
          stage: payload.stage,
          kickoff: payload.kickoff,
          venue: payload.venue,
          homeTeam: payload.homeTeam,
          awayTeam: payload.awayTeam,
          isLocked: payload.isLocked ?? false
        }
      });
      created += 1;
      continue;
    }

    const changes: Record<string, unknown> = {};

    if (payload.stage && payload.stage !== existing.stage) changes.stage = payload.stage;
    if (payload.kickoff && payload.kickoff.getTime() !== existing.kickoff.getTime()) changes.kickoff = payload.kickoff;
    if (payload.venue && payload.venue !== existing.venue) changes.venue = payload.venue;
    if (payload.homeTeam && payload.homeTeam !== existing.homeTeam) changes.homeTeam = payload.homeTeam;
    if (payload.awayTeam && payload.awayTeam !== existing.awayTeam) changes.awayTeam = payload.awayTeam;
    if (typeof payload.isLocked === "boolean" && payload.isLocked !== existing.isLocked) changes.isLocked = payload.isLocked;

    if (Object.keys(changes).length === 0) {
      unchanged += 1;
      continue;
    }

    await prisma.match.update({
      where: { id: fixture.id },
      data: changes
    });
    updated += 1;
  }

  return {
    totalFixtures: fixtures.length,
    created,
    updated,
    unchanged
  };
}

export async function lockMatchesNearKickoff() {
  const lockLeadMinutes = parsePositiveInteger(process.env.MATCH_LOCK_LEAD_MINUTES, DEFAULT_LOCK_LEAD_MINUTES);
  const cutoff = new Date(Date.now() + lockLeadMinutes * 60 * 1000);

  const result = await prisma.match.updateMany({
    where: {
      isLocked: false,
      kickoff: {
        lte: cutoff
      }
    },
    data: {
      isLocked: true
    }
  });

  return {
    lockLeadMinutes,
    lockedCount: result.count,
    cutoff: cutoff.toISOString()
  };
}
