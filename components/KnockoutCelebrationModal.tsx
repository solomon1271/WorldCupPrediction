"use client";

import { useState, useTransition } from "react";

import { FireworksOverlay } from "@/components/FireworksOverlay";
import { KnockoutCelebration } from "@/lib/knockout-announcement";

type KnockoutCelebrationModalProps = {
  leagueSlug: string;
  celebration: KnockoutCelebration;
  onFinished?: () => void;
};

function formatWinnerLabel(winners: KnockoutCelebration["winners"]) {
  if (winners.length === 1) {
    return winners[0].displayName;
  }

  return winners.map((winner) => winner.displayName).join(" & ");
}

export function KnockoutCelebrationModal({
  leagueSlug,
  celebration,
  onFinished
}: KnockoutCelebrationModalProps) {
  const [visible, setVisible] = useState(true);
  const [pending, startTransition] = useTransition();
  const isTie = celebration.winners.length > 1;
  const winnerPoints = celebration.winners[0]?.totalPoints ?? 0;

  if (!visible) {
    return null;
  }

  return (
    <div className="group-stage-celebration-backdrop" role="presentation">
      <FireworksOverlay active />
      <div
        className="group-stage-celebration"
        role="dialog"
        aria-modal="true"
        aria-labelledby="knockout-celebration-title"
      >
        <p className="group-stage-celebration__eyebrow">Knockout complete</p>
        <h2 id="knockout-celebration-title">
          {isTie ? "Knockout co-champions" : "Knockout champion"}
        </h2>
        <p className="group-stage-celebration__finale">
          Final: <strong>{celebration.finaleLabel}</strong>
        </p>

        <div className="group-stage-celebration__hero">
          <span className="group-stage-celebration__burst" aria-hidden="true">
            🏆
          </span>
          <strong>{formatWinnerLabel(celebration.winners)}</strong>
          <span className="group-stage-celebration__points">
            {winnerPoints} knockout point{winnerPoints === 1 ? "" : "s"}
            {isTie ? " each" : ""}
          </span>
        </div>

        <p className="group-stage-celebration__copy">
          {isTie
            ? "These managers lead the knockout board after every Round of 16 through Final pick was scored."
            : "This manager leads the knockout board after every Round of 16 through Final pick was scored."}
        </p>

        <button
          className="primary-button group-stage-celebration__button"
          type="button"
          disabled={pending}
          onClick={() => {
            startTransition(async () => {
              await fetch(`/api/leagues/${leagueSlug}/knockout-reveal`, {
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
