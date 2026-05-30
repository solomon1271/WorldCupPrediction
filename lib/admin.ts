import { Prisma } from "../generated/prisma";

import { prisma } from "@/lib/prisma";

export type AdminUser = {
  id: string;
  displayName: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
  matchPickCount: number;
  tournamentReady: boolean;
};

type UserWithAdminData = Prisma.UserGetPayload<{
  include: {
    matchPredictions: {
      include: {
        match: true;
      };
    };
    tournamentPredictions: true;
  };
}>;

export async function getAdminDashboardData() {
  const users = await prisma.user.findMany({
    include: {
      matchPredictions: {
        include: {
          match: true
        }
      },
      tournamentPredictions: true
    },
    orderBy: [{ createdAt: "asc" }]
  });

  return {
    users: users.map((user: UserWithAdminData) => {
      const tournamentReady = user.tournamentPredictions.some(
        (prediction) =>
          prediction.champion && prediction.runnerUp && prediction.goldenBoot && prediction.bestYoungPlayer
      );

      return {
        id: user.id,
        displayName: user.displayName,
        email: user.email,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt.toISOString(),
        matchPickCount: user.matchPredictions.length,
        tournamentReady
      };
    }) as AdminUser[]
  };
}
