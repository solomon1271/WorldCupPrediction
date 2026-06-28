import path from "node:path";
import { pathToFileURL } from "node:url";

import { PrismaClient } from "../generated/prisma";

/**
 * Relative SQLite URLs are resolved from the prisma/ directory by the Prisma CLI,
 * while the Node cwd for Next.js is the repo root — that mismatch created a second DB
 * under prisma/prisma/. Using an absolute file URL at runtime keeps reads/writes on
 * prisma/dev.db and avoids "readonly database" when the engine opens the wrong path.
 */
function sqliteDatasourceUrlOverride(): string | undefined {
  const raw = process.env.DATABASE_URL?.trim();
  if (!raw?.startsWith("file:")) {
    return undefined;
  }

  const q = raw.indexOf("?");
  const head = q === -1 ? raw : raw.slice(0, q);
  const query = q === -1 ? "" : raw.slice(q);
  const pathPart = head.slice("file:".length).replace(/^\.\//, "");

  if (pathPart.startsWith("/") || /^[A-Za-z]:/.test(pathPart)) {
    return undefined;
  }

  let abs: string | undefined;
  if (pathPart === "dev.db") {
    abs = path.join(process.cwd(), "prisma", "dev.db");
  } else if (pathPart === "prisma/dev.db") {
    abs = path.join(process.cwd(), "prisma", "dev.db");
  }

  if (!abs) {
    return undefined;
  }

  return pathToFileURL(abs).href + query;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const sqliteUrl = sqliteDatasourceUrlOverride();

function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    ...(sqliteUrl
      ? {
          datasources: {
            db: { url: sqliteUrl }
          }
        }
      : {})
  });
}

function isPrismaClientReady(client: PrismaClient) {
  return (
    "leaderboardState" in client &&
    Boolean(client.leaderboardState) &&
    "league" in client &&
    Boolean(client.league) &&
    "matchWinnerRevealSeen" in client &&
    Boolean(client.matchWinnerRevealSeen) &&
    "groupStageRevealSeen" in client &&
    Boolean(client.groupStageRevealSeen) &&
    "knockoutLeaderboardState" in client &&
    Boolean(client.knockoutLeaderboardState)
  );
}

function getPrismaClient() {
  const cached = globalForPrisma.prisma;

  if (cached && isPrismaClientReady(cached)) {
    return cached;
  }

  const client = createPrismaClient();

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  }

  return client;
}

export const prisma = getPrismaClient();
