"use client";

import { useEffect, useState, useTransition } from "react";

import { DashboardTournamentPrediction } from "@/lib/dashboard";
import { getWorldCupPlayers, getWorldCupPlayersByTeam, resolveCanonicalPlayerName } from "@/lib/world-cup-players";
import { getWorldCupTeams } from "@/lib/world-cup-teams";

type TournamentPredictionFormProps = {
  leagueSlug: string;
  prediction: DashboardTournamentPrediction;
  locked?: boolean;
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
const worldCupPlayers = getWorldCupPlayers();
const worldCupPlayersByTeam = getWorldCupPlayersByTeam();

function PlayerSelect({
  name,
  value,
  disabled,
  onChange
}: {
  name: string;
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  const showLegacyOption = value.length > 0 && !worldCupPlayers.includes(value);

  return (
    <select name={name} value={value} disabled={disabled} onChange={(event) => onChange(event.target.value)}>
      <option value="">Select a player</option>
      {showLegacyOption ? (
        <option value={value}>{value}</option>
      ) : null}
      {worldCupTeams
        .filter((team) => worldCupPlayersByTeam[team]?.length)
        .map((team) => (
          <optgroup key={team} label={team}>
            {worldCupPlayersByTeam[team].map((player) => (
              <option key={player} value={player}>
                {player}
              </option>
            ))}
          </optgroup>
        ))}
    </select>
  );
}

function canonicalPlayerField(value: string | null | undefined) {
  if (!value?.trim()) {
    return "";
  }

  return resolveCanonicalPlayerName(value) ?? value;
}

function toFormState(prediction: DashboardTournamentPrediction): TournamentFormState {
  return {
    champion: prediction.champion ?? "",
    runnerUp: prediction.runnerUp ?? "",
    goldenBoot: canonicalPlayerField(prediction.goldenBoot),
    bestYoungPlayer: canonicalPlayerField(prediction.bestYoungPlayer),
    goldenGlove: canonicalPlayerField(prediction.goldenGlove),
    bestPlayer: canonicalPlayerField(prediction.bestPlayer)
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

export function TournamentPredictionForm({
  leagueSlug,
  prediction,
  locked = false,
  onSaved
}: TournamentPredictionFormProps) {
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

        if (locked) {
          return;
        }

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
          <select
            name="champion"
            value={form.champion}
            disabled={locked}
            onChange={(event) => updateField("champion", event.target.value)}
          >
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
          <select
            name="runnerUp"
            value={form.runnerUp}
            disabled={locked}
            onChange={(event) => updateField("runnerUp", event.target.value)}
          >
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
          <PlayerSelect
            name="goldenBoot"
            value={form.goldenBoot}
            disabled={locked}
            onChange={(value) => updateField("goldenBoot", value)}
          />
        </label>
        <label>
          <span>Best Young Player</span>
          <PlayerSelect
            name="bestYoungPlayer"
            value={form.bestYoungPlayer}
            disabled={locked}
            onChange={(value) => updateField("bestYoungPlayer", value)}
          />
        </label>
        <label>
          <span>Golden Glove</span>
          <PlayerSelect
            name="goldenGlove"
            value={form.goldenGlove}
            disabled={locked}
            onChange={(value) => updateField("goldenGlove", value)}
          />
        </label>
        <label>
          <span>Best Player</span>
          <PlayerSelect
            name="bestPlayer"
            value={form.bestPlayer}
            disabled={locked}
            onChange={(value) => updateField("bestPlayer", value)}
          />
        </label>
      </div>
      {error ? <p className="form-error">{error}</p> : null}
      {success ? <p className="form-success">{success}</p> : null}
      <button className="primary-button" type="submit" disabled={pending || locked}>
        {pending ? "Saving..." : "Save tournament picks"}
      </button>
    </form>
  );
}
