"use client";

import { useState } from "react";

import { DashboardTournamentPrediction } from "@/lib/dashboard";
import { TournamentPredictionForm } from "@/components/TournamentPredictionForm";
import { TOURNAMENT_AWARD_POINTS } from "@/lib/tournament-scoring";

type TournamentPicksProps = {
  leagueSlug: string;
  prediction: DashboardTournamentPrediction;
};

const topPickFields: Array<{
  key: "champion" | "runnerUp" | "goldenBoot" | "bestYoungPlayer" | "goldenGlove" | "bestPlayer";
  label: string;
}> = [
  { key: "champion", label: "Champion" },
  { key: "runnerUp", label: "Runner-up" },
  { key: "goldenBoot", label: "Golden Boot" },
  { key: "bestYoungPlayer", label: "Best Young Player" },
  { key: "goldenGlove", label: "Golden Glove" },
  { key: "bestPlayer", label: "Best Player" }
];

export function TournamentPicks({ leagueSlug, prediction }: TournamentPicksProps) {
  const [localPrediction, setLocalPrediction] = useState(prediction);

  return (
    <section id="tournament-picks" className="section">
      <div className="section__heading">
        <p className="eyebrow">Beyond Single Matches</p>
        <p className="section__copy">Each correct top pick earns {TOURNAMENT_AWARD_POINTS} points when official awards are announced.</p>
      </div>
      <div className="card-grid card-grid--wide">
        <article className="card card--feature">
          <span className="card__label">Top picks</span>
          <dl className="details-list">
            {topPickFields.map(({ key, label }) => (
              <div key={key}>
                <dt>
                  {label} <span className="award-points-tag">{TOURNAMENT_AWARD_POINTS} pts</span>
                </dt>
                <dd>{localPrediction[key] || "Not picked yet"}</dd>
              </div>
            ))}
          </dl>
        </article>
        <article className="card">
          <span className="card__label">Editable picks</span>
          <h3>Save your tournament picks</h3>
          <p className="section__copy section__copy--compact">
            Update one pick at a time or fill them all out. Champion and runner-up use the full World Cup country list.
          </p>
          <TournamentPredictionForm leagueSlug={leagueSlug} prediction={localPrediction} onSaved={setLocalPrediction} />
        </article>
      </div>
      <a className="section__jump" href="#top">
        Back to top
      </a>
    </section>
  );
}
