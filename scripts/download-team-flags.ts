import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { getTeamShowcase, isShowcaseTeam } from "../lib/team-showcase";
import { getWorldCupTeams } from "../lib/world-cup-teams";

const OUTPUT_DIR = path.join(process.cwd(), "public", "flags");

function collectCountryCodes() {
  const codes = new Set<string>(["un"]);

  for (const team of getWorldCupTeams()) {
    if (!isShowcaseTeam(team)) {
      continue;
    }

    const showcase = getTeamShowcase(team);

    if (showcase?.countryCode) {
      codes.add(showcase.countryCode);
    }
  }

  return [...codes].sort();
}

async function downloadFlag(countryCode: string) {
  const response = await fetch(`https://flagcdn.com/w640/${countryCode}.png`);

  if (!response.ok) {
    throw new Error(`Failed to download ${countryCode}: ${response.status} ${response.statusText}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const outputPath = path.join(OUTPUT_DIR, `${countryCode}.png`);
  await writeFile(outputPath, buffer);
  return outputPath;
}

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true });

  const codes = collectCountryCodes();
  let downloaded = 0;

  for (const code of codes) {
    const outputPath = await downloadFlag(code);
    downloaded += 1;
    console.log(`Saved ${code} -> ${path.relative(process.cwd(), outputPath)}`);
  }

  console.log(`Downloaded ${downloaded} flags to public/flags/.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
