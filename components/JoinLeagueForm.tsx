"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function JoinLeagueForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="prediction-form"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const inviteCode = String(formData.get("inviteCode") || "");

        startTransition(async () => {
          setError(null);
          const response = await fetch("/api/leagues/join", {
            method: "POST",
            credentials: "same-origin",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ inviteCode })
          });
          const result = (await response.json()) as { error?: string; leagueSlug?: string };

          if (!response.ok) {
            setError(result.error || "Could not join league.");
            return;
          }

          router.push(result.leagueSlug ? `/l/${result.leagueSlug}` : "/leagues");
          router.refresh();
        });
      }}
    >
      <label>
        <span>Invite code</span>
        <input name="inviteCode" type="text" placeholder="League invite code" required />
      </label>
      {error ? <p className="form-error">{error}</p> : null}
      <button className="primary-button" type="submit" disabled={pending}>
        {pending ? "Joining..." : "Join league"}
      </button>
    </form>
  );
}
