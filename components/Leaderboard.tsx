"use client";

import { useMemo, useState } from "react";

import { GroupStageInsights } from "@/components/GroupStageInsights";
import { LeaderboardPlayerDetail } from "@/components/LeaderboardPlayerDetail";
import { MomentumBadge } from "@/components/MomentumBadge";
import { SectionStoryHeader } from "@/components/SectionStoryHeader";
import type { DashboardStanding } from "@/lib/dashboard";
import {
  buildChaseMessage,
  getLeaderboardRankZone,
  getLeaderboardZoneLabel,
  getPlayerAvatarHue,
  getPlayerInitials,
  getVisibleLeaderboardZones
} from "@/lib/leaderboard-presentation";
import type { PlayerStandingScope } from "@/lib/player-standing";
import { formatRankChangeLabel } from "@/lib/utils";

type LeaderboardTab = "knockout" | "round-of-32" | "group-stage";
type GroupStageSubTab = "standings" | "insights";

type LeaderboardProps = {
  leagueSlug: string;
  knockoutStandings: DashboardStanding[];
  roundOf32Standings: DashboardStanding[];
  groupStageStandings: DashboardStanding[];
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

const tabCopy: Record<
  LeaderboardTab,
  { eyebrow: string; title: string; copy: string; chip: string }
> = {
  knockout: {
    eyebrow: "Knockout reset",
    title: "Knockout leaderboard",
    copy: "Everyone starts at zero from match 89. Only Round of 16 picks and beyond count here.",
    chip: "From match 89"
  },
  "round-of-32": {
    eyebrow: "Historical",
    title: "Round of 32 leaderboard",
    copy: "Final Round of 32 standings frozen in history. Matches 73–88 only.",
    chip: "Matches 73–88"
  },
  "group-stage": {
    eyebrow: "Historical",
    title: "Group stage leaderboard",
    copy: "Final group-stage standings frozen in history. Open Insights for the wildest prediction stories from matches 1–72.",
    chip: "Matches 1–72"
  }
};

export function Leaderboard({
  leagueSlug,
  knockoutStandings,
  roundOf32Standings,
  groupStageStandings,
  currentUserId
}: LeaderboardProps) {
  const [activeTab, setActiveTab] = useState<LeaderboardTab>("knockout");
  const [groupStageSubTab, setGroupStageSubTab] = useState<GroupStageSubTab>("standings");
  const [selectedPlayer, setSelectedPlayer] = useState<{ id: string; name: string } | null>(null);

  const standings =
    activeTab === "knockout"
      ? knockoutStandings
      : activeTab === "round-of-32"
        ? roundOf32Standings
        : groupStageStandings;
  const standingScope: PlayerStandingScope = activeTab;
  const copy = tabCopy[activeTab];

  const leader = standings[0];
  const maxPoints = Math.max(leader?.totalPoints ?? 0, 1);
  const currentUserStanding = useMemo(
    () => standings.find((entry) => entry.id === currentUserId),
    [currentUserId, standings]
  );
  const chaseMessage = currentUserStanding
    ? buildChaseMessage(currentUserStanding, leader, standings.length, activeTab)
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
        <SectionStoryHeader tone="leaderboard" eyebrow={copy.eyebrow} title={copy.title} copy={copy.copy}>
          <div className="leaderboard-ribbon">
            <span className="leaderboard-ribbon__chip">
              <strong>{standings.length}</strong> managers
            </span>
            <span className="leaderboard-ribbon__chip leaderboard-ribbon__chip--leader">{copy.chip}</span>
            {currentUserStanding ? (
              <span
                className={`leaderboard-ribbon__chip leaderboard-ribbon__chip--you${currentUserZone ? ` leaderboard-ribbon__chip--${currentUserZone}` : ""}`}
              >
                You sit <strong>#{currentUserStanding.rank}</strong>
              </span>
            ) : null}
          </div>
        </SectionStoryHeader>

        <div className="leaderboard-tabs" role="tablist" aria-label="Leaderboard views">
          <button
            className={`leaderboard-tabs__button leaderboard-tabs__button--knockout${activeTab === "knockout" ? " leaderboard-tabs__button--active" : ""}`}
            type="button"
            role="tab"
            aria-selected={activeTab === "knockout"}
            onClick={() => setActiveTab("knockout")}
          >
            Knockout
            <span className="leaderboard-tabs__count">{knockoutStandings.length}</span>
          </button>
          <button
            className={`leaderboard-tabs__button leaderboard-tabs__button--history${activeTab === "round-of-32" ? " leaderboard-tabs__button--active" : ""}`}
            type="button"
            role="tab"
            aria-selected={activeTab === "round-of-32"}
            onClick={() => setActiveTab("round-of-32")}
          >
            Round of 32
            <span className="leaderboard-tabs__count">{roundOf32Standings.length}</span>
          </button>
          <button
            className={`leaderboard-tabs__button leaderboard-tabs__button--history${activeTab === "group-stage" ? " leaderboard-tabs__button--active" : ""}`}
            type="button"
            role="tab"
            aria-selected={activeTab === "group-stage"}
            onClick={() => setActiveTab("group-stage")}
          >
            Group stage
            <span className="leaderboard-tabs__count">{groupStageStandings.length}</span>
          </button>
        </div>

        {activeTab === "group-stage" ? (
          <div className="leaderboard-subtabs" role="tablist" aria-label="Group stage views">
            <button
              className={`leaderboard-subtabs__button${groupStageSubTab === "standings" ? " leaderboard-subtabs__button--active" : ""}`}
              type="button"
              role="tab"
              aria-selected={groupStageSubTab === "standings"}
              onClick={() => setGroupStageSubTab("standings")}
            >
              Standings
            </button>
            <button
              className={`leaderboard-subtabs__button${groupStageSubTab === "insights" ? " leaderboard-subtabs__button--active" : ""}`}
              type="button"
              role="tab"
              aria-selected={groupStageSubTab === "insights"}
              onClick={() => setGroupStageSubTab("insights")}
            >
              Insights
            </button>
          </div>
        ) : null}

        {activeTab === "group-stage" && groupStageSubTab === "insights" ? (
          <GroupStageInsights leagueSlug={leagueSlug} />
        ) : (
          <>
            {chaseMessage && (activeTab !== "group-stage" || groupStageSubTab === "standings") ? (
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
                            <span
                              className={`leaderboard-stat-pill leaderboard-stat-pill--bonus leaderboard-stat-pill--${zone}`}
                            >
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
          </>
        )}

        <a className="section__jump" href="#top">
          Back to top
        </a>
      </section>

      <LeaderboardPlayerDetail
        leagueSlug={leagueSlug}
        playerId={selectedPlayer?.id ?? null}
        playerName={selectedPlayer?.name ?? null}
        scope={standingScope}
        onClose={() => setSelectedPlayer(null)}
      />
    </>
  );
}
