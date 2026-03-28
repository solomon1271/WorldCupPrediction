"use client";

import { useState } from "react";

import { DashboardMatch, DashboardMatchPrediction } from "@/lib/dashboard";
import { formatKickoff } from "@/lib/utils";
import { MatchPredictionForm } from "@/components/MatchPredictionForm";

type MatchesBoardProps = {
  matches: DashboardMatch[];
  predictions: DashboardMatchPrediction[];
};

export function MatchesBoard({ matches, predictions }: MatchesBoardProps) {
  const [localPredictions, setLocalPredictions] = useState(predictions);

  return (
    <section id="matches" className="section">
      <div className="section__heading">
        <p className="eyebrow">Fixtures + Picks</p>
      </div>
      <div className="match-list">
        {matches.map((match) => {
          const prediction = localPredictions.find((item) => item.matchId === match.id);
          const isFinished = Boolean(match.finalScore);
          const summaryStatus = isFinished ? "Finished" : prediction ? "Pick saved" : match.locked ? "Locked" : "Open";

          return (
            <details className={`match-card${isFinished ? " match-card--finished" : ""}`} key={match.id}>
              <summary className="match-card__summary">
                <div className="match-card__summary-main">
                  <strong>
                    {match.homeTeam} vs {match.awayTeam}
                  </strong>
                  <span>{formatKickoff(match.kickoff)}</span>
                </div>
                <div className="match-card__summary-side">
                  <span>{match.stage}</span>
                  <span>{summaryStatus}</span>
                </div>
              </summary>
              <div className="match-card__body">
                <div className="match-card__topline">
                  <span>{match.stage}</span>
                  <span>{formatKickoff(match.kickoff)}</span>
                </div>
                <div className="match-card__teams">
                  <div>
                    <strong>{match.homeTeam}</strong>
                    <span>{match.venue}</span>
                  </div>
                  <div className="match-card__versus">vs</div>
                  <div>
                    <strong>{match.awayTeam}</strong>
                    <span>{isFinished ? "Official result entered" : match.locked ? "Predictions locked" : "Open for picks"}</span>
                  </div>
                </div>
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
                <MatchPredictionForm
                  match={match}
                  prediction={prediction}
                  onSaved={(savedPrediction) => {
                    setLocalPredictions((current) => {
                      const withoutCurrent = current.filter((item) => item.matchId !== savedPrediction.matchId);
                      return [...withoutCurrent, savedPrediction].sort((a, b) => a.matchId - b.matchId);
                    });
                  }}
                />
                {match.finalScore ? (
                  <p className="result-pill">
                    Official result: {match.finalScore.home} - {match.finalScore.away}
                  </p>
                ) : null}
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
