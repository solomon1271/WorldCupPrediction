export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { Header } from "@/components/Header";
import { Leaderboard } from "@/components/Leaderboard";
import { LeaderboardNote } from "@/components/LeaderboardNote";
import { MatchesBoard } from "@/components/MatchesBoard";
import { TournamentPicks } from "@/components/TournamentPicks";
import { userHasAdminAccess } from "@/lib/auth/admin-email";
import { requireUser } from "@/lib/auth/user";
import { getDashboardData } from "@/lib/dashboard";
import { getLeagueBySlug, userBelongsToLeague } from "@/lib/leagues";

type LeagueDashboardPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: LeagueDashboardPageProps): Promise<Metadata> {
  const { slug } = await params;
  const league = await getLeagueBySlug(slug);

  return {
    title: league?.name || "World Cup Prediction",
    description: league ? `${league.name} — private tournament prediction league.` : "Private tournament prediction app."
  };
}

export default async function LeagueDashboardPage({ params }: LeagueDashboardPageProps) {
  const { slug } = await params;
  const user = await requireUser();
  const league = await getLeagueBySlug(slug);

  if (!league) {
    notFound();
  }

  const isMember = await userBelongsToLeague(user.id, league.id);

  if (!isMember) {
    redirect(`/l/${slug}/join`);
  }

  const dashboard = await getDashboardData(league.id, user.id);
  const isAdmin = userHasAdminAccess(user);

  return (
    <main className="page-shell">
      <Header currentUserName={dashboard.currentUserName} isAdmin={isAdmin} league={league} />
      <MatchesBoard leagueSlug={league.slug} matches={dashboard.matches} predictions={dashboard.myPredictions} />
      <TournamentPicks leagueSlug={league.slug} prediction={dashboard.tournamentPrediction} />
      <LeaderboardNote />
      <Leaderboard standings={dashboard.leaderboard} />
    </main>
  );
}
