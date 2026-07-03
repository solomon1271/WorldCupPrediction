"use client";

import { useState } from "react";

import { TOURNAMENT_TOP_PICK_COUNT } from "@/lib/tournament-scoring";

type TopPicksReminderBannerProps = {
  unlockUntilLabel: string;
  savedPickCount: number;
};

export function TopPicksReminderBanner({ unlockUntilLabel, savedPickCount }: TopPicksReminderBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const picksComplete = savedPickCount >= TOURNAMENT_TOP_PICK_COUNT;

  if (dismissed) {
    return null;
  }

  function goToTopPicks() {
    setDismissed(true);
    const target = document.getElementById("tournament-picks");

    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    window.location.hash = "tournament-picks";
  }

  return (
    <div className="top-picks-reminder" role="dialog" aria-modal="false" aria-labelledby="top-picks-reminder-title">
      <div className="top-picks-reminder__panel">
        <div className="top-picks-reminder__content">
          <p className="top-picks-reminder__eyebrow">Limited-time reopening</p>
          <h2 id="top-picks-reminder-title">Submit your top picks before they lock again</h2>
          <p className="top-picks-reminder__copy">
            {picksComplete ? (
              <>
                All {TOURNAMENT_TOP_PICK_COUNT} top picks are saved. You can still review and update champion,
                runner-up, and award picks until <strong>{unlockUntilLabel}</strong>.
              </>
            ) : (
              <>
                You have <strong>{savedPickCount}</strong> of <strong>{TOURNAMENT_TOP_PICK_COUNT}</strong> top picks
                saved. Add or update champion, runner-up, and award picks before{" "}
                <strong>{unlockUntilLabel}</strong>.
              </>
            )}
          </p>
        </div>
        <div className="top-picks-reminder__actions">
          <button className="primary-button top-picks-reminder__cta" type="button" onClick={goToTopPicks}>
            {picksComplete ? "Review top picks" : "Pick and submit now"}
          </button>
          <button className="ghost-button top-picks-reminder__dismiss" type="button" onClick={() => setDismissed(true)}>
            Not now
          </button>
        </div>
        <button
          className="top-picks-reminder__close"
          type="button"
          aria-label="Dismiss top picks reminder for now"
          onClick={() => setDismissed(true)}
        >
          ×
        </button>
      </div>
    </div>
  );
}
