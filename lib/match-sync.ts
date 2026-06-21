import { readFile } from "node:fs/promises";
import { isAbsolute, join } from "node:path";

import { captureLeaderboardSnapshotForMaintenance, finalizeLeaderboardSnapshot } from "@/lib/leaderboard";
import { prisma } from "@/lib/prisma";
import { seedMatches } from "@/lib/seed-data";
import { getZonedDayBounds } from "@/lib/timezone";

export type MatchSyncFixture = {
  id: number;
  stage?: string;
  kickoff?: string;
  venue?: string;
  homeTeam?: string;
  awayTeam?: string;
  isLocked?: boolean;
  finalHomeScore?: number | null;
  finalAwayScore?: number | null;
  finalYellowCards?: number | null;
  finalTotalCorners?: number | null;
  finalRedCards?: number | null;
};

const DEFAULT_CRON_TIMEZONE = "America/Chicago";

/** Lock when kickoff is within this many minutes from now (e.g. 1 = lock at T−1m). */
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
    isLocked: input.isLocked,
    finalHomeScore: input.finalHomeScore,
    finalAwayScore: input.finalAwayScore,
    finalYellowCards: input.finalYellowCards,
    finalTotalCorners: input.finalTotalCorners,
    finalRedCards: input.finalRedCards
  };
}

function collectResultChanges(
  existing: {
    finalHomeScore: number | null;
    finalAwayScore: number | null;
    finalYellowCards: number | null;
    finalTotalCorners: number | null;
    finalRedCards: number | null;
  },
  fixture: MatchSyncFixture
) {
  const changes: Record<string, number | null> = {};

  if (
    typeof fixture.finalHomeScore === "number" &&
    typeof fixture.finalAwayScore === "number" &&
    (fixture.finalHomeScore !== existing.finalHomeScore || fixture.finalAwayScore !== existing.finalAwayScore)
  ) {
    changes.finalHomeScore = fixture.finalHomeScore;
    changes.finalAwayScore = fixture.finalAwayScore;
  }

  if (typeof fixture.finalYellowCards === "number" && fixture.finalYellowCards !== existing.finalYellowCards) {
    changes.finalYellowCards = fixture.finalYellowCards;
  }

  if (typeof fixture.finalTotalCorners === "number" && fixture.finalTotalCorners !== existing.finalTotalCorners) {
    changes.finalTotalCorners = fixture.finalTotalCorners;
  }

  if (typeof fixture.finalRedCards === "number" && fixture.finalRedCards !== existing.finalRedCards) {
    changes.finalRedCards = fixture.finalRedCards;
  }

  return changes;
}

function hasFullFinalScore(match: { finalHomeScore: number | null; finalAwayScore: number | null }) {
  return match.finalHomeScore !== null && match.finalAwayScore !== null;
}

function applyFinalResultTimestamp(
  existing: { finalHomeScore: number | null; finalAwayScore: number | null },
  changes: Record<string, unknown>
) {
  if (hasFullFinalScore(existing)) {
    return;
  }

  const nextHomeScore =
    typeof changes.finalHomeScore === "number" ? changes.finalHomeScore : existing.finalHomeScore;
  const nextAwayScore =
    typeof changes.finalAwayScore === "number" ? changes.finalAwayScore : existing.finalAwayScore;

  if (nextHomeScore !== null && nextAwayScore !== null) {
    changes.finalResultAt = new Date();
  }
}

function parseFixturePayload(payload: unknown): MatchSyncFixture[] {
  const fixtures = Array.isArray(payload) ? payload : Array.isArray((payload as { matches?: unknown })?.matches) ? (payload as { matches: unknown[] }).matches : null;

  if (!fixtures) {
    throw new Error("Match sync feed must be a JSON array or an object with a matches array.");
  }

  return (fixtures as unknown[])
    .filter((item): item is MatchSyncFixture => {
      return Boolean(item && typeof item === "object" && "id" in item && typeof (item as { id?: unknown }).id === "number");
    })
    .map((item) => normalizeFixture(item));
}

