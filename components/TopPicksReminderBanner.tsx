"use client";

import { useState } from "react";

type TopPicksReminderBannerProps = {
  unlockUntilLabel: string;
};

export function TopPicksReminderBanner({ unlockUntilLabel }: TopPicksReminderBannerProps) {
  const [dismissed, setDismissed] = useState(false);

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
          <h2 id="top-picks-reminder-title">Top picks are open again</h2>
          <p className="top-picks-reminder__copy">
            Enter or update your champion, runner-up, and award picks before they lock again on{" "}
            <strong>{unlockUntilLabel}</strong>.
          </p>
        </div>
        <div className="top-picks-reminder__actions">
          <button className="primary-button top-picks-reminder__cta" type="button" onClick={goToTopPicks}>
            Go to top picks
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
