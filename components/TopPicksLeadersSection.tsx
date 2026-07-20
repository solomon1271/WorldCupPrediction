"use client";

import { useMemo, useState } from "react";

import { LeaderboardPlayerDetail } from "@/components/LeaderboardPlayerDetail";
import { SectionStoryHeader } from "@/components/SectionStoryHeader";
import type { TopPicksStanding } from "@/lib/leaderboard";
import {
  getLeaderboardRankZone,
  getPlayerAvatarHue,
  getPlayerInitials
} from "@/lib/leaderboard-presentation";
import {
  TOURNAMENT_AWARD_POINTS,
  TOURNAMENT_TOP_PICK_COUNT,
  type TournamentAwards
} from "@/lib/tournament-scoring";

type TopPicksLeadersSectionProps = {
  leagueSlug: string;
  standings: TopPicksStanding[];
  officialAwards: TournamentAwards;
  officialAwardsConfigured: boolean;
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

function RankBadge({ rank, totalPlayers }: { rank: number; totalPlayers: number }) {
  const zone = getLeaderboardRankZone(rank, totalPlayers);
  const label = rank <= 3 ? String(rank) : `#${rank}`;

  return <span className={`leaderboard-rank-badge leaderboard-rank-badge--${zone}`}>{label}</span>;
}

export function TopPicksLeadersSection({
  leagueSlug,
  standings,
  officialAwards,
  officialAwardsConfigured,
  currentUserId
}: TopPicksLeadersSectionProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<{ id: string; name: string } | null>(null);
  const leader = standings[0];
  const maxPoints = Math.max(leader?.totalPoints ?? 0, 1);
  const currentUserStanding = useMemo(
    () => standings.find((entry) => entry.id === currentUserId),
    [currentUserId, standings]
  );
  const tiedLeaders =
    leader && leader.totalPoints > 0
      ? standings.filter((entry) => entry.totalPoints === leader.totalPoints)
      : [];

  return (
    <>
      <section id="top-picks-leaders" className="section section--top-picks-leaders">
        <SectionStoryHeader
          tone="tournament"
          eyebrow="Awards race"
          title="Top picks leaders"
          copy="A separate ranking for champion, runner-up, and award picks only. Click any manager to see their full top picks."
        >
          <div className="leaderboard-ribbon">
            <span className="leaderboard-ribbon__chip">
              <strong>{standings.length}</strong> managers
            </span>
            <span className="leaderboard-ribbon__chip leaderboard-ribbon__chip--leader">
              {TOURNAMENT_AWARD_POINTS} pts × {TOURNAMENT_TOP_PICK_COUNT}
            </span>
            {currentUserStanding ? (
              <span className="leaderboard-ribbon__chip leaderboard-ribbon__chip--you">
                You sit <strong>#{currentUserStanding.rank}</strong>
              </span>
            ) : null}
          </div>
        </SectionStoryHeader>

        {officialAwardsConfigured ? (
          <div className="top-picks-awards-banner" role="note">
            <div>
              <p className="top-picks-awards-banner__eyebrow">Official awards</p>
              <h3>
                {tiedLeaders.length === 1
                  ? `${tiedLeaders[0].name} leads Top picks`
                  : tiedLeaders.length > 1
                    ? `${tiedLeaders.map((entry) => entry.name).join(" & ")} share the Top picks lead`
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
        )}

        <div className="leaderboard-panel">
          <div className="leaderboard-panel__glow" aria-hidden="true" />
          <div className="table-shell leaderboard-table-shell">
            <table className="leaderboard-table top-picks-leaders-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Manager</th>
                  <th>Points</th>
                  <th>Hits</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((entry) => {
                  const isCurrentUser = entry.id === currentUserId;
                  const zone = getLeaderboardRankZone(entry.rank, standings.length);

                  return (
                    <tr
                      key={entry.id}
                      className={`leaderboard-table__row leaderboard-table__row--${zone}${isCurrentUser ? " leaderboard-table__row--you" : ""}`}
                    >
                      <td>
                        <RankBadge rank={entry.rank} totalPlayers={standings.length} />
                      </td>
                      <td>
                        <button
                          className="leaderboard-player-button leaderboard-player-button--rich"
                          type="button"
                          onClick={() => setSelectedPlayer({ id: entry.id, name: entry.name })}
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
                            {isCurrentUser ? <span className="leaderboard-player-button__tag">You</span> : null}
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
                        <span className={`leaderboard-stat-pill leaderboard-stat-pill--bonus leaderboard-stat-pill--${zone}`}>
                          {entry.hits}/{TOURNAMENT_TOP_PICK_COUNT}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <a className="section__jump" href="#leaderboard">
          Jump to match leaderboards
        </a>
      </section>

      <LeaderboardPlayerDetail
        leagueSlug={leagueSlug}
        playerId={selectedPlayer?.id ?? null}
        playerName={selectedPlayer?.name ?? null}
        scope="top-picks"
        onClose={() => setSelectedPlayer(null)}
      />
    </>
  );
}
