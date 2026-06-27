"use client";

import { useMemo, useState } from "react";

import { LeaderboardPlayerDetail } from "@/components/LeaderboardPlayerDetail";
import { LeaderboardPodium } from "@/components/LeaderboardPodium";
import { MomentumBadge } from "@/components/MomentumBadge";
import { SectionStoryHeader } from "@/components/SectionStoryHeader";
import { DashboardStanding } from "@/lib/dashboard";
import {
  buildChaseMessage,
  getLeaderboardRankZone,
  getLeaderboardZoneLabel,
  getPlayerAvatarHue,
  getPlayerInitials,
  getVisibleLeaderboardZones,
} from "@/lib/leaderboard-presentation";
import { formatRankChangeLabel } from "@/lib/utils";

type LeaderboardProps = {
  leagueSlug: string;
  standings: DashboardStanding[];
  currentUserId: string;
};

function RankChangeCell({ entry }: { entry: DashboardStanding }) {
  const displayRank = entry.afterRank ?? entry.rank;
  const rankChange =
    entry.rankChange ??
    (entry.previousRank !== undefined ? entry.previousRank - displayRank : undefined);

  return (
    <span className="rank-change-cell">
      <MomentumBadge
        momentum={entry.trend}
        rank={entry.rank}
        previousRank={entry.previousRank}
        afterRank={entry.afterRank}
        hasSnapshot={entry.hasSnapshot}
      />
      {entry.hasSnapshot && rankChange !== undefined && rankChange !== 0 ? (
        <span
          className={`rank-change-cell__delta rank-change-cell__delta--${entry.trend}`}
          title={`${formatRankChangeLabel(rankChange)} places`}
        >
          {formatRankChangeLabel(rankChange)}
        </span>
      ) : entry.hasSnapshot && rankChange === 0 ? (
        <span className="rank-change-cell__delta rank-change-cell__delta--neutral">0</span>
      ) : null}
    </span>
  );
}

function LeaderboardRankBadge({ rank, totalPlayers }: { rank: number; totalPlayers: number }) {
  const zone = getLeaderboardRankZone(rank, totalPlayers);
  const label = rank <= 3 ? String(rank) : `#${rank}`;

  return <span className={`leaderboard-rank-badge leaderboard-rank-badge--${zone}`}>{label}</span>;
}

function LeaderboardZoneLegend({ totalPlayers }: { totalPlayers: number }) {
  const zones = getVisibleLeaderboardZones(totalPlayers);

  if (zones.length <= 3) {
    return null;
  }

  return (
    <div className="leaderboard-zone-legend" aria-label="Leaderboard rank zones">
      {zones.map((zone) => (
        <span key={zone} className={`leaderboard-zone-legend__item leaderboard-zone-legend__item--${zone}`}>
          {getLeaderboardZoneLabel(zone)}
        </span>
      ))}
    </div>
  );
}

