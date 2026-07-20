"use client";

import { useMemo, useState } from "react";

import { GroupStageInsights } from "@/components/GroupStageInsights";
import { LeaderboardPlayerDetail } from "@/components/LeaderboardPlayerDetail";
import { MomentumBadge } from "@/components/MomentumBadge";
import { SectionStoryHeader } from "@/components/SectionStoryHeader";
import type { DashboardStanding } from "@/lib/dashboard";
import type { TopPicksStanding } from "@/lib/leaderboard";
import {
  getLeaderboardRankZone,
  getLeaderboardZoneLabel,
  getPlayerAvatarHue,
  getPlayerInitials,
  getVisibleLeaderboardZones
} from "@/lib/leaderboard-presentation";
import type { PlayerStandingScope } from "@/lib/player-standing";
import {
  TOURNAMENT_AWARD_POINTS,
  TOURNAMENT_TOP_PICK_COUNT,
  type TournamentAwards
} from "@/lib/tournament-scoring";
import { formatRankChangeLabel } from "@/lib/utils";

type LeaderboardTab = "knockout" | "top-picks" | "round-of-32" | "group-stage";
type GroupStageSubTab = "standings" | "insights";

type LeaderboardProps = {
  leagueSlug: string;
  knockoutStandings: DashboardStanding[];
  roundOf32Standings: DashboardStanding[];
  groupStageStandings: DashboardStanding[];
  topPicksStandings: TopPicksStanding[];
  officialAwards: TournamentAwards;
  officialAwardsConfigured: boolean;
  knockoutComplete: boolean;
  currentUserId: string;
};

const AWARD_FIELDS: Array<{ label: string; awardKey: keyof TournamentAwards }> = [
  { label: "Champion", awardKey: "champion" },
  { label: "Runner-up", awardKey: "runnerUp" },
  { label: "Golden Boot", awardKey: "goldenBoot" },
  { label: "Best Young Player", awardKey: "bestYoungPlayer" },
  { label: "Golden Glove", awardKey: "goldenGlove" },
  { label: "Best Player", awardKey: "bestPlayer" }
];

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

function formatWinners(entries: Array<{ name: string }>) {
  if (entries.length === 0) {
    return null;
  }

  if (entries.length === 1) {
    return entries[0].name;
  }

  return entries.map((entry) => entry.name).join(" & ");
}

const tabCopy: Record<
  LeaderboardTab,
  { eyebrow: string; title: string; copy: string; chip: string }
