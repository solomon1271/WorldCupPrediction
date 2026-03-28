import { Header } from "@/components/Header";
import { RulesPanel } from "@/components/RulesPanel";
import { requireUser } from "@/lib/auth/user";
import { getDashboardData } from "@/lib/dashboard";

export default async function HelpPage() {
  const user = await requireUser();
  const dashboard = await getDashboardData(user.id);

  return (
    <main className="page-shell">
      <Header currentUserName={dashboard.currentUserName} variant="help" />
      <section className="section">
        <div className="section__heading">
          <p className="eyebrow">Help</p>
          <h2>League rules and scoring</h2>
        </div>
        <p className="section__copy">
          Use this page whenever you want to check how picks are scored, including winner, exact score, total goals,
          total corners, yellow cards, and red cards.
        </p>
        <a className="section__jump" href="#top">
          Back to top
        </a>
      </section>
      <RulesPanel />
    </main>
  );
}
