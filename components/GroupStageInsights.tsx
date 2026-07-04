"use client";

import { useEffect, useState } from "react";

import type { GroupStageInsight } from "@/lib/group-stage-insights";

type GroupStageInsightsProps = {
  leagueSlug: string;
};

export function GroupStageInsights({ leagueSlug }: GroupStageInsightsProps) {
  const [insights, setInsights] = useState<GroupStageInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadInsights() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/leagues/${leagueSlug}/group-stage-insights`);
        const payload = (await response.json()) as { ok?: boolean; insights?: GroupStageInsight[]; error?: string };

        if (!response.ok) {
          throw new Error(payload.error || "Could not load group stage insights.");
        }

        if (!cancelled) {
          setInsights(payload.insights ?? []);
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

  if (insights.length === 0) {
    return (
      <div className="group-stage-insights group-stage-insights--empty">
        <p>No group stage insights yet. Once finished matches have predictions, the best stories will show up here.</p>
      </div>
    );
  }

  return (
    <div className="group-stage-insights">
      <div className="group-stage-insights__grid">
        {insights.map((insight) => (
          <article key={insight.id} className={`group-stage-insight group-stage-insight--${insight.category}`}>
            <div className="group-stage-insight__header">
              <span className="group-stage-insight__emoji" aria-hidden="true">
                {insight.emoji}
              </span>
              <div>
                <p className="group-stage-insight__title">{insight.title}</p>
                {insight.matchLabel ? (
                  <p className="group-stage-insight__match">{insight.matchLabel}</p>
                ) : null}
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
        ))}
      </div>
    </div>
  );
}
