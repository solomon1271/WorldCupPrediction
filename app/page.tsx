export const dynamic = "force-dynamic";

import { Header } from "@/components/Header";
import { Leaderboard } from "@/components/Leaderboard";
import { LeaderboardNote } from "@/components/LeaderboardNote";
import { MatchesBoard } from "@/components/MatchesBoard";
import { TournamentPicks } from "@/components/TournamentPicks";
import { requireUser } from "@/lib/auth/user";
import { getDashboardData } from "@/lib/dashboard";

export default async function Home() {
  const user = await requireUser();
  const dashboard = await getDashboardData(user.id);

  return (
    <main className="page-shell">
      <Header currentUserName={dashboard.currentUserName} />
      <MatchesBoard matches={dashboard.matches} predictions={dashboard.myPredictions} />
      <TournamentPicks prediction={dashboard.tournamentPrediction} />
      <LeaderboardNote />
      <Leaderboard standings={dashboard.leaderboard} />
    </main>
  );
}
