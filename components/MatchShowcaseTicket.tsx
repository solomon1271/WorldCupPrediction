import {
  formatKickoffParts,
  formatVenueShort,
  getMatchTicketTone,
  parseMatchStage
} from "@/lib/match-presentation";

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

function TicketStatusIcon({ statusLabel }: { statusLabel: string }) {
  const props = {
    className: "match-ticket__status-icon",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true
  };

  if (statusLabel === "Locked") {
    return (
      <svg {...props}>
        <rect x="5" y="11" width="14" height="10" rx="2" />
        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
      </svg>
    );
  }

  if (statusLabel === "Finished") {
    return (
      <svg {...props}>
        <path d="M20 6 9 17l-5-5" />
      </svg>
    );
  }

  if (statusLabel === "Pick saved" || statusLabel === "Pick today") {
    return (
      <svg {...props}>
        <path d="M12 3.5 14.8 9l6.2.9-4.5 4.4 1.1 6.2L12 17.8 6.4 20.5l1.1-6.2L3 9.9 9.2 9 12 3.5Z" />
      </svg>
    );
  }

  return (
    <svg {...props}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
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
  const kickoffParts = formatKickoffParts(kickoff, predictionTimeZone);
  const ticketTone = getMatchTicketTone(statusLabel, badgeClass);
  const scoreLabel = isFinished && finalScore ? `${finalScore.home} - ${finalScore.away}` : "VS";

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
        <span className="match-ticket__time">{kickoffParts.timeLine}</span>
      </div>

      {venue ? <p className="match-ticket__venue">{formatVenueShort(venue)}</p> : null}

      <span className={`match-ticket__status match-card__badge ${badgeClass}`}>
        <TicketStatusIcon statusLabel={statusLabel} />
        {statusLabel}
      </span>

      {urgencyNote ? <span className="match-ticket__note">{urgencyNote}</span> : null}
      <span className="match-ticket__hint">{isOpen ? "Tap to collapse" : "Tap to make your pick"}</span>
    </div>
  );
}
