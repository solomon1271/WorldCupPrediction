"use client";

import { useMemo, useState } from "react";

import { MatchPredictionForm } from "@/components/MatchPredictionForm";
import { MatchScoreBreakdown } from "@/components/MatchScoreBreakdown";
import { DashboardMatch, DashboardMatchPrediction } from "@/lib/dashboard";
import { getMatchUrgency, MatchUrgency, sortMatchesByKickoffAsc } from "@/lib/match-urgency";
import { formatKickoff } from "@/lib/utils";

type MatchesBoardProps = {
  leagueSlug: string;
  matches: DashboardMatch[];
  predictions: DashboardMatchPrediction[];
  todayLabel: string;
  timezoneShortName: string;
  predictionTimeZone: string;
  referenceNow: string;
  lockLeadMinutes: number;
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

  if (urgency === "today-needs-pick") {
    return "Pick today";
  }

  if (urgency === "today-ready") {
    return "Pick saved";
  }

  if (hasPrediction) {
    return "Pick saved";
  }

  return "Open";
}

function getBadgeClass(statusLabel: string, urgency: MatchUrgency) {
  if (urgency === "today-needs-pick") {
    return "match-card__badge--urgent";
  }

  if (urgency === "today-ready") {
    return "match-card__badge--today-ready";
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
  predictionTimeZone: string;
};

function MatchCard({
  leagueSlug,
  match,
  prediction,
  expandedMatchId,
  onToggle,
  onSaved,
  predictionTimeZone
}: MatchCardProps) {
  const isFinished = Boolean(match.finalScore);
  const isLocked = match.locked && !isFinished;
  const isOpen = !isFinished && !isLocked;
  const statusLabel = getStatusLabel(isFinished, isLocked, Boolean(prediction), match.urgency);
  const cardClassName = [
    "match-card",
    isFinished ? "match-card--finished" : "",
    isLocked ? "match-card--locked" : "",
    match.urgency === "today-needs-pick" ? "match-card--urgent" : "",
    match.urgency === "today-ready" ? "match-card--today-ready" : "",
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
          <span>{formatKickoff(match.kickoff, predictionTimeZone)}</span>
          {match.urgency === "today-needs-pick" ? (
            <span className="match-card__summary-note match-card__summary-note--urgent">
              Kicks off today — submit your pick before lock
            </span>
          ) : null}
          {match.urgency === "today-ready" ? (
            <span className="match-card__summary-note match-card__summary-note--ready">
              Kicks off today — update your pick before lock if you want
            </span>
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
              <span>{formatKickoff(match.kickoff, predictionTimeZone)}</span>
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
            <MatchScoreBreakdown breakdown={prediction?.scoreBreakdown} hasPrediction={Boolean(prediction)} />
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
  todayLabel,
  timezoneShortName,
  predictionTimeZone,
  referenceNow,
  lockLeadMinutes
}: MatchesBoardProps) {
  const [localPredictions, setLocalPredictions] = useState(predictions);
  const [expandedMatchId, setExpandedMatchId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"upcoming" | "finished">("upcoming");
  const urgencyReferenceDate = new Date(referenceNow);

  const matchesWithUrgency = useMemo(
    () =>
      matches.map((match) => ({
        ...match,
        urgency: getMatchUrgency({
          kickoff: match.kickoff,
          isLocked: match.locked,
          isFinished: Boolean(match.finalScore),
          hasPrediction: localPredictions.some((item) => item.matchId === match.id),
          timeZone: predictionTimeZone,
          referenceDate: urgencyReferenceDate
        })
      })),
    [localPredictions, matches, predictionTimeZone, urgencyReferenceDate]
  );

  const upcomingMatches = useMemo(
    () => sortMatchesByKickoffAsc(matchesWithUrgency.filter((match) => !match.finalScore)),
    [matchesWithUrgency]
  );

  const finishedMatches = useMemo(
    () => sortMatchesByKickoffAsc(matchesWithUrgency.filter((match) => Boolean(match.finalScore))),
    [matchesWithUrgency]
  );

  const displayMatches = activeTab === "upcoming" ? upcomingMatches : finishedMatches;

  const todayNeedsPick = useMemo(
    () => upcomingMatches.filter((match) => match.urgency === "today-needs-pick"),
    [upcomingMatches]
  );

  const todayReady = useMemo(
    () => upcomingMatches.filter((match) => match.urgency === "today-ready"),
    [upcomingMatches]
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
        <h2>Matches</h2>
      </div>

      <div className="match-tabs" role="tablist" aria-label="Match lists">
        <button
          className={`match-tabs__button match-tabs__button--upcoming${activeTab === "upcoming" ? " match-tabs__button--active" : ""}`}
          type="button"
          role="tab"
          aria-selected={activeTab === "upcoming"}
          onClick={() => setActiveTab("upcoming")}
        >
          Upcoming
          <span className="match-tabs__count">{upcomingMatches.length}</span>
        </button>
        <button
          className={`match-tabs__button match-tabs__button--finished${activeTab === "finished" ? " match-tabs__button--active" : ""}`}
          type="button"
          role="tab"
          aria-selected={activeTab === "finished"}
          onClick={() => setActiveTab("finished")}
        >
          Finished
          <span className="match-tabs__count">{finishedMatches.length}</span>
        </button>
      </div>

      {activeTab === "upcoming" && todayNeedsPick.length > 0 ? (
        <div className="match-urgency-banner" id="predict-before-lock">
          <div>
            <p className="match-urgency-banner__eyebrow">Pick required today</p>
            <h3>
              {todayNeedsPick.length} match{todayNeedsPick.length === 1 ? "" : "es"} still need your pick for{" "}
              {todayLabel}
            </h3>
            <p className="match-urgency-banner__copy">
              These games kick off today ({timezoneShortName}). Submit your picks before they lock{" "}
              {lockLeadMinutes} minutes before kickoff.
            </p>
          </div>
          <a className="match-urgency-banner__action" href="#predict-before-lock-list">
            Review {todayNeedsPick.length} pick{todayNeedsPick.length === 1 ? "" : "s"}
          </a>
        </div>
      ) : null}

      {activeTab === "upcoming" && todayReady.length > 0 ? (
        <div className="match-reminder-banner">
          <div>
            <p className="match-reminder-banner__eyebrow">Pick saved for today</p>
            <h3>
              {todayReady.length} match{todayReady.length === 1 ? "" : "es"} on {todayLabel} — you can still update
            </h3>
            <p className="match-reminder-banner__copy">
              Your picks are in. Open a highlighted match below if you want to change anything before lock (
              {lockLeadMinutes} minutes before kickoff).
            </p>
          </div>
        </div>
      ) : null}

      <div
        className="match-list"
        id={activeTab === "upcoming" && todayNeedsPick.length > 0 ? "predict-before-lock-list" : undefined}
      >
        {displayMatches.length === 0 ? (
          <p className="status-note">
            {activeTab === "upcoming"
              ? "No upcoming matches right now."
              : "No finished matches yet. Results will appear here after games are played."}
          </p>
        ) : (
          displayMatches.map((match) => (
            <MatchCard
              key={match.id}
              leagueSlug={leagueSlug}
              match={match}
              prediction={localPredictions.find((item) => item.matchId === match.id)}
              expandedMatchId={expandedMatchId}
              onToggle={setExpandedMatchId}
              onSaved={handleSaved}
              predictionTimeZone={predictionTimeZone}
            />
          ))
        )}
      </div>
      <a className="section__jump" href="#top">
        Back to top
      </a>
    </section>
  );
}
