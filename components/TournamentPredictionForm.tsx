"use client";

import { useState, useTransition } from "react";

import { DashboardTournamentPrediction } from "@/lib/dashboard";

type TournamentPredictionFormProps = {
  prediction: DashboardTournamentPrediction;
  onSaved: (prediction: DashboardTournamentPrediction) => void;
};

export function TournamentPredictionForm({ prediction, onSaved }: TournamentPredictionFormProps) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  return (
    <form
      className="prediction-form prediction-form--tournament"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const payload = {
          champion: String(formData.get("champion") || ""),
          runnerUp: String(formData.get("runnerUp") || ""),
          goldenBoot: String(formData.get("goldenBoot") || ""),
          bestYoungPlayer: String(formData.get("bestYoungPlayer") || "")
        };

        startTransition(async () => {
          setError(null);
          setSuccess(null);

          const response = await fetch("/api/predictions/tournament", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
          });

          const result = (await response.json()) as { error?: string };

          if (!response.ok) {
            setError(result.error || "Could not save your tournament picks.");
            return;
          }

          setSuccess("Tournament picks saved.");
          onSaved({
            ...prediction,
            ...payload
          });
        });
      }}
    >
      <div className="score-grid score-grid--tournament">
        <label>
          <span>Champion</span>
          <input name="champion" type="text" defaultValue={prediction.champion ?? ""} required />
        </label>
        <label>
          <span>Runner-up</span>
          <input name="runnerUp" type="text" defaultValue={prediction.runnerUp ?? ""} required />
        </label>
        <label>
          <span>Golden Boot</span>
          <input name="goldenBoot" type="text" defaultValue={prediction.goldenBoot ?? ""} required />
        </label>
        <label>
          <span>Best Young Player</span>
          <input name="bestYoungPlayer" type="text" defaultValue={prediction.bestYoungPlayer ?? ""} required />
        </label>
      </div>
      {error ? <p className="form-error">{error}</p> : null}
      {success ? <p className="form-success">{success}</p> : null}
      <button className="primary-button" type="submit" disabled={pending}>
        {pending ? "Saving..." : "Save tournament picks"}
      </button>
    </form>
  );
}
