"use client";

import { useState } from "react";

import { MatchPredictionForm } from "@/components/MatchPredictionForm";
import { MatchScoreBreakdown } from "@/components/MatchScoreBreakdown";
import { DashboardMatch, DashboardMatchPrediction } from "@/lib/dashboard";
import { formatKickoff } from "@/lib/utils";

type MatchesBoardProps = {
  leagueSlug: string;
  matches: DashboardMatch[];
  predictions: DashboardMatchPrediction[];
};

function PredictionSummary({ prediction }: { prediction?: DashboardMatchPrediction }) {
  return (
    <div className="prediction-strip">
      <div>
        <span>Your score</span>
        <strong>
          {prediction && prediction.homeScore !== null && prediction.awayScore !== null
            ? `${prediction.homeScore} - ${prediction.awayScore}`
            : "Optional / not set"}
        </strong>
      </div>
      <div>
        <span>Winner</span>
        <strong>{prediction?.winner || "No pick yet"}</strong>
      </div>
      <div>
        <span>Total goals</span>
        <strong>{prediction?.totalGoalsLine || "No pick yet"}</strong>
      </div>
      <div>
        <span>Total corners</span>
        <strong>{prediction?.totalCornersLine || "No pick yet"}</strong>
      </div>
      <div>
        <span>Yellow cards</span>
        <strong>{prediction?.yellowCardsLine || "No pick yet"}</strong>
      </div>
      <div>
        <span>Red cards</span>
        <strong>{prediction?.redCardsLine || "No pick yet"}</strong>
      </div>
    </div>
  );
}

function getStatusLabel(isFinished: boolean, isLocked: boolean, hasPrediction: boolean) {
  if (isFinished) {
    return "Finished";
  }

  if (isLocked) {
    return "Locked";
  }

  if (hasPrediction) {
    return "Pick saved";
  }

  return "Open";
}

function getBadgeClass(statusLabel: string) {
  if (statusLabel === "Pick saved") {
    return "match-card__badge--pick-saved";
  }

  return `match-card__badge--${statusLabel.toLowerCase()}`;
}

export function MatchesBoard({ leagueSlug, matches, predictions }: MatchesBoardProps) {
  const [localPredictions, setLocalPredictions] = useState(predictions);
  const [expandedMatchId, setExpandedMatchId] = useState<number | null>(null);

  return (
    <section id="matches" className="section">
      <div className="section__heading">
        <p className="eyebrow">Fixtures + Picks</p>
      </div>
      <div className="match-list">
        {matches.map((match) => {
          const prediction = localPredictions.find((item) => item.matchId === match.id);
          const isFinished = Boolean(match.finalScore);
          const isLocked = match.locked && !isFinished;
          const isOpen = !isFinished && !isLocked;
          const statusLabel = getStatusLabel(isFinished, isLocked, Boolean(prediction));
          const cardClassName = [
            "match-card",
            isFinished ? "match-card--finished" : "",
            isLocked ? "match-card--locked" : "",
            isOpen && prediction ? "match-card--saved" : ""
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <details
              className={cardClassName}
              key={match.id}
              open={expandedMatchId === match.id}
              onToggle={(event) => {
                setExpandedMatchId(event.currentTarget.open ? match.id : null);
              }}
            >
              <summary className="match-card__summary">
                <div className="match-card__summary-main">
                  <strong>
                    {match.homeTeam} vs {match.awayTeam}
                  </strong>
                  <span>{formatKickoff(match.kickoff)}</span>
                  {isFinished && match.finalScore ? (
                    <span className="match-card__summary-result">
                      Final: {match.finalScore.home} - {match.finalScore.away}
                    </span>
                  ) : null}
                </div>
                <div className="match-card__summary-side">
                  <span>{match.stage}</span>
                  <span className={`match-card__badge ${getBadgeClass(statusLabel)}`}>{statusLabel}</span>
                </div>
              </summary>

              <div className="match-card__body">
                {isFinished ? (
                  <>
                    <div className="match-card__topline">
                      <span>{match.stage}</span>
                      <span>{formatKickoff(match.kickoff)}</span>
                    </div>
                    <div className="match-card__teams">
                      <div>
                        <strong>{match.homeTeam}</strong>
                        <span>{match.venue}</span>
                      </div>
                      <div className="match-card__versus match-card__versus--finished">FT</div>
                      <div>
                        <strong>{match.awayTeam}</strong>
                        <span>Official result entered</span>
                      </div>
                    </div>
                    {match.finalScore ? (
                      <p className="result-pill result-pill--final">
                        Official result: {match.finalScore.home} - {match.finalScore.away}
                      </p>
                    ) : null}
                    <MatchScoreBreakdown match={match} prediction={prediction} />
                  </>
                ) : isLocked ? (
                  <>
                    <PredictionSummary prediction={prediction} />
                    <p className="status-note status-note--locked">Predictions are locked for this match.</p>
                  </>
                ) : (
                  <MatchPredictionForm
                    leagueSlug={leagueSlug}
                    match={match}
                    prediction={prediction}
                    onSaved={(savedPrediction) => {
                      setLocalPredictions((current) => {
                        const withoutCurrent = current.filter((item) => item.matchId !== savedPrediction.matchId);
                        return [...withoutCurrent, savedPrediction].sort((a, b) => a.matchId - b.matchId);
                      });
                      setExpandedMatchId(null);
                    }}
                  />
                )}
              </div>
            </details>
          );
        })}
      </div>
      <a className="section__jump" href="#top">
        Back to top
      </a>
    </section>
  );
}
