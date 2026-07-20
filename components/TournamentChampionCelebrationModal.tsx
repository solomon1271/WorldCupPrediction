"use client";

import { useState, useTransition } from "react";

import { FireworksOverlay } from "@/components/FireworksOverlay";
import { TournamentCelebration } from "@/lib/tournament-announcement";

type TournamentChampionCelebrationModalProps = {
  leagueSlug: string;
  celebration: TournamentCelebration;
  onFinished?: () => void;
};

export function TournamentChampionCelebrationModal({
  leagueSlug,
  celebration,
  onFinished
}: TournamentChampionCelebrationModalProps) {
  const [visible, setVisible] = useState(true);
  const [pending, startTransition] = useTransition();

  if (!visible) {
    return null;
  }

  return (
    <div className="group-stage-celebration-backdrop" role="presentation">
      <FireworksOverlay active hues={celebration.fireworkHues} />
      <div
        className="group-stage-celebration group-stage-celebration--spain"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tournament-champion-celebration-title"
        style={{ "--champion-accent": celebration.championAccent } as React.CSSProperties}
      >
        <p className="group-stage-celebration__eyebrow">World Cup complete</p>
        <h2 id="tournament-champion-celebration-title">{celebration.champion} are champions</h2>
        <p className="group-stage-celebration__finale">
          Final: <strong>{celebration.finaleLabel}</strong>
          {celebration.runnerUp ? (
            <>
              {" "}
              · Runner-up <strong>{celebration.runnerUp}</strong>
            </>
          ) : null}
        </p>

        <div className="group-stage-celebration__hero">
          <span className="group-stage-celebration__burst" aria-hidden="true">
            🏆
          </span>
          <strong>{celebration.champion}</strong>
          <span className="group-stage-celebration__points">2026 World Cup winners</span>
        </div>

        <p className="group-stage-celebration__copy">
          Next up: the knockout prediction champion, then the Top picks award winners.
        </p>

        <button
          className="primary-button group-stage-celebration__button"
          type="button"
          disabled={pending}
          onClick={() => {
            startTransition(async () => {
              await fetch(`/api/leagues/${leagueSlug}/tournament-reveal`, {
                method: "POST",
                credentials: "same-origin"
              });

              setVisible(false);
              onFinished?.();
            });
          }}
        >
          {pending ? "Saving..." : "Continue"}
        </button>
      </div>
    </div>
  );
}
