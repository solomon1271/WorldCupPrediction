"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { DashboardMatch, DashboardMatchPrediction } from "@/lib/dashboard";
import {
  deriveStatThresholdLine,
  deriveWinnerFromScores,
  statThresholdOptions
} from "@/lib/match-scoring";

type MatchPredictionFormProps = {
  leagueSlug: string;
  match: DashboardMatch;
  prediction?: DashboardMatchPrediction;
  onSaved: (prediction: DashboardMatchPrediction) => void;
};

const thresholdOptions = [...statThresholdOptions];

const getDefaultWinner = (match: DashboardMatch, prediction?: DashboardMatchPrediction) => {
  if (prediction?.winner) {
    return prediction.winner;
  }

  return "Draw";
};

export function MatchPredictionForm({ leagueSlug, match, prediction, onSaved }: MatchPredictionFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [homeScore, setHomeScore] = useState(prediction?.homeScore?.toString() ?? "");
  const [awayScore, setAwayScore] = useState(prediction?.awayScore?.toString() ?? "");
  const [winner, setWinner] = useState(getDefaultWinner(match, prediction));
  const [totalGoalsLine, setTotalGoalsLine] = useState(prediction?.totalGoalsLine ?? "0");
  const [yellowCardsLine, setYellowCardsLine] = useState(prediction?.yellowCardsLine ?? "0");
  const [totalCornersLine, setTotalCornersLine] = useState(prediction?.totalCornersLine ?? "0");
  const [redCardsLine, setRedCardsLine] = useState(prediction?.redCardsLine ?? "No");

  const [winnerManual, setWinnerManual] = useState(false);
  const [totalGoalsManual, setTotalGoalsManual] = useState(false);

  useEffect(() => {
    setHomeScore(prediction?.homeScore?.toString() ?? "");
    setAwayScore(prediction?.awayScore?.toString() ?? "");
    setWinner(getDefaultWinner(match, prediction));
    setTotalGoalsLine(prediction?.totalGoalsLine ?? "0");
    setYellowCardsLine(prediction?.yellowCardsLine ?? "0");
    setTotalCornersLine(prediction?.totalCornersLine ?? "0");
    setRedCardsLine(prediction?.redCardsLine ?? "No");
    setWinnerManual(false);
    setTotalGoalsManual(false);
  }, [match, prediction]);

  useEffect(() => {
    const home = homeScore === "" ? null : Number(homeScore);
    const away = awayScore === "" ? null : Number(awayScore);

    if (home === null || away === null || Number.isNaN(home) || Number.isNaN(away)) {
      return;
    }

    if (!winnerManual) {
      setWinner(deriveWinnerFromScores(home, away, match.homeTeam, match.awayTeam));
    }

    if (!totalGoalsManual) {
      setTotalGoalsLine(deriveStatThresholdLine(home + away));
    }
  }, [awayScore, homeScore, match.awayTeam, match.homeTeam, totalGoalsManual, winnerManual]);

  return (
    <form
      className="prediction-form"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const payload = {
          leagueSlug,
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
            credentials: "same-origin",
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
            redCardsLine: payload.redCardsLine,
            scoreBreakdown: null
          });
          router.refresh();
        });
      }}
    >
      <input type="hidden" name="matchId" value={match.id} />
      <div className="score-grid">
        <label>
          <span>{match.homeTeam} score (optional)</span>
          <input
            name="homeScore"
            type="number"
            min="0"
            max="20"
            value={homeScore}
            onChange={(event) => {
              setHomeScore(event.target.value);
              setWinnerManual(false);
              setTotalGoalsManual(false);
            }}
          />
        </label>
        <label>
          <span>{match.awayTeam} score (optional)</span>
          <input
            name="awayScore"
            type="number"
            min="0"
            max="20"
            value={awayScore}
            onChange={(event) => {
              setAwayScore(event.target.value);
              setWinnerManual(false);
              setTotalGoalsManual(false);
            }}
          />
        </label>
      </div>
      <div className="score-grid">
        <label>
          <span>Winner</span>
          <select
            name="winner"
            value={winner}
            onChange={(event) => {
              setWinnerManual(true);
              setWinner(event.target.value);
            }}
          >
            <option value={match.homeTeam}>{match.homeTeam}</option>
            <option value="Draw">Draw</option>
            <option value={match.awayTeam}>{match.awayTeam}</option>
          </select>
        </label>
        <label>
          <span>Total goals</span>
          <select
            name="totalGoalsLine"
            value={totalGoalsLine}
            onChange={(event) => {
              setTotalGoalsManual(true);
              setTotalGoalsLine(event.target.value);
            }}
          >
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
          <select
            name="yellowCardsLine"
            value={yellowCardsLine}
            onChange={(event) => setYellowCardsLine(event.target.value)}
          >
            {thresholdOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Total corners</span>
          <select
            name="totalCornersLine"
            value={totalCornersLine}
            onChange={(event) => setTotalCornersLine(event.target.value)}
          >
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
          <select name="redCardsLine" value={redCardsLine} onChange={(event) => setRedCardsLine(event.target.value)}>
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
