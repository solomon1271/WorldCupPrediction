export const dynamic = "force-dynamic";

import { AdminPortal } from "@/components/AdminPortal";
import { Header } from "@/components/Header";
import { getAdminDashboardData } from "@/lib/admin";
import { requireAdmin } from "@/lib/auth/user";

export default async function AdminPage() {
  const user = await requireAdmin();
  const dashboard = await getAdminDashboardData();

  return (
    <main className="page-shell">
      <Header currentUserName={user.displayName} isAdmin variant="admin" />
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
              <li>In Neon SQL Editor, clear any stale production test results if a real match is showing as finished when it should not be.</li>
              <li>In Vercel Settings → Environment Variables, confirm DATABASE_URL, AUTH_SECRET, INVITE_CODE, ADMIN_EMAIL, CRON_SECRET, MATCH_SYNC_URL, and MATCH_LOCK_LEAD_MINUTES are all set.</li>
              <li>In Vercel Deployments, verify the latest deployment is green and open the live URL from there.</li>
              <li>In Vercel Functions / Cron logs, verify /api/cron/matches-sync and /api/cron/matches-lock are executing on schedule.</li>
              <li>When playoff winners become known, update public/match-sync.json in GitHub and push so production can pull the new matchup feed.</li>
            </ol>
          </article>
        </div>

        <section className="section section--compact">
          <div className="section__heading">
            <p className="eyebrow">Neon SQL</p>
            <h2>One-off cleanup query</h2>
          </div>
          <p className="section__copy">
            If production is showing a fake or stale official result for Match 1, run this in Neon SQL Editor against the same database branch used by Vercel.
          </p>
          <pre className="code-block">{`UPDATE "Match"
SET
  "finalHomeScore" = NULL,
  "finalAwayScore" = NULL,
  "finalYellowCards" = NULL,
  "finalTotalCorners" = NULL,
  "finalRedCards" = NULL,
  "isLocked" = false
WHERE "id" = 1;`}</pre>
        </section>

        <a className="section__jump" href="#top">
          Back to top
        </a>
      </section>
    </main>
  );
}