async function loadFixturesFromFile(filePath: string) {
  const absolutePath = isAbsolute(filePath) ? filePath : join(process.cwd(), filePath);
  const payload = JSON.parse(await readFile(absolutePath, "utf8")) as unknown;
  return parseFixturePayload(payload);
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

export async function loadFixturesFromSource(): Promise<MatchSyncFixture[]> {
  const filePath = process.env.MATCH_SYNC_FILE?.trim();

  if (filePath) {
    return loadFixturesFromFile(filePath);
  }

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
  return parseFixturePayload(payload);
}

export async function syncMatchFixtures() {
  const fixtures = await loadFixturesFromSource();
  let updated = 0;
  let unchanged = 0;
  let created = 0;
  let resultsUpdated = 0;

  for (const fixture of fixtures) {
    const existing = await prisma.match.findUnique({ where: { id: fixture.id } });
    const kickoff = fixture.kickoff ? new Date(fixture.kickoff) : null;

    const payload = {
      stage: fixture.stage,
      kickoff,
      venue: fixture.venue,
      homeTeam: fixture.homeTeam,
      awayTeam: fixture.awayTeam
    };

    if (!existing) {
      if (!payload.stage || !payload.kickoff || !payload.venue || !payload.homeTeam || !payload.awayTeam) {
        continue;
      }

      const resultFields = collectResultChanges(
        {
          finalHomeScore: null,
          finalAwayScore: null,
          finalYellowCards: null,
          finalTotalCorners: null,
          finalRedCards: null
        },
        fixture
      );
      const createData: Record<string, unknown> = {
        id: fixture.id,
        stage: payload.stage,
        kickoff: payload.kickoff,
        venue: payload.venue,
        homeTeam: payload.homeTeam,
        awayTeam: payload.awayTeam,
        isLocked: false,
        ...resultFields
      };

      applyFinalResultTimestamp(
        { finalHomeScore: null, finalAwayScore: null },
        createData
      );

      await prisma.match.create({
        data: createData as Parameters<typeof prisma.match.create>[0]["data"]
      });
      created += 1;
      if (Object.keys(resultFields).length > 0) {
        resultsUpdated += 1;
      }
      continue;
    }

    const changes: Record<string, unknown> = {};

    if (payload.stage && payload.stage !== existing.stage) changes.stage = payload.stage;
    if (payload.kickoff && payload.kickoff.getTime() !== existing.kickoff.getTime()) changes.kickoff = payload.kickoff;
    if (payload.venue && payload.venue !== existing.venue) changes.venue = payload.venue;
    if (payload.homeTeam && payload.homeTeam !== existing.homeTeam) changes.homeTeam = payload.homeTeam;
    if (payload.awayTeam && payload.awayTeam !== existing.awayTeam) changes.awayTeam = payload.awayTeam;

    const resultChanges = collectResultChanges(existing, fixture);
    for (const [field, value] of Object.entries(resultChanges)) {
      changes[field] = value;
    }

    applyFinalResultTimestamp(existing, changes);

    if (Object.keys(changes).length === 0) {
      unchanged += 1;
      continue;
    }

    await prisma.match.update({
      where: { id: fixture.id },
      data: changes
    });
    updated += 1;
    if (Object.keys(resultChanges).length > 0) {
      resultsUpdated += 1;
    }
  }

  return {
    totalFixtures: fixtures.length,
    created,
    updated,
    unchanged,
    resultsUpdated
  };
}

export async function lockMatchesForDailyMaintenance(referenceDate = new Date()) {
  const timeZone = process.env.CRON_TIMEZONE?.trim() || DEFAULT_CRON_TIMEZONE;
  const { start, end, dateLabel } = getZonedDayBounds(timeZone, referenceDate);

  const [todayResult, overdueResult] = await Promise.all([
    prisma.match.updateMany({
      where: {
        isLocked: false,
        kickoff: {
          gte: start,
          lte: end
        }
      },
      data: {
        isLocked: true
      }
    }),
    prisma.match.updateMany({
      where: {
        isLocked: false,
        kickoff: {
          lt: start
        }
      },
      data: {
        isLocked: true
      }
    })
  ]);

  return {
    timeZone,
    dateLabel,
    start: start.toISOString(),
    end: end.toISOString(),
    todayLockedCount: todayResult.count,
    overdueLockedCount: overdueResult.count,
    lockedCount: todayResult.count + overdueResult.count
  };
}

export async function runDailyMatchMaintenance() {
  const ranksBefore = await captureLeaderboardSnapshotForMaintenance();
  const sync = await syncMatchFixtures();
  const leaderboard = await finalizeLeaderboardSnapshot(ranksBefore);

  return { sync, leaderboard };
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
