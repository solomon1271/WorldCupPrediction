"use client";

import { useEffect, useState } from "react";

import type { GroupStageInsight, GroupStageInsightsPayload } from "@/lib/group-stage-insights";
import { getPlayerAvatarHue, getPlayerInitials } from "@/lib/leaderboard-presentation";

type GroupStageInsightsProps = {
  leagueSlug: string;
};

function InsightCard({ insight }: { insight: GroupStageInsight }) {
  return (
    <article className={`group-stage-insight group-stage-insight--${insight.category}`}>
      <div className="group-stage-insight__header">
        <span className="group-stage-insight__emoji" aria-hidden="true">
          {insight.emoji}
        </span>
        <div>
          <p className="group-stage-insight__title">{insight.title}</p>
          {insight.matchLabel ? <p className="group-stage-insight__match">{insight.matchLabel}</p> : null}
        </div>
      </div>
      <h3 className="group-stage-insight__headline">{insight.headline}</h3>
      <p className="group-stage-insight__detail">{insight.detail}</p>
      {typeof insight.points === "number" ? (
        <span className="group-stage-insight__points">
          {insight.category === "sharpshooter"
            ? `${insight.points} exact score${insight.points === 1 ? "" : "s"}`
            : `${insight.points} pts`}
        </span>
      ) : null}
    </article>
  );
}

export function GroupStageInsights({ leagueSlug }: GroupStageInsightsProps) {
  const [payload, setPayload] = useState<GroupStageInsightsPayload>({
    leagueHighlights: [],
    managerInsights: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadInsights() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/leagues/${leagueSlug}/group-stage-insights`);
        const data = (await response.json()) as GroupStageInsightsPayload & {
          ok?: boolean;
          error?: string;
        };

        if (!response.ok) {
          throw new Error(data.error || "Could not load group stage insights.");
        }

        if (!cancelled) {
          setPayload({
            leagueHighlights: data.leagueHighlights ?? [],
            managerInsights: data.managerInsights ?? []
          });
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Could not load group stage insights.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadInsights();

    return () => {
      cancelled = true;
    };
  }, [leagueSlug]);

  if (loading) {
    return (
      <div className="group-stage-insights group-stage-insights--loading">
        <p>Scanning group stage picks for the wildest stories…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="group-stage-insights group-stage-insights--error">
        <p>{error}</p>
      </div>
    );
  }

  if (payload.leagueHighlights.length === 0 && payload.managerInsights.length === 0) {
    return (
      <div className="group-stage-insights group-stage-insights--empty">
        <p>No group stage insights yet. Once finished matches have predictions, the best stories will show up here.</p>
      </div>
    );
  }

  return (
    <div className="group-stage-insights">
      {payload.leagueHighlights.length > 0 ? (
        <section className="group-stage-insights__section">
          <div className="group-stage-insights__section-heading">
            <p className="group-stage-insights__section-eyebrow">League standouts</p>
            <h3 className="group-stage-insights__section-title">The wildest group stage moments</h3>
          </div>
          <div className="group-stage-insights__grid">
            {payload.leagueHighlights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        </section>
      ) : null}

      {payload.managerInsights.length > 0 ? (
        <section className="group-stage-insights__section">
          <div className="group-stage-insights__section-heading">
            <p className="group-stage-insights__section-eyebrow">Every manager</p>
            <h3 className="group-stage-insights__section-title">One highlight per manager</h3>
          </div>
          <div className="group-stage-insights__manager-grid">
            {payload.managerInsights.map((insight) => (
              <article
                key={insight.id}
                className={`group-stage-manager-insight group-stage-insight--${insight.category}`}
              >
                <div className="group-stage-manager-insight__identity">
                  <span
                    className="leaderboard-avatar group-stage-manager-insight__avatar"
                    style={
                      {
                        "--avatar-hue": `${getPlayerAvatarHue(insight.playerName)}deg`
                      } as React.CSSProperties & Record<string, string>
                    }
                    aria-hidden="true"
                  >
                    {getPlayerInitials(insight.playerName)}
                  </span>
                  <div>
                    <p className="group-stage-manager-insight__name">{insight.playerName}</p>
                    <p className="group-stage-insight__title">
                      {insight.emoji} {insight.title}
                    </p>
                  </div>
                </div>
                <h4 className="group-stage-insight__headline">{insight.headline}</h4>
                <p className="group-stage-insight__detail">{insight.detail}</p>
                {insight.matchLabel ? <p className="group-stage-insight__match">{insight.matchLabel}</p> : null}
                {typeof insight.points === "number" ? (
                  <span className="group-stage-insight__points">
                    {insight.category === "sharpshooter"
                      ? `${insight.points} exact score${insight.points === 1 ? "" : "s"}`
                      : `${insight.points} pts`}
                  </span>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
