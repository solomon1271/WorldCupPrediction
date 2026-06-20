"use client";

import { useEffect, useState, useTransition } from "react";

import { DashboardTournamentPrediction } from "@/lib/dashboard";
import { getWorldCupTeams } from "@/lib/world-cup-teams";

type TournamentPredictionFormProps = {
  leagueSlug: string;
  prediction: DashboardTournamentPrediction;
  onSaved: (prediction: DashboardTournamentPrediction) => void;
};

type TournamentFormState = {
  champion: string;
  runnerUp: string;
  goldenBoot: string;
  bestYoungPlayer: string;
  goldenGlove: string;
  bestPlayer: string;
};

const worldCupTeams = getWorldCupTeams();

function toFormState(prediction: DashboardTournamentPrediction): TournamentFormState {
  return {
    champion: prediction.champion ?? "",
    runnerUp: prediction.runnerUp ?? "",
    goldenBoot: prediction.goldenBoot ?? "",
    bestYoungPlayer: prediction.bestYoungPlayer ?? "",
    goldenGlove: prediction.goldenGlove ?? "",
    bestPlayer: prediction.bestPlayer ?? ""
  };
}

function toSavedPrediction(
  prediction: DashboardTournamentPrediction,
  form: TournamentFormState
): DashboardTournamentPrediction {
  return {
    ...prediction,
    champion: form.champion || null,
    runnerUp: form.runnerUp || null,
    goldenBoot: form.goldenBoot || null,
    bestYoungPlayer: form.bestYoungPlayer || null,
    goldenGlove: form.goldenGlove || null,
    bestPlayer: form.bestPlayer || null
  };
}

export function TournamentPredictionForm({ leagueSlug, prediction, onSaved }: TournamentPredictionFormProps) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [form, setForm] = useState<TournamentFormState>(() => toFormState(prediction));

  useEffect(() => {
    setForm(toFormState(prediction));
  }, [prediction]);

  const updateField = (field: keyof TournamentFormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  return (
    <form
      className="prediction-form prediction-form--tournament"
      onSubmit={(event) => {
        event.preventDefault();

        const hasAtLeastOnePick = Object.values(form).some((value) => value.trim().length > 0);

        if (!hasAtLeastOnePick) {
          setError("Enter at least one tournament pick before saving.");
          return;
        }

        startTransition(async () => {
          setError(null);
          setSuccess(null);

          const response = await fetch("/api/predictions/tournament", {
            method: "POST",
            credentials: "same-origin",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              leagueSlug,
              ...form
            })
          });

          const result = (await response.json()) as { error?: string };

          if (!response.ok) {
            setError(result.error || "Could not save your tournament picks.");
            return;
          }

          const savedPrediction = toSavedPrediction(prediction, form);
          setSuccess("Tournament picks saved.");
          onSaved(savedPrediction);
        });
      }}
    >
      <div className="score-grid score-grid--tournament">
        <label>
          <span>Champion</span>
          <select name="champion" value={form.champion} onChange={(event) => updateField("champion", event.target.value)}>
            <option value="">Select a country</option>
            {worldCupTeams.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Runner-up</span>
          <select name="runnerUp" value={form.runnerUp} onChange={(event) => updateField("runnerUp", event.target.value)}>
            <option value="">Select a country</option>
            {worldCupTeams.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Golden Boot</span>
          <input
            name="goldenBoot"
            type="text"
            value={form.goldenBoot}
            onChange={(event) => updateField("goldenBoot", event.target.value)}
            placeholder="Player name"
          />
        </label>
        <label>
          <span>Best Young Player</span>
          <input
            name="bestYoungPlayer"
            type="text"
            value={form.bestYoungPlayer}
            onChange={(event) => updateField("bestYoungPlayer", event.target.value)}
            placeholder="Player name"
          />
        </label>
        <label>
          <span>Golden Glove</span>
          <input
            name="goldenGlove"
            type="text"
            value={form.goldenGlove}
            onChange={(event) => updateField("goldenGlove", event.target.value)}
            placeholder="Player name"
          />
        </label>
        <label>
          <span>Best Player</span>
          <input
            name="bestPlayer"
            type="text"
            value={form.bestPlayer}
            onChange={(event) => updateField("bestPlayer", event.target.value)}
            placeholder="Player name"
          />
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
