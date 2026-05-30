import { notFound, redirect } from "next/navigation";

import { Header } from "@/components/Header";
import { RulesPanel } from "@/components/RulesPanel";
import { userHasAdminAccess } from "@/lib/auth/admin-email";
import { requireUser } from "@/lib/auth/user";
import { getDashboardData } from "@/lib/dashboard";
import { getLeagueBySlug, userBelongsToLeague } from "@/lib/leagues";

type LeagueHelpPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function LeagueHelpPage({ params }: LeagueHelpPageProps) {
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
      <Header currentUserName={dashboard.currentUserName} isAdmin={isAdmin} league={league} variant="help" />
      <section className="section">
        <div className="section__heading">
          <p className="eyebrow">Help</p>
          <h2>League rules and scoring</h2>
        </div>
        <p className="section__copy">
          Use this page whenever you want to check how picks are scored for {league.name}.
        </p>
        <a className="section__jump" href="#top">
          Back to top
        </a>
      </section>
      <RulesPanel />
    </main>
  );
}
