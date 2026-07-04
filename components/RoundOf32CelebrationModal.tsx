"use client";

import { useState, useTransition } from "react";

import { FireworksOverlay } from "@/components/FireworksOverlay";
import { RoundOf32Celebration } from "@/lib/round-of-32-announcement";

type RoundOf32CelebrationModalProps = {
  leagueSlug: string;
  celebration: RoundOf32Celebration;
  onFinished?: () => void;
};

function formatWinnerLabel(winners: RoundOf32Celebration["winners"]) {
  if (winners.length === 1) {
    return winners[0].displayName;
  }

  return winners.map((winner) => winner.displayName).join(" & ");
}

export function RoundOf32CelebrationModal({
  leagueSlug,
  celebration,
  onFinished
}: RoundOf32CelebrationModalProps) {
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
        aria-labelledby="round-of-32-celebration-title"
      >
        <p className="group-stage-celebration__eyebrow">Round of 32 complete</p>
        <h2 id="round-of-32-celebration-title">
          {isTie ? "Round of 32 co-champions" : "Round of 32 champion"}
        </h2>
        <p className="group-stage-celebration__finale">
          Final Round of 32 match: <strong>{celebration.finaleLabel}</strong>
        </p>

        <div className="group-stage-celebration__hero">
          <span className="group-stage-celebration__burst" aria-hidden="true">
            🎆
          </span>
          <strong>{formatWinnerLabel(celebration.winners)}</strong>
          <span className="group-stage-celebration__points">
            {winnerPoints} Round of 32 point{winnerPoints === 1 ? "" : "s"}
            {isTie ? " each" : ""}
          </span>
        </div>

        <p className="group-stage-celebration__copy">
          {isTie
            ? "These players lead your league after every Round of 32 pick was scored."
            : "This player leads your league after every Round of 32 pick was scored."}
        </p>

        <p className="group-stage-celebration__knockout">
          The knockout leaderboard resets from match 89. Round of 16 picks open a fresh race, so more players still
          have a real chance to climb the board.
        </p>

        <button
          className="primary-button group-stage-celebration__button"
          type="button"
          disabled={pending}
          onClick={() => {
            startTransition(async () => {
              await fetch(`/api/leagues/${leagueSlug}/round-of-32-reveal`, {
                method: "POST",
                credentials: "same-origin"
              });

              setVisible(false);
              onFinished?.();
            });
          }}
        >
          {pending ? "Saving..." : "Bring on the Round of 16"}
        </button>
      </div>
    </div>
  );
}
