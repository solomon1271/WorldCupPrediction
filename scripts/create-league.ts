#!/usr/bin/env tsx

import { createLeague } from "@/lib/leagues";
import { prisma } from "@/lib/prisma";

function readArg(flag: string) {
  const index = process.argv.indexOf(flag);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

async function main() {
  const slug = readArg("--slug");
  const name = readArg("--name");
  const inviteCode = readArg("--invite-code");
  const subtitle = readArg("--subtitle");

  if (!slug || !name || !inviteCode) {
    console.error("Usage: npm run league:create -- --slug fairwind --name \"Fair Wind World Cup Prediction\" --invite-code fairwind-invite-code");
    process.exit(1);
  }

  const league = await createLeague({ slug, name, inviteCode, subtitle });
  console.log(JSON.stringify({ ok: true, league, signupUrl: `/l/${league.slug}/signup` }, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
