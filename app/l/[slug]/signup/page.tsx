import { notFound, redirect } from "next/navigation";

import { AuthForm } from "@/components/AuthForm";
import { getCurrentUser } from "@/lib/auth/user";
import { getLeagueBySlug, userBelongsToLeague } from "@/lib/leagues";

type LeagueSignupPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function LeagueSignupPage({ params }: LeagueSignupPageProps) {
  const { slug } = await params;
  const league = await getLeagueBySlug(slug);

  if (!league) {
    notFound();
  }

  const user = await getCurrentUser();

  if (user) {
    const isMember = await userBelongsToLeague(user.id, league.id);
    redirect(isMember ? `/l/${league.slug}` : `/l/${league.slug}/join`);
  }

  return <AuthForm mode="signup" league={league} />;
}
