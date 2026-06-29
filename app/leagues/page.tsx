export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";

import { JoinLeagueForm } from "@/components/JoinLeagueForm";
import { userHasAdminAccess } from "@/lib/auth/admin-email";
import { requireUser } from "@/lib/auth/user";
import { getUserLeagues } from "@/lib/leagues";

export default async function LeaguesPage() {
  const user = await requireUser();
  const leagues = await getUserLeagues(user.id);
  const isAdmin = userHasAdminAccess(user);

  if (leagues.length === 0 && isAdmin) {
    redirect("/admin");
  }

  if (leagues.length === 0) {
    return (
      <main className="page-shell">
        <section className="section">
          <div className="section__heading">
            <p className="eyebrow">Your leagues</p>
            <h2>Join a league to get started</h2>
          </div>
          <p className="section__copy">
            Ask your league organizer for the signup link and invite code. If you need a new account, use your
            group&apos;s signup page — not the general login page.
          </p>
          <JoinLeagueForm />
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <section className="section">
        <div className="section__heading section__heading--wide">
          <p className="eyebrow">Your leagues</p>
          <h2>Choose a league</h2>
        </div>
        <div className="card-grid card-grid--leagues">
          {leagues.map((league) => (
            <Link className="card card--feature" href={`/l/${league.slug}`} key={league.id}>
              <p className="card__label">{league.subtitle}</p>
              <h3>{league.name}</h3>
              <p className="section__copy">Open dashboard</p>
            </Link>
          ))}
        </div>
      </section>
      <section className="section section--compact">
        <div className="section__heading">
          <p className="eyebrow">Another group?</p>
          <h2>Join another league</h2>
        </div>
        <JoinLeagueForm />
      </section>
    </main>
  );
}
