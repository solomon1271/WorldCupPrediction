"use client";

import { useEffect, useState } from "react";

import { TOURNAMENT_TOP_PICK_COUNT } from "@/lib/tournament-scoring";

type TopPicksReminderBannerProps = {
  unlockUntil: string;
  unlockUntilLabel: string;
  savedPickCount: number;
};

function getDismissStorageKey(unlockUntil: string) {
  return `top-picks-reminder-dismissed:${unlockUntil}`;
}

export function TopPicksReminderBanner({
  unlockUntil,
  unlockUntilLabel,
  savedPickCount
}: TopPicksReminderBannerProps) {
  const [visible, setVisible] = useState(false);
  const picksComplete = savedPickCount >= TOURNAMENT_TOP_PICK_COUNT;

  useEffect(() => {
    try {
      const dismissed = sessionStorage.getItem(getDismissStorageKey(unlockUntil)) === "1";
      setVisible(!dismissed);
    } catch {
      setVisible(true);
    }
  }, [unlockUntil]);

  function dismiss() {
    try {
      sessionStorage.setItem(getDismissStorageKey(unlockUntil), "1");
    } catch {
      // Ignore storage failures and hide for this render.
    }

    setVisible(false);
  }

  function goToTopPicks() {
    dismiss();
    const target = document.getElementById("tournament-picks");

    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    window.location.hash = "tournament-picks";
  }

  if (!visible) {
    return null;
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
          <button className="ghost-button top-picks-reminder__dismiss" type="button" onClick={dismiss}>
            Remind me later
          </button>
        </div>
        <button
          className="top-picks-reminder__close"
          type="button"
          aria-label="Dismiss top picks reminder"
          onClick={dismiss}
        >
          ×
        </button>
      </div>
    </div>
  );
}
