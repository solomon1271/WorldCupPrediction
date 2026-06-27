"use client";

import { useState } from "react";

import { MatchShowcaseTicket } from "@/components/MatchShowcaseTicket";
import { getFlagImageUrl, getPlayerImageUrl, getTeamShowcase } from "@/lib/team-showcase";

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
  const [useFlagFallback, setUseFlagFallback] = useState(false);

  if (!showcase) {
    return null;
  }

  const flagUrl = getFlagImageUrl(showcase.countryCode);
  const playerUrl = getPlayerImageUrl(showcase.countryCode);
  const imageSrc = useFlagFallback ? flagUrl : playerUrl;

  return (
    <div
      className={`match-showcase__side match-showcase__side--${side}`}
      style={
        {
          "--team-accent": showcase.accent
        } as React.CSSProperties & Record<string, string>
      }
    >
      <img
        alt=""
        aria-hidden="true"
        className="match-showcase__flag"
        src={flagUrl}
      />
      <img
        alt={`${showcase.player} of ${showcase.team}`}
        className={`match-showcase__player${useFlagFallback ? " match-showcase__player--flag" : ""}`}
        src={imageSrc}
        onError={() => setUseFlagFallback(true)}
      />
      <div className="match-showcase__side-copy">
        <span className="match-showcase__team">{showcase.team}</span>
        <strong className="match-showcase__player-name">{showcase.player}</strong>
      </div>
    </div>
  );
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
  return (
    <div className={`match-showcase${isOpen ? " match-showcase--open" : ""}`}>
      <div className="match-showcase__arena" aria-hidden="true" />
      <ShowcaseSide team={homeTeam} side="home" />
      <ShowcaseSide team={awayTeam} side="away" />

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
