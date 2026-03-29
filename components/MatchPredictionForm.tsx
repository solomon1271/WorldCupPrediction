"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { DashboardMatch, DashboardMatchPrediction } from "@/lib/dashboard";

type MatchPredictionFormProps = {
  match: DashboardMatch;
  prediction?: DashboardMatchPrediction;
  onSaved: (prediction: DashboardMatchPrediction) => void;
};

const getDefaultWinner = (match: DashboardMatch, prediction?: DashboardMatchPrediction) => {
  if (prediction?.winner) {
    return prediction.winner;
  }

  return "Draw";
};

const thresholdOptions = ["0", ">1.5", ">2.5", ">3.5", ">4.5", ">5.5", ">6.5", ">7.5", ">8.5", ">9.5"];

export function MatchPredictionForm({ match, prediction, onSaved }: MatchPredictionFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [winner, setWinner] = useState(getDefaultWinner(match, prediction));
  const isFinished = Boolean(match.finalScore);

  if (match.locked || isFinished) {
    return <p className="status-note status-note--locked">Predictions are locked for this match.</p>;
  }

  return (
    <form
      className="prediction-form"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const payload = {
          matchId: Number(formData.get("matchId")),
          homeScore: formData.get("homeScore") === "" ? null : Number(formData.get("homeScore")),
          awayScore: formData.get("awayScore") === "" ? null : Number(formData.get("awayScore")),
          winner: String(formData.get("winner")),
          totalGoalsLine: String(formData.get("totalGoalsLine")),
          totalCornersLine: String(formData.get("totalCornersLine")),
          yellowCardsLine: String(formData.get("yellowCardsLine")),
          redCardsLine: String(formData.get("redCardsLine"))
        };

        startTransition(async () => {
          setError(null);
          setSuccess(null);

          const response = await fetch("/api/predictions/match", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
          });

          const result = (await response.json()) as { error?: string };

          if (!response.ok) {
            setError(result.error || "Could not save your pick.");
            return;
          }

          setSuccess("Pick saved.");
          onSaved({
            matchId: payload.matchId,
            winner: payload.winner,
            homeScore: payload.homeScore,
            awayScore: payload.awayScore,
            totalGoalsLine: payload.totalGoalsLine,
            totalCornersLine: payload.totalCornersLine,
            yellowCardsLine: payload.yellowCardsLine,
            redCardsLine: payload.redCardsLine
          });
          router.refresh();
        });
      }}
    >
      <input type="hidden" name="matchId" value={match.id} />
      <div className="score-grid">
        <label>
          <span>{match.homeTeam} score (optional)</span>
          <input name="homeScore" type="number" min="0" max="20" defaultValue={prediction?.homeScore ?? ""} />
        </label>
        <label>
          <span>{match.awayTeam} score (optional)</span>
          <input name="awayScore" type="number" min="0" max="20" defaultValue={prediction?.awayScore ?? ""} />
        </label>
      </div>
      <div className="score-grid">
        <label>
          <span>Winner</span>
          <select name="winner" value={winner} onChange={(event) => setWinner(event.target.value)}>
            <option value={match.homeTeam}>{match.homeTeam}</option>
            <option value="Draw">Draw</option>
            <option value={match.awayTeam}>{match.awayTeam}</option>
          </select>
        </label>
        <label>
          <span>Total goals</span>
          <select name="totalGoalsLine" defaultValue={prediction?.totalGoalsLine ?? "0"}>
            {thresholdOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="score-grid">
        <label>
          <span>Yellow cards</span>
          <select name="yellowCardsLine" defaultValue={prediction?.yellowCardsLine ?? "0"}>
            {thresholdOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Total corners</span>
          <select name="totalCornersLine" defaultValue={prediction?.totalCornersLine ?? "0"}>
            {thresholdOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="score-grid">
        <label>
          <span>Red cards</span>
          <select name="redCardsLine" defaultValue={prediction?.redCardsLine ?? "No"}>
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
        </label>
      </div>
      {error ? <p className="form-error">{error}</p> : null}
      {success ? <p className="form-success">{success}</p> : null}
      <button className="primary-button" type="submit" disabled={pending}>
        {pending ? "Saving..." : prediction ? "Update pick" : "Save pick"}
      </button>
    </form>
  );
}
