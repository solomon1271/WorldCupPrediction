import { MatchShowcaseTicket } from "@/components/MatchShowcaseTicket";
import { parsePlaceholderTeam, type PlaceholderTeamMeta } from "@/lib/placeholder-team";
import { getFlagImageUrl, getTeamShowcase } from "@/lib/team-showcase";

type MatchShowcaseHeroProps = {
  homeTeam: string;
  awayTeam: string;
  kickoff: string;
  stage: string;
  venue: string;
  predictionTimeZone: string;
  statusLabel: string;
  badgeClass: string;
  isFinished: boolean;
  finalScore?: { home: number; away: number };
  urgencyNote?: string | null;
  isOpen: boolean;
};

function ShowcaseSide({
  team,
  side
}: {
  team: string;
  side: "home" | "away";
}) {
  const showcase = getTeamShowcase(team);

  if (!showcase) {
    return null;
  }

  const flagUrl = getFlagImageUrl(showcase.countryCode);

  return (
    <div
      className={`match-showcase__side match-showcase__side--${side}`}
      style={
        {
          "--team-accent": showcase.accent
        } as React.CSSProperties & Record<string, string>
      }
    >
      <div className="match-showcase__flag-wrap">
        <img alt="" aria-hidden="true" className="match-showcase__flag" src={flagUrl} />
        <div className="match-showcase__side-copy">
          <span className="match-showcase__team">{showcase.team}</span>
        </div>
      </div>
    </div>
  );
}

function TbdShowcaseSide({
  meta,
  side
}: {
  meta: PlaceholderTeamMeta;
  side: "home" | "away";
}) {
  return (
    <div
      className={`match-showcase__side match-showcase__side--tbd match-showcase__side--${side}`}
      style={
        {
          "--team-accent": meta.accent
        } as React.CSSProperties & Record<string, string>
      }
    >
      <div className="match-showcase__tbd-backdrop" aria-hidden="true">
        <div className="match-showcase__tbd-bracket" />
        <div className="match-showcase__tbd-glow" />
      </div>

      {meta.groups.length > 0 ? (
        <div className="match-showcase__tbd-chips" aria-hidden="true">
          {meta.groups.map((group) => (
            <span key={group} className="match-showcase__tbd-chip">
              {group}
            </span>
          ))}
        </div>
      ) : (
        <span className="match-showcase__tbd-mark" aria-hidden="true">
          ?
        </span>
      )}

      <div className="match-showcase__side-copy">
        <span className="match-showcase__team">{meta.headline}</span>
        <strong className="match-showcase__tbd-label">{meta.sublabel}</strong>
      </div>
    </div>
  );
}

function MatchShowcaseSide({
  team,
  side
}: {
  team: string;
  side: "home" | "away";
}) {
  const placeholder = parsePlaceholderTeam(team);

  if (placeholder) {
    return <TbdShowcaseSide meta={placeholder} side={side} />;
  }

  return <ShowcaseSide team={team} side={side} />;
}

export function MatchShowcaseHero({
  homeTeam,
  awayTeam,
  kickoff,
  stage,
  venue,
  predictionTimeZone,
  statusLabel,
  badgeClass,
  isFinished,
  finalScore,
  urgencyNote,
  isOpen
}: MatchShowcaseHeroProps) {
  const hasTbdSide = Boolean(parsePlaceholderTeam(homeTeam) || parsePlaceholderTeam(awayTeam));

  return (
    <div
      className={`match-showcase${isOpen ? " match-showcase--open" : ""}${hasTbdSide ? " match-showcase--tbd" : ""}`}
    >
      <div className="match-showcase__arena" aria-hidden="true" />
      <MatchShowcaseSide team={homeTeam} side="home" />
      <MatchShowcaseSide team={awayTeam} side="away" />

      <div className="match-showcase__center">
        <MatchShowcaseTicket
          stage={stage}
          kickoff={kickoff}
          venue={venue}
          predictionTimeZone={predictionTimeZone}
          statusLabel={statusLabel}
          badgeClass={badgeClass}
          isFinished={isFinished}
          finalScore={finalScore}
          urgencyNote={urgencyNote}
          isOpen={isOpen}
        />
      </div>
    </div>
  );
}
