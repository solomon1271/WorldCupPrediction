"use client";

import { useState, useTransition } from "react";

import { MatchWinnerRevealAnnouncement } from "@/lib/match-winner-announcement";
import { formatKickoff } from "@/lib/utils";

type MatchWinnerRevealModalProps = {
  leagueSlug: string;
  announcements: MatchWinnerRevealAnnouncement[];
  predictionTimeZone: string;
  onFinished?: () => void;
};

function formatWinnerLabel(winners: MatchWinnerRevealAnnouncement["winners"]) {
  if (winners.length === 1) {
    return winners[0].displayName;
  }

  return winners.map((winner) => winner.displayName).join(" & ");
}

export function MatchWinnerRevealModal({
  leagueSlug,
  announcements,
  predictionTimeZone,
  onFinished
}: MatchWinnerRevealModalProps) {
  const [queue, setQueue] = useState(announcements);
  const [pending, startTransition] = useTransition();

  const current = queue[0];

  if (!current) {
    return null;
  }

  const winnerPoints = current.winners[0]?.points ?? 0;
  const isTie = current.winners.length > 1;

  return (
    <div className="match-winner-reveal-backdrop" role="presentation">
      <div
        className="match-winner-reveal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="match-winner-reveal-title"
      >
        <p className="match-winner-reveal__eyebrow">Match winner</p>
        <h2 id="match-winner-reveal-title">{isTie ? "Co-winners for this match" : "Top pick for this match"}</h2>
        <p className="match-winner-reveal__match">
          {current.homeTeam} {current.finalScore.home} - {current.finalScore.away} {current.awayTeam}
        </p>
        <p className="match-winner-reveal__meta">
          {current.stage} · {formatKickoff(current.kickoff, predictionTimeZone)}
        </p>

        <div className="match-winner-reveal__hero">
          <span className="match-winner-reveal__trophy" aria-hidden="true">
            🏆
          </span>
          <strong>{formatWinnerLabel(current.winners)}</strong>
          <span className="match-winner-reveal__points">
            {winnerPoints} point{winnerPoints === 1 ? "" : "s"}
            {isTie ? " each" : ""}
          </span>
        </div>

        <p className="match-winner-reveal__copy">
          {isTie
            ? "These players earned the most points on this finished match in your league."
            : "This player earned the most points on this finished match in your league."}
        </p>

        <button
          className="primary-button match-winner-reveal__button"
          type="button"
          disabled={pending}
          onClick={() => {
            startTransition(async () => {
              await fetch(`/api/leagues/${leagueSlug}/match-winner-reveal`, {
                method: "POST",
                credentials: "same-origin",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({ matchId: current.matchId })
              });

              setQueue((previous) => {
                const next = previous.slice(1);

                if (next.length === 0) {
                  onFinished?.();
                }

                return next;
              });
            });
          }}
        >
          {pending ? "Saving..." : queue.length > 1 ? "Next winner" : "Continue"}
        </button>
      </div>
    </div>
  );
}
