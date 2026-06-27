import { access, mkdir } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

import {
  PLAYER_IMAGE_HEIGHT,
  PLAYER_IMAGE_SOURCES,
  PLAYER_IMAGE_WIDTH
} from "../lib/team-player-image-sources";
import { getTeamShowcase, isShowcaseTeam } from "../lib/team-showcase";
import { getWorldCupTeams } from "../lib/world-cup-teams";

const OUTPUT_DIR = path.join(process.cwd(), "public", "players");
const REQUEST_DELAY_MS = 2500;
const MAX_RETRIES = 4;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeThumbnailUrl(url: string) {
  if (url.includes("/thumb/")) {
    return url.replace(/\/\d+px-/, "/330px-");
  }

  return url;
}

function wikiTitles(player: string) {
  const base = player.trim();
  const withoutAccents = base.normalize("NFD").replace(/\p{Diacritic}/gu, "");

  return [...new Set([`${base} (footballer)`, base, `${withoutAccents} (footballer)`, withoutAccents])];
}

async function fetchWithRetries(url: string) {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt += 1) {
    if (attempt > 0) {
      await sleep(REQUEST_DELAY_MS * (attempt + 1));
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent": "WorldCupPrediction/1.0 (local asset downloader; contact: solomon1271@gmail.com)"
      }
    });

    if (response.ok) {
      return response;
    }

    lastError = new Error(`${response.status} ${response.statusText}`);

    if (response.status !== 429 && response.status !== 503) {
      break;
    }
  }

  throw lastError ?? new Error("Request failed");
}

type PlayerDownloadTarget = {
  countryCode: string;
  team: string;
  player: string;
};

function collectPlayerTargets() {
  const targets = new Map<string, PlayerDownloadTarget>();

  for (const team of getWorldCupTeams()) {
    if (!isShowcaseTeam(team)) {
      continue;
    }

    const showcase = getTeamShowcase(team);

    if (!showcase) {
      continue;
    }

    targets.set(showcase.countryCode, {
      countryCode: showcase.countryCode,
      team: showcase.team,
      player: showcase.player
    });
  }

  return [...targets.values()].sort((left, right) => left.countryCode.localeCompare(right.countryCode));
}

function toOriginalCommonsUrl(url: string) {
  const thumbMatch = url.match(
    /^(https:\/\/upload\.wikimedia\.org\/wikipedia\/commons)\/thumb\/([a-f0-9]\/[a-f0-9]{2})\/([^/]+)\/\d+px-[^/]+$/
  );

  if (thumbMatch) {
    return `${thumbMatch[1]}/${thumbMatch[2]}/${thumbMatch[3]}`;
  }

  return url;
}

async function fetchWikipediaSummary(title: string) {
  const response = await fetchWithRetries(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, "_"))}`
  );

  const payload = (await response.json()) as {
    type?: string;
    originalimage?: { source?: string };
    thumbnail?: { source?: string };
  };

  if (payload.type === "disambiguation") {
    return null;
  }

  return payload;
}

async function searchFootballerTitle(player: string) {
  const response = await fetchWithRetries(
    `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(`${player} footballer`)}&srlimit=5&format=json`
  );
  const data = (await response.json()) as {
    query?: { search?: Array<{ title: string }> };
  };
  const results = data.query?.search ?? [];

  return results.find((result) => /footballer/i.test(result.title))?.title ?? null;
}

async function fetchWikipediaImage(player: string) {
  for (const title of wikiTitles(player)) {
    await sleep(REQUEST_DELAY_MS);

    try {
      const payload = await fetchWikipediaSummary(title);
      const source = payload?.thumbnail?.source ?? payload?.originalimage?.source;

      if (source) {
        return normalizeThumbnailUrl(source);
      }
    } catch {
      continue;
    }
  }

  await sleep(REQUEST_DELAY_MS);

  try {
    const searchedTitle = await searchFootballerTitle(player);

    if (!searchedTitle) {
      return null;
    }

    const payload = await fetchWikipediaSummary(searchedTitle);
    const source = payload?.thumbnail?.source ?? payload?.originalimage?.source;

    if (source) {
      return normalizeThumbnailUrl(source);
    }
  } catch {
    return null;
  }

  return null;
}

async function resolveSourceUrl(target: PlayerDownloadTarget) {
  const fromWikipedia = await fetchWikipediaImage(target.player);

  if (fromWikipedia) {
    return fromWikipedia;
  }

  const curated = PLAYER_IMAGE_SOURCES[target.countryCode];

  if (curated) {
    return normalizeThumbnailUrl(curated);
  }

  return null;
}

async function downloadAndNormalize(countryCode: string, sourceUrl: string) {
  const response = await fetchWithRetries(sourceUrl);

  const input = Buffer.from(await response.arrayBuffer());
  const outputPath = path.join(OUTPUT_DIR, `${countryCode}.png`);

  await sharp(input, { failOn: "warning" })
    .resize(PLAYER_IMAGE_WIDTH, PLAYER_IMAGE_HEIGHT, {
      fit: "cover",
      position: "top"
    })
    .png()
    .toFile(outputPath);

  return outputPath;
}

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true });

  const targets = collectPlayerTargets();
  const failures: string[] = [];
  let downloaded = 0;

  for (const target of targets) {
    const outputPath = path.join(OUTPUT_DIR, `${target.countryCode}.png`);

    try {
      await access(outputPath);
      downloaded += 1;
      console.log(`Skipped ${target.countryCode} (${target.player}) -> already exists`);
      continue;
    } catch {
      // File missing; download it below.
    }

    try {
      await sleep(REQUEST_DELAY_MS);
      const sourceUrl = await resolveSourceUrl(target);

      if (!sourceUrl) {
        failures.push(`${target.countryCode} (${target.player}): no image source found`);
        continue;
      }

      const savedPath = await downloadAndNormalize(target.countryCode, sourceUrl);
      downloaded += 1;
      console.log(
        `Saved ${target.countryCode} (${target.player}) -> ${path.relative(process.cwd(), savedPath)} [${PLAYER_IMAGE_WIDTH}x${PLAYER_IMAGE_HEIGHT}]`
      );
    } catch (error) {
      failures.push(
        `${target.countryCode} (${target.player}): ${error instanceof Error ? error.message : "unknown error"}`
      );
    }
  }

  console.log(`Downloaded ${downloaded}/${targets.length} player images to public/players/.`);

  if (failures.length > 0) {
    console.error("\nFailed downloads:");
    for (const failure of failures) {
      console.error(`- ${failure}`);
    }
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
