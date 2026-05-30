"use client";

import { useEffect, useState, useTransition } from "react";

import { LeagueSummary, normalizeLeagueSlug } from "@/lib/league-types";

type AdminLeaguesPanelProps = {
  initialLeagues: LeagueSummary[];
};

type CreateLeagueResponse = {
  error?: string;
  ok?: boolean;
  league?: LeagueSummary;
  signupUrl?: string;
  dashboardUrl?: string;
};

function leaguePaths(slug: string) {
  return {
    signupPath: `/l/${slug}/signup`,
    dashboardPath: `/l/${slug}`,
    loginPath: `/l/${slug}/login`
  };
}

function ShareLink({ label, path, origin }: { label: string; path: string; origin: string }) {
  const url = origin ? `${origin}${path}` : path;

  return (
    <div>
      <dt>{label}</dt>
      <dd>
        <a href={path}>{url}</a>
      </dd>
    </div>
  );
}

export function AdminLeaguesPanel({ initialLeagues }: AdminLeaguesPanelProps) {
  const [leagues, setLeagues] = useState(initialLeagues);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  return (
    <section id="admin-leagues" className="section">
      <div className="section__heading">
        <p className="eyebrow">Leagues</p>
        <h2>Create and manage private leagues</h2>
      </div>
      <p className="section__copy">
        Share each league&apos;s <strong>signup link</strong> and <strong>invite code</strong> with that group. New members
        use both to join; returning members use the login link.
      </p>

      <div className="card-grid card-grid--wide">
        <article className="card card--feature">
          <p className="card__label">Create league</p>
          <form
            className="admin-form"
            onSubmit={(event) => {
              event.preventDefault();
              const form = event.currentTarget;
              const formData = new FormData(form);
              const payload = {
                slug: String(formData.get("slug") || ""),
                name: String(formData.get("name") || ""),
                inviteCode: String(formData.get("inviteCode") || ""),
                subtitle: String(formData.get("subtitle") || "") || undefined
              };

              startTransition(async () => {
                setError(null);
                setSuccess(null);

                const response = await fetch("/api/admin/leagues", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(payload)
                });

                const result = (await response.json()) as CreateLeagueResponse;

                if (!response.ok || !result.league) {
                  setError(result.error || "Could not create league.");
                  return;
                }

                setLeagues((current) => [...current, result.league!].sort((a, b) => a.name.localeCompare(b.name)));
                setSuccess(`${result.league.name} is ready. Share links are in the list on the right.`);
                form.reset();
                const slugInput = form.elements.namedItem("slug") as HTMLInputElement | null;
                if (slugInput) {
                  delete slugInput.dataset.touched;
                }
              });
            }}
          >
            <label>
              <span>League name (page title)</span>
              <input
                name="name"
                type="text"
                placeholder="Fair Wind World Cup Prediction"
                required
                onChange={(event) => {
                  const slugInput = event.currentTarget.form?.elements.namedItem("slug") as HTMLInputElement | null;
                  if (slugInput && !slugInput.dataset.touched) {
                    slugInput.value = normalizeLeagueSlug(event.target.value);
                  }
                }}
              />
            </label>
            <label>
              <span>URL slug</span>
              <input
                name="slug"
                type="text"
                placeholder="fairwind"
                required
                onChange={(event) => {
                  event.currentTarget.dataset.touched = "true";
                }}
              />
            </label>
            <label>
              <span>Invite code</span>
              <input name="inviteCode" type="text" placeholder="fairwind-invite-code" required />
            </label>
            <label>
              <span>Subtitle (optional)</span>
              <input name="subtitle" type="text" placeholder="2026 World Cup Challenge" />
            </label>
            {error ? <p className="form-error">{error}</p> : null}
            {success ? <p className="form-success">{success}</p> : null}
            <button className="primary-button" type="submit" disabled={pending}>
              {pending ? "Creating..." : "Create league"}
            </button>
          </form>
        </article>

        <article className="card">
          <p className="card__label">Share links</p>
          {leagues.length === 0 ? (
            <p className="section__copy">No leagues yet. Create your first one on the left.</p>
          ) : (
            <div className="league-share-list">
              {leagues.map((league) => {
                const paths = leaguePaths(league.slug);

                return (
                  <div className="league-share-card" key={league.id}>
                    <h3>{league.name}</h3>
                    <dl className="details-list">
                      <div>
                        <dt>Invite code (share with the group)</dt>
                        <dd>
                          <code>{league.inviteCode}</code>
                        </dd>
                      </div>
                      <ShareLink label="Signup link (new members)" path={paths.signupPath} origin={origin} />
                      <ShareLink label="Login link (returning members)" path={paths.loginPath} origin={origin} />
                      <ShareLink label="Dashboard" path={paths.dashboardPath} origin={origin} />
                    </dl>
                  </div>
                );
              })}
            </div>
          )}
        </article>
      </div>
    </section>
  );
}
