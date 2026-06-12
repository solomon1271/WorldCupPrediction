"use client";

import { useMemo, useState } from "react";

import { MatchPredictionForm } from "@/components/MatchPredictionForm";
import { MatchScoreBreakdown } from "@/components/MatchScoreBreakdown";
import { DashboardMatch, DashboardMatchPrediction } from "@/lib/dashboard";
import { getMatchUrgency, MatchUrgency, sortMatchesByUrgency } from "@/lib/match-urgency";
import { formatKickoff } from "@/lib/utils";

type MatchesBoardProps = {
  leagueSlug: string;
  matches: DashboardMatch[];
  predictions: DashboardMatchPrediction[];
  tomorrowLabel: string;
  timezoneShortName: string;
  predictionTimeZone: string;
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

function getStatusLabel(
  isFinished: boolean,
  isLocked: boolean,
  hasPrediction: boolean,
  urgency: MatchUrgency
) {
  if (isFinished) {
    return "Finished";
  }

  if (isLocked) {
    return "Locked";
  }

  if (urgency === "tomorrow-needs-pick") {
    return "Pick before lock";
  }

  if (urgency === "tomorrow-ready") {
    return "Tomorrow";
  }

  if (hasPrediction) {
    return "Pick saved";
  }

  return "Open";
}

function getBadgeClass(statusLabel: string, urgency: MatchUrgency) {
  if (urgency === "tomorrow-needs-pick") {
    return "match-card__badge--urgent";
  }

  if (urgency === "tomorrow-ready") {
    return "match-card__badge--tomorrow";
  }

  if (statusLabel === "Pick saved") {
    return "match-card__badge--pick-saved";
  }

  return `match-card__badge--${statusLabel.toLowerCase().replace(/\s+/g, "-")}`;
}

type MatchCardProps = {
  leagueSlug: string;
  match: DashboardMatch;
  prediction?: DashboardMatchPrediction;
  expandedMatchId: number | null;
  onToggle: (matchId: number | null) => void;
  onSaved: (savedPrediction: DashboardMatchPrediction) => void;
};

function MatchCard({ leagueSlug, match, prediction, expandedMatchId, onToggle, onSaved }: MatchCardProps) {
  const isFinished = Boolean(match.finalScore);
  const isLocked = match.locked && !isFinished;
  const isOpen = !isFinished && !isLocked;
  const statusLabel = getStatusLabel(isFinished, isLocked, Boolean(prediction), match.urgency);
  const cardClassName = [
    "match-card",
    isFinished ? "match-card--finished" : "",
    isLocked ? "match-card--locked" : "",
    match.urgency === "tomorrow-needs-pick" ? "match-card--urgent" : "",
    match.urgency === "tomorrow-ready" ? "match-card--tomorrow" : "",
    isOpen && prediction && !match.urgency ? "match-card--saved" : ""
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <details
      className={cardClassName}
      open={expandedMatchId === match.id}
      onToggle={(event) => {
        onToggle(event.currentTarget.open ? match.id : null);
      }}
    >
      <summary className="match-card__summary">
        <div className="match-card__summary-main">
          <strong>
            {match.homeTeam} vs {match.awayTeam}
          </strong>
          <span>{formatKickoff(match.kickoff)}</span>
          {match.urgency === "tomorrow-needs-pick" ? (
            <span className="match-card__summary-note">Kicks off tomorrow — submit your pick before lock</span>
          ) : null}
          {isFinished && match.finalScore ? (
            <span className="match-card__summary-result">
              Final: {match.finalScore.home} - {match.finalScore.away}
            </span>
          ) : null}
        </div>
        <div className="match-card__summary-side">
          <span>{match.stage}</span>
          <span className={`match-card__badge ${getBadgeClass(statusLabel, match.urgency)}`}>{statusLabel}</span>
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
            onSaved={onSaved}
          />
        )}
      </div>
    </details>
  );
}

export function MatchesBoard({
  leagueSlug,
  matches,
  predictions,
  tomorrowLabel,
  timezoneShortName,
  predictionTimeZone
}: MatchesBoardProps) {
  const [localPredictions, setLocalPredictions] = useState(predictions);
  const [expandedMatchId, setExpandedMatchId] = useState<number | null>(null);

  const displayMatches = useMemo(
    () =>
      sortMatchesByUrgency(
        matches.map((match) => ({
          ...match,
          urgency: getMatchUrgency({
            kickoff: match.kickoff,
            isLocked: match.locked,
            isFinished: Boolean(match.finalScore),
            hasPrediction: localPredictions.some((item) => item.matchId === match.id),
            timeZone: predictionTimeZone
          })
        }))
      ),
    [localPredictions, matches, predictionTimeZone]
  );

  const urgentMatches = useMemo(
    () => displayMatches.filter((match) => match.urgency === "tomorrow-needs-pick"),
    [displayMatches]
  );
  const tomorrowReadyCount = useMemo(
    () => displayMatches.filter((match) => match.urgency === "tomorrow-ready").length,
    [displayMatches]
  );

  const handleSaved = (savedPrediction: DashboardMatchPrediction) => {
    setLocalPredictions((current) => {
      const withoutCurrent = current.filter((item) => item.matchId !== savedPrediction.matchId);
      return [...withoutCurrent, savedPrediction].sort((a, b) => a.matchId - b.matchId);
    });
    setExpandedMatchId(null);
  };

  return (
    <section id="matches" className="section">
      <div className="section__heading">
        <p className="eyebrow">Fixtures + Picks</p>
      </div>

      {urgentMatches.length > 0 ? (
        <div className="match-urgency-banner" id="predict-before-lock">
          <div>
            <p className="match-urgency-banner__eyebrow">Predict before lock</p>
            <h3>
              {urgentMatches.length} match{urgentMatches.length === 1 ? "" : "es"} need your pick for {tomorrowLabel}
            </h3>
            <p className="match-urgency-banner__copy">
              These games kick off tomorrow ({timezoneShortName}). Lock in your predictions now so you do not miss points
              when the daily lock runs.
            </p>
          </div>
          <a className="match-urgency-banner__action" href="#predict-before-lock-list">
            Review {urgentMatches.length} urgent pick{urgentMatches.length === 1 ? "" : "s"}
          </a>
        </div>
      ) : tomorrowReadyCount > 0 ? (
        <p className="section-note section-note--success">
          You are set for {tomorrowReadyCount} match{tomorrowReadyCount === 1 ? "" : "es"} kicking off {tomorrowLabel}.
        </p>
      ) : null}

      <div className="match-list" id={urgentMatches.length > 0 ? "predict-before-lock-list" : undefined}>
        {displayMatches.map((match) => (
          <MatchCard
            key={match.id}
            leagueSlug={leagueSlug}
            match={match}
            prediction={localPredictions.find((item) => item.matchId === match.id)}
            expandedMatchId={expandedMatchId}
            onToggle={setExpandedMatchId}
            onSaved={handleSaved}
          />
        ))}
      </div>
      <a className="section__jump" href="#top">
        Back to top
      </a>
    </section>
  );
}
