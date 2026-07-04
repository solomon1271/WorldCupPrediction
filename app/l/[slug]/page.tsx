export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { GroupStandings } from "@/components/GroupStandings";
import { Header } from "@/components/Header";
import { Leaderboard } from "@/components/Leaderboard";
import { LeagueCelebrations } from "@/components/LeagueCelebrations";
import { MatchesBoard } from "@/components/MatchesBoard";
import { TopPicksReminderBanner } from "@/components/TopPicksReminderBanner";
import { TournamentPicks } from "@/components/TournamentPicks";
import { userHasAdminAccess } from "@/lib/auth/admin-email";
import { requireUser } from "@/lib/auth/user";
import { getDashboardData } from "@/lib/dashboard";
import { getLeagueBySlug, getLeagueMemberDashboardAccess } from "@/lib/leagues";

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
  const access = await getLeagueMemberDashboardAccess(user.id, slug);

  if (access.kind === "not_found") {
    notFound();
  }

  if (access.kind === "not_member") {
    if (access.league.isHidden) {
      redirect("/leagues?unavailable=1");
    }

    redirect(`/l/${slug}/join`);
  }

  if (access.kind === "hidden") {
    redirect("/leagues?unavailable=1");
  }

  const league = access.league;

  const dashboard = await getDashboardData(league.id, user.id);
  const isAdmin = userHasAdminAccess(user);
  const leaguePaused = league.isPaused;
  const topPicksReminder =
    dashboard.tournamentPicksTemporarilyUnlocked &&
    !leaguePaused &&
    dashboard.tournamentPicksUnlockUntilLabel
      ? {
          unlockUntilLabel: dashboard.tournamentPicksUnlockUntilLabel
        }
      : null;

  return (
    <main className="page-shell">
      {leaguePaused ? (
        <div className="league-status-banner" role="note">
          <strong>{league.name} is temporarily paused.</strong> You can review standings and results, but predictions
          are disabled until the league reopens.
        </div>
      ) : null}
      {topPicksReminder ? (
        <TopPicksReminderBanner
          key={dashboard.referenceNow}
          unlockUntilLabel={topPicksReminder.unlockUntilLabel}
        />
      ) : null}
      <LeagueCelebrations
        leagueSlug={league.slug}
        matchAnnouncements={dashboard.matchWinnerRevealAnnouncements}
        groupStageCelebration={dashboard.groupStageCelebration}
        predictionTimeZone={dashboard.predictionTimeZone}
      />
      <Header currentUserName={dashboard.currentUserName} isAdmin={isAdmin} league={league} />
      <MatchesBoard
        leagueSlug={league.slug}
        matches={dashboard.matches}
        predictions={dashboard.myPredictions}
        todayLabel={dashboard.todayLabel}
        timezoneShortName={dashboard.timezoneShortName}
        predictionTimeZone={dashboard.predictionTimeZone}
        referenceNow={dashboard.referenceNow}
        lockLeadMinutes={dashboard.lockLeadMinutes}
        leaguePaused={leaguePaused}
      />
      <TournamentPicks
        leagueSlug={league.slug}
        prediction={dashboard.tournamentPrediction}
        locked={dashboard.tournamentPicksLocked || leaguePaused}
        lockLabel={dashboard.tournamentPicksLockLabel}
        unlockUntilLabel={dashboard.tournamentPicksUnlockUntilLabel}
        temporarilyUnlocked={dashboard.tournamentPicksTemporarilyUnlocked && !leaguePaused}
        leaguePaused={leaguePaused}
      />
      <GroupStandings tables={dashboard.groupStandings} />
      <Leaderboard
        leagueSlug={league.slug}
        knockoutStandings={dashboard.knockoutLeaderboard}
        groupStageStandings={dashboard.groupStageLeaderboard}
        currentUserId={user.id}
      />
    </main>
  );
}
