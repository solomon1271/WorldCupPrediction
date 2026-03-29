import { lockMatchesNearKickoff } from "@/lib/match-sync";

async function main() {
  const result = await lockMatchesNearKickoff();
  console.log(JSON.stringify({ ok: true, ...result }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
