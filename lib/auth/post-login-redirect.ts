import { userHasAdminAccess } from "@/lib/auth/admin-email";
import { getUserLeagues } from "@/lib/leagues";

type SessionUser = {
  id: string;
  email: string;
  isAdmin: boolean;
};

export async function getPostLoginRedirectPath(user: SessionUser, preferredLeagueSlug?: string | null) {
  const leagues = await getUserLeagues(user.id);
  const isAdmin = userHasAdminAccess(user);

  if (preferredLeagueSlug && leagues.some((league) => league.slug === preferredLeagueSlug)) {
    return `/l/${preferredLeagueSlug}`;
  }

  if (leagues.length === 1) {
    return `/l/${leagues[0].slug}`;
  }

  if (leagues.length > 1) {
    return "/leagues";
  }

  if (isAdmin) {
    return "/admin";
  }

  return "/leagues";
}