> = {
  knockout: {
    eyebrow: "Final standings",
    title: "Knockout leaderboard",
    copy: "Final knockout standings from match 89 through the World Cup Final.",
    chip: "Matches 89–104"
  },
  "top-picks": {
    eyebrow: "Awards race",
    title: "Top picks leaders",
    copy: "Champion, runner-up, and award picks only. Click a manager to see their predictions.",
    chip: `${TOURNAMENT_AWARD_POINTS} pts × ${TOURNAMENT_TOP_PICK_COUNT}`
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
  topPicksStandings,
  officialAwards,
  officialAwardsConfigured,
  knockoutComplete,
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
        : activeTab === "top-picks"
          ? topPicksStandings
          : groupStageStandings;
  const standingScope: PlayerStandingScope =
    activeTab === "top-picks" ? "top-picks" : activeTab;
  const copy = tabCopy[activeTab];

  const leader = standings[0];
  const maxPoints = Math.max(leader?.totalPoints ?? 0, 1);
  const currentUserStanding = useMemo(
    () => standings.find((entry) => entry.id === currentUserId),
    [currentUserId, standings]
  );
  const currentUserZone = currentUserStanding
    ? getLeaderboardRankZone(currentUserStanding.rank, standings.length)
    : null;

  const knockoutWinners = useMemo(() => {
    const first = knockoutStandings[0];
    if (!first || first.totalPoints <= 0) {
      return [];
    }

    return knockoutStandings.filter((entry) => entry.totalPoints === first.totalPoints);
  }, [knockoutStandings]);

  const topPicksWinners = useMemo(() => {
    const first = topPicksStandings[0];
    if (!first || first.totalPoints <= 0) {
      return [];
    }

    return topPicksStandings.filter((entry) => entry.totalPoints === first.totalPoints);
  }, [topPicksStandings]);

  function openPlayer(entry: { id: string; name: string }) {
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
            className={`leaderboard-tabs__button leaderboard-tabs__button--awards${activeTab === "top-picks" ? " leaderboard-tabs__button--active" : ""}`}
            type="button"
            role="tab"
            aria-selected={activeTab === "top-picks"}
            onClick={() => setActiveTab("top-picks")}
          >
            Top picks
            <span className="leaderboard-tabs__count">{topPicksStandings.length}</span>
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
            {activeTab === "knockout" && knockoutComplete && knockoutWinners.length > 0 ? (
              <div className="leaderboard-winner-banner" role="status">
                <span className="leaderboard-winner-banner__mark" aria-hidden="true">
                  🏆
                </span>
                <div>
                  <p className="leaderboard-winner-banner__eyebrow">Knockout complete</p>
                  <p className="leaderboard-winner-banner__title">
                    {knockoutWinners.length > 1 ? "Knockout co-champions" : "Knockout champion"}:{" "}
                    <strong>{formatWinners(knockoutWinners)}</strong>
                  </p>
                  <p className="leaderboard-winner-banner__copy">
                    {knockoutWinners[0].totalPoints} points
                    {knockoutWinners.length > 1 ? " each" : ""} from Round of 16 through the Final.
                  </p>
                </div>
              </div>
            ) : null}

            {activeTab === "top-picks" ? (
              officialAwardsConfigured ? (
                <div className="top-picks-awards-banner" role="note">
                  <div>
                    <p className="top-picks-awards-banner__eyebrow">Official awards</p>
                    <h3>
                      {topPicksWinners.length === 1
                        ? `${topPicksWinners[0].name} leads Top picks`
                        : topPicksWinners.length > 1
                          ? `${formatWinners(topPicksWinners)} share the Top picks lead`
                          : "Awards are in"}
                    </h3>
                    <p className="top-picks-awards-banner__hint">
                      Click a manager below to open their Top picks predictions.
                    </p>
                  </div>
                  <dl className="top-picks-awards-banner__grid">
                    {AWARD_FIELDS.map(({ label, awardKey }) => (
                      <div key={awardKey}>
                        <dt>{label}</dt>
                        <dd>{officialAwards[awardKey] || "—"}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ) : (
                <div className="leaderboard-chase-banner">
                  <span className="leaderboard-chase-banner__icon" aria-hidden="true">
                    ⏳
                  </span>
                  <p>Official awards are not configured yet. Ranking appears once results are locked in.</p>
                </div>
              )
            ) : null}

            {activeTab !== "top-picks" ? <LeaderboardZoneLegend totalPlayers={standings.length} /> : null}

            <div className="leaderboard-panel">
              <div className="leaderboard-panel__glow" aria-hidden="true" />
              <div className="table-shell leaderboard-table-shell">
                <table
                  className={`leaderboard-table${activeTab === "top-picks" ? " top-picks-leaders-table" : ""}`}
                >
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Manager</th>
                      <th>Points</th>
                      {activeTab === "top-picks" ? (
                        <th>Hits</th>
                      ) : (
                        <>
                          <th>Exact</th>
                          <th>Outcomes</th>
                          <th>Bonus</th>
                          <th>Momentum</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {activeTab === "top-picks"
                      ? topPicksStandings.map((entry) => {
                          const isCurrentUser = entry.id === currentUserId;
                          const zone = getLeaderboardRankZone(entry.rank, topPicksStandings.length);

                          return (
                            <tr
                              key={entry.id}
                              className={`leaderboard-table__row leaderboard-table__row--${zone}${isCurrentUser ? " leaderboard-table__row--you" : ""}`}
                            >
                              <td>
                                <LeaderboardRankBadge
                                  rank={entry.rank}
                                  totalPlayers={topPicksStandings.length}
                                />
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
                                    style={{
                                      width: `${Math.max(8, (entry.totalPoints / maxPoints) * 100)}%`
                                    }}
                                    aria-hidden="true"
                                  />
                                </div>
                              </td>
                              <td>
                                <span
                                  className={`leaderboard-stat-pill leaderboard-stat-pill--bonus leaderboard-stat-pill--${zone}`}
                                >
                                  {entry.hits}/{TOURNAMENT_TOP_PICK_COUNT}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      : (standings as DashboardStanding[]).map((entry) => {
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
                                    style={{
                                      width: `${Math.max(8, (entry.totalPoints / maxPoints) * 100)}%`
                                    }}
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