export function Leaderboard({ leagueSlug, standings, currentUserId }: LeaderboardProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<{ id: string; name: string } | null>(null);

  const leader = standings[0];
  const maxPoints = leader?.totalPoints ?? 1;
  const currentUserStanding = useMemo(
    () => standings.find((entry) => entry.id === currentUserId),
    [currentUserId, standings]
  );
  const chaseMessage = currentUserStanding
    ? buildChaseMessage(currentUserStanding, leader, standings.length)
    : null;
  const currentUserZone = currentUserStanding
    ? getLeaderboardRankZone(currentUserStanding.rank, standings.length)
    : null;

  function openPlayer(entry: DashboardStanding) {
    setSelectedPlayer({ id: entry.id, name: entry.name });
  }

  return (
    <>
      <section id="leaderboard" className="section section--leaderboard">
        <SectionStoryHeader
          tone="leaderboard"
          eyebrow="Step into the spotlight"
          title="League leaderboard"
          copy="Tap any manager to peek at their picks, bonus hits, and the points behind every climb."
        >
          <div className="leaderboard-ribbon">
            <span className="leaderboard-ribbon__chip">
              <strong>{standings.length}</strong> managers racing
            </span>
            {leader ? (
              <span className="leaderboard-ribbon__chip leaderboard-ribbon__chip--leader">
                Crown pace <strong>{leader.totalPoints}</strong> pts
              </span>
            ) : null}
            {currentUserStanding ? (
              <span
                className={`leaderboard-ribbon__chip leaderboard-ribbon__chip--you${currentUserZone ? ` leaderboard-ribbon__chip--${currentUserZone}` : ""}`}
              >
                You sit <strong>#{currentUserStanding.rank}</strong>
              </span>
            ) : null}
          </div>
        </SectionStoryHeader>

        <LeaderboardPodium
          standings={standings}
          currentUserId={currentUserId}
          onSelectPlayer={openPlayer}
        />

        {chaseMessage ? (
          <div
            className={`leaderboard-chase-banner${currentUserZone ? ` leaderboard-chase-banner--${currentUserZone}` : ""}`}
          >
            <span className="leaderboard-chase-banner__icon" aria-hidden="true">
              {currentUserZone === "crown" ? "👑" : currentUserZone?.startsWith("tail") ? "🔥" : "⚡"}
            </span>
            <p>{chaseMessage}</p>
          </div>
        ) : null}

        <LeaderboardZoneLegend totalPlayers={standings.length} />

        <div className="leaderboard-panel">
          <div className="leaderboard-panel__glow" aria-hidden="true" />
          <div className="table-shell leaderboard-table-shell">
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Manager</th>
                  <th>Points</th>
                  <th>Exact</th>
                  <th>Outcomes</th>
                  <th>Bonus</th>
                  <th>Momentum</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((entry) => {
                  const rank = entry.rank;
                  const isCurrentUser = entry.id === currentUserId;
                  const zone = getLeaderboardRankZone(rank, standings.length);

                  return (
                    <tr
                      key={entry.id}
                      className={`leaderboard-table__row leaderboard-table__row--${zone}${isCurrentUser ? " leaderboard-table__row--you" : ""}`}
                    >
                      <td>
                        <LeaderboardRankBadge rank={rank} totalPlayers={standings.length} />
                      </td>
                      <td>
                        <button
                          className="leaderboard-player-button leaderboard-player-button--rich"
                          type="button"
                          onClick={() => openPlayer(entry)}
                        >
                          <span
                            className="leaderboard-avatar"
                            style={
                              {
                                "--avatar-hue": `${getPlayerAvatarHue(entry.name)}deg`
                              } as React.CSSProperties & Record<string, string>
                            }
                            aria-hidden="true"
                          >
                            {getPlayerInitials(entry.name)}
                          </span>
                          <span className="leaderboard-player-button__copy">
                            <span className="leaderboard-player-button__name">{entry.name}</span>
                            {isCurrentUser ? (
                              <span className="leaderboard-player-button__tag">You</span>
                            ) : null}
                          </span>
                        </button>
                      </td>
                      <td>
                        <div className={`leaderboard-points leaderboard-points--${zone}`}>
                          <strong>{entry.totalPoints}</strong>
                          <span
                            className="leaderboard-points__bar"
                            style={{ width: `${Math.max(8, (entry.totalPoints / maxPoints) * 100)}%` }}
                            aria-hidden="true"
                          />
                        </div>
                      </td>
                      <td>
                        <span className={`leaderboard-stat-pill leaderboard-stat-pill--${zone}`}>
                          {entry.exactScores}
                        </span>
                      </td>
                      <td>
                        <span className={`leaderboard-stat-pill leaderboard-stat-pill--${zone}`}>
                          {entry.outcomes}
                        </span>
                      </td>
                      <td>
                        <span className={`leaderboard-stat-pill leaderboard-stat-pill--bonus leaderboard-stat-pill--${zone}`}>
                          {entry.bonusHits}
                        </span>
                      </td>
                      <td>
                        <RankChangeCell entry={entry} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <a className="section__jump" href="#top">
          Back to top
        </a>
      </section>

      <LeaderboardPlayerDetail
        leagueSlug={leagueSlug}
        playerId={selectedPlayer?.id ?? null}
        playerName={selectedPlayer?.name ?? null}
        onClose={() => setSelectedPlayer(null)}
      />
    </>
  );
}
