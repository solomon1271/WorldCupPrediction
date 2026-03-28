import { prisma } from "@/lib/prisma";
import { readSessionCookie } from "@/lib/auth/session";

export async function getSessionUser() {
  const session = await readSessionCookie();

  if (!session?.sub) {
    return null;
  }

  return prisma.user.findUnique({
    where: {
      id: session.sub
    }
  });
}
