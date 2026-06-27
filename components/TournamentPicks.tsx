"use client";

import { useState } from "react";

import { SectionStoryHeader } from "@/components/SectionStoryHeader";
import { DashboardTournamentPrediction } from "@/lib/dashboard";
import { TournamentPredictionForm } from "@/components/TournamentPredictionForm";
import { TOURNAMENT_AWARD_POINTS } from "@/lib/tournament-scoring";

type TournamentPicksProps = {
  leagueSlug: string;
  prediction: DashboardTournamentPrediction;
  locked: boolean;
  lockLabel: string;
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

function countSavedPicks(prediction: DashboardTournamentPrediction) {
  return topPickFields.filter(({ key }) => Boolean(prediction[key]?.trim())).length;
}

export function TournamentPicks({ leagueSlug, prediction, locked, lockLabel }: TournamentPicksProps) {
  const [localPrediction, setLocalPrediction] = useState(prediction);
  const savedPickCount = countSavedPicks(localPrediction);
  const hasSavedPicks = savedPickCount > 0;

  return (
    <section id="tournament-picks" className={`section${locked ? " section--tournament-locked" : ""}`}>
      <SectionStoryHeader tone="tournament" eyebrow="Awards & destiny" title="Your tournament story">
        {locked ? (
          <div className="tournament-deadline-banner tournament-deadline-banner--locked" role="note">
            <span className="tournament-deadline-banner__mark" aria-hidden="true">
              🔒
            </span>
            <p className="tournament-deadline-banner__text">
              <strong>Top picks are locked.</strong>
              <span>
                This section closed on {lockLabel} when the knockout stage began. Your saved top picks below are final
                and cannot be changed.
              </span>
            </p>
          </div>
        ) : (
          <>
            <p className="section__copy">
              Each correct top pick earns {TOURNAMENT_AWARD_POINTS} points when official awards are announced.
            </p>
            {hasSavedPicks ? (
              <div className="tournament-deadline-banner tournament-deadline-banner--update" role="note">
                <span className="tournament-deadline-banner__mark" aria-hidden="true">
                  !
                </span>
                <p className="tournament-deadline-banner__text">
                  <strong>You can still update your top picks.</strong>
                  <span>
                    {savedPickCount} of {topPickFields.length} saved so far. Picks lock on {lockLabel} when the Round of
                    32 starts — review and update any remaining items below before then.
                  </span>
                </p>
              </div>
            ) : (
              <div className="tournament-deadline-banner" role="note">
                <span className="tournament-deadline-banner__mark" aria-hidden="true">
                  !
                </span>
                <p className="tournament-deadline-banner__text">
                  <strong>Submit all top picks before knockout begins.</strong>
                  <span>
                    Picks lock on {lockLabel} when the Round of 32 starts — add yours below while they are still open.
                  </span>
                </p>
              </div>
            )}
          </>
        )}
      </SectionStoryHeader>
      <div className={`card-grid card-grid--wide${locked ? " card-grid--single" : ""}`}>
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
          {!locked ? (
            <p className="tournament-spelling-note" role="note">
              <strong>Spell player names correctly.</strong> Golden Boot, Best Young Player, Golden Glove, and Best
              Player picks must match the official spelling to count when awards are announced.
            </p>
          ) : null}
        </article>
        {!locked ? (
          <article className="card">
            <span className="card__label">Editable picks</span>
            <h3>{hasSavedPicks ? "Update your tournament picks" : "Save your tournament picks"}</h3>
            <p className="section__copy section__copy--compact">
              {hasSavedPicks
                ? "Change any saved pick below before the knockout stage begins. Champion and runner-up use the full World Cup country list."
                : "Add one pick at a time or fill them all out. Champion and runner-up use the full World Cup country list."}
            </p>
            <TournamentPredictionForm
              leagueSlug={leagueSlug}
              prediction={localPrediction}
              locked={locked}
              onSaved={setLocalPrediction}
            />
          </article>
        ) : null}
      </div>
      <a className="section__jump" href="#top">
        Back to top
      </a>
    </section>
  );
}
