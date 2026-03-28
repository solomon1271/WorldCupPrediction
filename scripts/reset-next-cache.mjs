import { existsSync, rmSync } from "node:fs";
import { join } from "node:path";

const nextDir = join(process.cwd(), process.env.NEXT_DIST_DIR || ".next");

if (existsSync(nextDir)) {
  rmSync(nextDir, { recursive: true, force: true });
}
