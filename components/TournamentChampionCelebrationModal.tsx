"use client";

import { useState, useTransition } from "react";

import { FireworksOverlay } from "@/components/FireworksOverlay";
import { TournamentCelebration } from "@/lib/tournament-announcement";
import { TOURNAMENT_AWARD_POINTS } from "@/lib/tournament-scoring";

type TournamentChampionCelebrationModalProps = {
  leagueSlug: string;
  celebration: TournamentCelebration;
  onFinished?: () => void;
};

function formatWinnerLabel(winners: TournamentCelebration["topPicksWinners"]) {
  if (winners.length === 0) {
    return null;
  }

  if (winners.length === 1) {
    return winners[0].displayName;
  }

  return winners.map((winner) => winner.displayName).join(" & ");
}

export function TournamentChampionCelebrationModal({
  leagueSlug,
  celebration,
  onFinished
}: TournamentChampionCelebrationModalProps) {
  const [visible, setVisible] = useState(true);
  const [pending, startTransition] = useTransition();
  const topPicksLabel = formatWinnerLabel(celebration.topPicksWinners);
  const topPicksPoints = celebration.topPicksWinners[0]?.totalPoints ?? 0;
  const topPicksHits = celebration.topPicksWinners[0]?.hits ?? 0;
  const isTie = celebration.topPicksWinners.length > 1;

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

        {topPicksLabel ? (
          <div className="group-stage-celebration__top-picks">
            <p className="group-stage-celebration__top-picks-label">
              {isTie ? "Top picks co-champions" : "Top picks champion"}
            </p>
            <strong>{topPicksLabel}</strong>
            <span>
              {topPicksHits} hit{topPicksHits === 1 ? "" : "s"} · {topPicksPoints} pts
              {isTie ? " each" : ""} ({TOURNAMENT_AWARD_POINTS} pts per award)
            </span>
          </div>
        ) : null}

        <p className="group-stage-celebration__copy">
          Official awards are locked in. Check the Top picks leaderboard to see every manager&apos;s predictions
          against the final results.
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
              window.setTimeout(() => {
                document.getElementById("top-picks-leaders")?.scrollIntoView({
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
