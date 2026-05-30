export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { JoinLeagueForm } from "@/components/JoinLeagueForm";
import { requireUser } from "@/lib/auth/user";
import { getLeagueBySlug, getUserLeagues, userBelongsToLeague } from "@/lib/leagues";

type LeagueLeaguesPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function LeagueLeaguesPage({ params }: LeagueLeaguesPageProps) {
  const { slug } = await params;
  const user = await requireUser();
  const league = await getLeagueBySlug(slug);

  if (!league) {
    notFound();
  }

  const isMember = await userBelongsToLeague(user.id, league.id);

  if (isMember) {
    redirect(`/l/${league.slug}`);
  }

  const myLeagues = await getUserLeagues(user.id);

  return (
    <main className="page-shell">
      <section className="section">
        <div className="section__heading">
          <p className="eyebrow">{league.subtitle}</p>
          <h2>Join {league.name}</h2>
        </div>
        <p className="section__copy">
          You&apos;re signed in as {user.displayName}. Enter this league&apos;s invite code to join.
        </p>
        <JoinLeagueForm />
        {myLeagues.length > 0 ? (
          <p className="section__copy">
            <Link href="/leagues">Back to your leagues</Link>
          </p>
        ) : null}
      </section>
    </main>
  );
}
