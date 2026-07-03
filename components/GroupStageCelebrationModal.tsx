"use client";

import { useState, useTransition } from "react";

import { FireworksOverlay } from "@/components/FireworksOverlay";
import { GroupStageCelebration } from "@/lib/group-stage-announcement";

type GroupStageCelebrationModalProps = {
  leagueSlug: string;
  celebration: GroupStageCelebration;
  onFinished?: () => void;
};

function formatWinnerLabel(winners: GroupStageCelebration["winners"]) {
  if (winners.length === 1) {
    return winners[0].displayName;
  }

  return winners.map((winner) => winner.displayName).join(" & ");
}

export function GroupStageCelebrationModal({
  leagueSlug,
  celebration,
  onFinished
}: GroupStageCelebrationModalProps) {
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
        aria-labelledby="group-stage-celebration-title"
      >
        <p className="group-stage-celebration__eyebrow">Group stage complete</p>
        <h2 id="group-stage-celebration-title">
          {isTie ? "Group stage co-champions" : "Group stage champion"}
        </h2>
        <p className="group-stage-celebration__finale">
          Final group match: <strong>{celebration.finaleLabel}</strong>
        </p>

        <div className="group-stage-celebration__hero">
          <span className="group-stage-celebration__burst" aria-hidden="true">
            🎆
          </span>
          <strong>{formatWinnerLabel(celebration.winners)}</strong>
          <span className="group-stage-celebration__points">
            {winnerPoints} group-stage point{winnerPoints === 1 ? "" : "s"}
            {isTie ? " each" : ""}
          </span>
        </div>

        <p className="group-stage-celebration__copy">
          {isTie
            ? "These players lead your league after every group-stage pick was scored."
            : "This player leads your league after every group-stage pick was scored."}
        </p>

        <p className="group-stage-celebration__knockout">
          The knockout stage starts fresh. Round of 32 picks open a new chapter, so more players still have a real
          chance to climb the board.
        </p>

        <button
          className="primary-button group-stage-celebration__button"
          type="button"
          disabled={pending}
          onClick={() => {
            startTransition(async () => {
              await fetch(`/api/leagues/${leagueSlug}/group-stage-reveal`, {
                method: "POST",
                credentials: "same-origin"
              });

              setVisible(false);
              onFinished?.();
            });
          }}
        >
          {pending ? "Saving..." : "Bring on the knockouts"}
        </button>
      </div>
    </div>
  );
}
