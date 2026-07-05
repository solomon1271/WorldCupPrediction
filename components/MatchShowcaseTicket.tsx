import {
  formatKickoffParts,
  formatVenueShort,
  getMatchTicketTone,
  parseMatchStage
} from "@/lib/match-presentation";
import { formatTimezoneShortName } from "@/lib/match-urgency";

type MatchShowcaseTicketProps = {
  stage: string;
  kickoff: string;
  venue: string;
  predictionTimeZone: string;
  statusLabel: string;
  badgeClass: string;
  isFinished: boolean;
  finalScore?: { home: number; away: number };
  urgencyNote?: string | null;
  isOpen: boolean;
};

function getTicketActionLabel(isFinished: boolean, statusLabel: string): "Locked" | "Pick" | null {
  if (isFinished) {
    return null;
  }

  if (statusLabel === "Locked") {
    return "Locked";
  }

  return "Pick";
}

export function MatchShowcaseTicket({
  stage,
  kickoff,
  venue,
  predictionTimeZone,
  statusLabel,
  badgeClass,
  isFinished,
  finalScore,
  urgencyNote,
  isOpen
}: MatchShowcaseTicketProps) {
  const stageMeta = parseMatchStage(stage);
  const kickoffDate = new Date(kickoff);
  const kickoffParts = formatKickoffParts(kickoff, predictionTimeZone);
  const timeZoneLabel = formatTimezoneShortName(predictionTimeZone, kickoffDate);
  const ticketTone = getMatchTicketTone(statusLabel, badgeClass);
  const scoreLabel = isFinished && finalScore ? `${finalScore.home} - ${finalScore.away}` : "VS";
  const ticketActionLabel = getTicketActionLabel(isFinished, statusLabel);

  return (
    <div className={`match-ticket match-ticket--${ticketTone}`}>
      <div className="match-ticket__frame" aria-hidden="true">
        <span className="match-ticket__notch match-ticket__notch--left" />
        <span className="match-ticket__notch match-ticket__notch--right" />
      </div>
      <div className="match-ticket__pitch" aria-hidden="true" />
      <div className="match-ticket__shine" aria-hidden="true" />

      <header className="match-ticket__header">
        <span className="match-ticket__brand">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M7 4h10v3a5 5 0 0 1-10 0V4Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <path d="M9 17h6M12 12v5M8 21h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <span>World Cup 2026</span>
        </span>

        {stageMeta.kind === "group" ? (
          <span className="match-ticket__group-chip">
            <span>Group</span>
            <strong>{stageMeta.groupLetter}</strong>
          </span>
        ) : (
          <span className="match-ticket__round-chip">{stageMeta.kind === "knockout" ? stageMeta.shortLabel : stageMeta.label}</span>
        )}
      </header>

      <div className="match-ticket__versus" aria-label={isFinished && finalScore ? `Final score ${scoreLabel}` : "Versus"}>
        <span className="match-ticket__versus-line" aria-hidden="true" />
        <strong className={isFinished && finalScore ? "match-ticket__score" : undefined}>{scoreLabel}</strong>
        <span className="match-ticket__versus-line" aria-hidden="true" />
      </div>

      <div className="match-ticket__schedule">
        <span className="match-ticket__date">{kickoffParts.dateLine}</span>
        <span className="match-ticket__time">
          {kickoffParts.timeLine} {timeZoneLabel}
        </span>
      </div>

      {venue ? <p className="match-ticket__venue">{formatVenueShort(venue)}</p> : null}

      {ticketActionLabel ? (
        <span className={`match-ticket__status match-card__badge ${badgeClass}`} aria-label={statusLabel}>
          {ticketActionLabel}
        </span>
      ) : null}

      {urgencyNote ? <span className="match-ticket__note">{urgencyNote}</span> : null}
      <span className="match-ticket__hint">{isOpen ? "Tap to collapse" : "Tap to make your pick"}</span>
    </div>
  );
}
