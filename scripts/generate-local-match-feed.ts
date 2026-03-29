import { writeFileSync } from "node:fs";
import { join } from "node:path";

import { seedMatches } from "../lib/seed-data";

const outputPath = join(process.cwd(), "public", "match-sync.json");

const payload = {
  matches: seedMatches.map((match) => ({
    id: match.id,
    stage: match.stage,
    kickoff: match.kickoff.toISOString(),
    venue: match.venue,
    homeTeam: match.homeTeam,
    awayTeam: match.awayTeam,
    isLocked: match.isLocked
  }))
};

writeFileSync(outputPath, `${JSON.stringify(payload, null, 2)}\n`);
console.log(`Wrote ${payload.matches.length} matches to ${outputPath}`);
