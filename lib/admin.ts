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
    tournamentPrediction: true;
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
      tournamentPrediction: true
    },
    orderBy: [{ createdAt: "asc" }]
  });

  return {
    users: users.map((user) => {
      return {
        id: user.id,
        displayName: user.displayName,
        email: user.email,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt.toISOString(),
        matchPickCount: user.matchPredictions.length,
        tournamentReady: Boolean(
          user.tournamentPrediction?.champion &&
            user.tournamentPrediction?.runnerUp &&
            user.tournamentPrediction?.goldenBoot &&
            user.tournamentPrediction?.bestYoungPlayer
        )
      };
    }) as AdminUser[]
  };
}
