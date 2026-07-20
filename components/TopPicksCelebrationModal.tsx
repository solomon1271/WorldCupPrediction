"use client";

import { useState, useTransition } from "react";

import { FireworksOverlay } from "@/components/FireworksOverlay";
import { TopPicksCelebration } from "@/lib/top-picks-announcement";

type TopPicksCelebrationModalProps = {
  leagueSlug: string;
  celebration: TopPicksCelebration;
  onFinished?: () => void;
};

function formatWinnerLabel(winners: TopPicksCelebration["winners"]) {
  if (winners.length === 1) {
    return winners[0].displayName;
  }

  return winners.map((winner) => winner.displayName).join(" & ");
}

export function TopPicksCelebrationModal({
  leagueSlug,
  celebration,
  onFinished
}: TopPicksCelebrationModalProps) {
  const [visible, setVisible] = useState(true);
  const [pending, startTransition] = useTransition();
  const isTie = celebration.winners.length > 1;
  const winner = celebration.winners[0];
  const winnerPoints = winner?.totalPoints ?? 0;
  const winnerHits = winner?.hits ?? 0;

  if (!visible) {
    return null;
  }

  return (
    <div className="group-stage-celebration-backdrop" role="presentation">
      <FireworksOverlay active hues={[42, 48, 0, 6, 355]} />
      <div
        className="group-stage-celebration group-stage-celebration--spain"
        role="dialog"
        aria-modal="true"
        aria-labelledby="top-picks-celebration-title"
      >
        <p className="group-stage-celebration__eyebrow">Top picks complete</p>
        <h2 id="top-picks-celebration-title">
          {isTie ? "Top picks co-champions" : "Top picks champion"}
        </h2>
        <p className="group-stage-celebration__finale">
          Official awards are locked in. This ranking is separate from knockout match points.
        </p>

        <div className="group-stage-celebration__hero">
          <span className="group-stage-celebration__burst" aria-hidden="true">
            ⭐
          </span>
          <strong>{formatWinnerLabel(celebration.winners)}</strong>
          <span className="group-stage-celebration__points">
            {winnerHits} hit{winnerHits === 1 ? "" : "s"} · {winnerPoints} pts
            {isTie ? " each" : ""} ({celebration.awardPoints} pts per award)
          </span>
        </div>

        <dl className="group-stage-celebration__awards">
          <div>
            <dt>Champion</dt>
            <dd>{celebration.awards.champion || "—"}</dd>
          </div>
          <div>
            <dt>Runner-up</dt>
            <dd>{celebration.awards.runnerUp || "—"}</dd>
          </div>
          <div>
            <dt>Golden Boot</dt>
            <dd>{celebration.awards.goldenBoot || "—"}</dd>
          </div>
          <div>
            <dt>Best Young Player</dt>
            <dd>{celebration.awards.bestYoungPlayer || "—"}</dd>
          </div>
          <div>
            <dt>Golden Glove</dt>
            <dd>{celebration.awards.goldenGlove || "—"}</dd>
          </div>
          <div>
            <dt>Best Player</dt>
            <dd>{celebration.awards.bestPlayer || "—"}</dd>
          </div>
        </dl>

        <p className="group-stage-celebration__copy">
          Open the Top picks tab to see every manager&apos;s predictions against these results.
        </p>

        <button
          className="primary-button group-stage-celebration__button"
          type="button"
          disabled={pending}
          onClick={() => {
            startTransition(async () => {
              await fetch(`/api/leagues/${leagueSlug}/top-picks-reveal`, {
                method: "POST",
                credentials: "same-origin"
              });

              setVisible(false);
              onFinished?.();
              window.setTimeout(() => {
                document.getElementById("leaderboard")?.scrollIntoView({
                  behavior: "smooth",
                  block: "start"
                });
              }, 50);
            });
          }}
        >
          {pending ? "Saving..." : "See Top picks leaders"}
        </button>
      </div>
    </div>
  );
}
