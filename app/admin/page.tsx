export const dynamic = "force-dynamic";

import { AdminLeaguesPanel } from "@/components/AdminLeaguesPanel";
import { AdminPortal } from "@/components/AdminPortal";
import { Header } from "@/components/Header";
import { getAdminDashboardData } from "@/lib/admin";
import { userHasAdminAccess } from "@/lib/auth/admin-email";
import { requireAdmin } from "@/lib/auth/user";
import { listLeagues } from "@/lib/leagues";

export default async function AdminPage() {
  const user = await requireAdmin();
  const [dashboard, leagues] = await Promise.all([getAdminDashboardData(), listLeagues()]);
  const isAdmin = userHasAdminAccess(user);

  return (
    <main className="page-shell">
      <Header currentUserName={user.displayName} isAdmin={isAdmin} variant="admin" />
      <AdminLeaguesPanel initialLeagues={leagues} />
      <AdminPortal currentUserId={user.id} users={dashboard.users} />

      <section className="section" id="prod-ops">
        <div className="section__heading">
          <p className="eyebrow">Production Ops</p>
          <h2>Vercel + Neon quick notes</h2>
        </div>
        <p className="section__copy">
          Keep this section as the short version of what still needs your hands in production.
        </p>
        <div className="card-grid card-grid--wide">
          <article className="card">
            <p className="card__label">Useful links</p>
            <div className="details-list">
              <div>
                <dt>Vercel dashboard</dt>
                <dd>
                  <a href="https://vercel.com/dashboard" target="_blank" rel="noreferrer">
                    vercel.com/dashboard
                  </a>
                </dd>
              </div>
              <div>
                <dt>New Vercel project</dt>
                <dd>
                  <a href="https://vercel.com/new" target="_blank" rel="noreferrer">
                    vercel.com/new
                  </a>
                </dd>
              </div>
              <div>
                <dt>Neon console</dt>
                <dd>
                  <a href="https://console.neon.tech" target="_blank" rel="noreferrer">
                    console.neon.tech
                  </a>
                </dd>
              </div>
              <div>
                <dt>GitHub repo</dt>
                <dd>
                  <a href="https://github.com/solomon1271/WorldCupPrediction" target="_blank" rel="noreferrer">
                    github.com/solomon1271/WorldCupPrediction
                  </a>
                </dd>
              </div>
              <div>
                <dt>Fixture feed</dt>
                <dd>
                  <a
                    href="https://raw.githubusercontent.com/solomon1271/WorldCupPrediction/main/public/match-sync.json"
                    target="_blank"
                    rel="noreferrer"
                  >
                    raw match-sync.json
                  </a>
                </dd>
              </div>
            </div>
          </article>

          <article className="card card--feature">
            <p className="card__label">What still needs your help</p>
            <ol className="next-list">
              <li>
                <strong>Daily cron:</strong> <code>vercel.json</code> schedules <code>GET /api/cron/daily-maintain</code> once per day at{" "}
                <strong>~8:00 AM Central</strong> (<code>0 13 * * *</code> UTC, ±59 min on Hobby). It syncs fixture/results from{" "}
                <code>MATCH_SYNC_URL</code>, then locks every match kicking off today in <code>CRON_TIMEZONE</code> (default{" "}
                <code>America/Chicago</code>). It also locks any past matches still open. Set <code>CRON_SECRET</code> in Vercel; Vercel sends it automatically on cron invocations.
              </li>
              <li>In Neon SQL Editor, clear any stale production test results if a real match is showing as finished when it should not be.</li>
              <li>
                <strong>Leagues:</strong> open <a href="#admin-leagues">Admin → Leagues</a> to create a new private group with its
                own invite code and page title. Share <code>/l/your-slug/signup</code> with that group.
              </li>
              <li>
                In Vercel Settings → Environment Variables, confirm DATABASE_URL, AUTH_SECRET, ADMIN_EMAIL, CRON_SECRET,
                CRON_TIMEZONE, MATCH_SYNC_URL, and MATCH_LOCK_LEAD_MINUTES are all set.
              </li>
              <li>In Vercel Deployments, verify the latest deployment is green and open the live URL from there.</li>
              <li>
                Manual test: <code>curl -H &quot;Authorization: Bearer CRON_SECRET&quot; https://YOUR-APP.vercel.app/api/cron/daily-maintain</code>{" "}
                or locally <code>npm run matches:maintain:daily</code>.
              </li>
              <li>When playoff winners become known, update public/match-sync.json in GitHub and push so production can pull the new matchup feed.</li>
            </ol>
          </article>
        </div>

        <section className="section section--compact">
          <div className="section__heading">
            <p className="eyebrow">Neon SQL</p>
            <h2>Tournament prep reset</h2>
          </div>
          <p className="section__copy">
            After pushing the restored <code>public/match-sync.json</code>, run this in Neon SQL Editor to remove cron/test
            data, restore Match 1 (Mexico vs South Africa), clear all official results, and wipe leaderboard rank snapshots.
            User accounts and real match picks stay in place except predictions on Match 1 and test match IDs.
          </p>
          <pre className="code-block">{`DELETE FROM "MatchPrediction"
WHERE "matchId" IN (1, 9001, 9002, 9003);

DELETE FROM "Match"
WHERE "id" IN (9001, 9002, 9003);

UPDATE "Match"
SET
  "stage" = 'Group A',
  "kickoff" = '2026-06-11T19:00:00.000Z',
  "venue" = 'Estadio Azteca, Mexico City',
  "homeTeam" = 'Mexico',
  "awayTeam" = 'South Africa',
  "isLocked" = false,
  "finalHomeScore" = NULL,
  "finalAwayScore" = NULL,
  "finalYellowCards" = NULL,
  "finalTotalCorners" = NULL,
  "finalRedCards" = NULL
WHERE "id" = 1;

UPDATE "Match"
SET
  "isLocked" = false,
  "finalHomeScore" = NULL,
  "finalAwayScore" = NULL,
  "finalYellowCards" = NULL,
  "finalTotalCorners" = NULL,
  "finalRedCards" = NULL;

DELETE FROM "LeaderboardState";`}</pre>
        </section>

        <a className="section__jump" href="#top">
          Back to top
        </a>
      </section>
    </main>
  );
}
