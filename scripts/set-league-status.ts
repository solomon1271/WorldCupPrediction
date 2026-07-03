#!/usr/bin/env tsx

import { normalizeLeagueSlug } from "@/lib/league-types";
import { prisma } from "@/lib/prisma";

function readFlag(name: string) {
  const arg = process.argv.find((value) => value === `--${name}` || value.startsWith(`--${name}=`));

  if (!arg) {
    return undefined;
  }

  if (arg.includes("=")) {
    return arg.split("=")[1] === "true";
  }

  return true;
}

async function main() {
  const slugArg = process.argv.find((arg) => arg.startsWith("--slug="))?.split("=")[1];

  if (!slugArg) {
    throw new Error("Usage: tsx scripts/set-league-status.ts --slug=newrez [--pause] [--resume] [--hide] [--show]");
  }

  const slug = normalizeLeagueSlug(slugArg);
  const pause = readFlag("pause");
  const resume = readFlag("resume");
  const hide = readFlag("hide");
  const show = readFlag("show");

  if (!pause && !resume && !hide && !show) {
    throw new Error("Set at least one of --pause, --resume, --hide, or --show.");
  }

  const league = await prisma.league.findUnique({ where: { slug } });

  if (!league) {
    throw new Error(`League not found for slug: ${slug}`);
  }

  const data: { isPaused?: boolean; isHidden?: boolean } = {};

  if (pause) {
    data.isPaused = true;
  }

  if (resume) {
    data.isPaused = false;
  }

  if (hide) {
    data.isHidden = true;
  }

  if (show) {
    data.isHidden = false;
  }

  const updated = await prisma.league.update({
    where: { id: league.id },
    data
  });

  console.log(
    JSON.stringify(
      {
        ok: true,
        slug: updated.slug,
        name: updated.name,
        isPaused: updated.isPaused,
        isHidden: updated.isHidden
      },
      null,
      2
    )
  );
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
