import { lockMatchesNearKickoff, syncMatchFixtures } from "@/lib/match-sync";

async function main() {
  const sync = await syncMatchFixtures();
  const lock = await lockMatchesNearKickoff();

  console.log(
    JSON.stringify(
      {
        ok: true,
        sync,
        lock
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
