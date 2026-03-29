import { syncMatchFixtures } from "@/lib/match-sync";

async function main() {
  const result = await syncMatchFixtures();
  console.log(JSON.stringify({ ok: true, ...result }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
