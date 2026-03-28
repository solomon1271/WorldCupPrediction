 "use client";

import { useState } from "react";

import { DashboardTournamentPrediction } from "@/lib/dashboard";
import { TournamentPredictionForm } from "@/components/TournamentPredictionForm";

type TournamentPicksProps = {
  prediction: DashboardTournamentPrediction;
};

export function TournamentPicks({ prediction }: TournamentPicksProps) {
  const [localPrediction, setLocalPrediction] = useState(prediction);

  return (
    <section id="tournament-picks" className="section">
      <div className="section__heading">
        <p className="eyebrow">Beyond Single Matches</p>
      </div>
      <div className="card-grid card-grid--wide">
        <article className="card card--feature">
          <span className="card__label">Bracket futures</span>
          <dl className="details-list">
            <div>
              <dt>Champion</dt>
              <dd>{localPrediction.champion || "Not picked yet"}</dd>
            </div>
            <div>
              <dt>Runner-up</dt>
              <dd>{localPrediction.runnerUp || "Not picked yet"}</dd>
            </div>
            <div>
              <dt>Golden Boot</dt>
              <dd>{localPrediction.goldenBoot || "Not picked yet"}</dd>
            </div>
            <div>
              <dt>Best Young Player</dt>
              <dd>{localPrediction.bestYoungPlayer || "Not picked yet"}</dd>
            </div>
          </dl>
        </article>
        <article className="card">
          <span className="card__label">Editable picks</span>
          <h3>Save your tournament picks</h3>
          <TournamentPredictionForm prediction={localPrediction} onSaved={setLocalPrediction} />
        </article>
      </div>
      <a className="section__jump" href="#top">
        Back to top
      </a>
    </section>
  );
}
