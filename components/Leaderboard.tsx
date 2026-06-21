"use client";

import { useState } from "react";

import { LeaderboardPlayerDetail } from "@/components/LeaderboardPlayerDetail";
import { MomentumBadge } from "@/components/MomentumBadge";
import { DashboardStanding } from "@/lib/dashboard";
import { formatRankChangeLabel } from "@/lib/utils";

type LeaderboardProps = {
  leagueSlug: string;
  standings: DashboardStanding[];
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

export function Leaderboard({ leagueSlug, standings }: LeaderboardProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<{ id: string; name: string } | null>(null);

  return (
    <>
      <section id="leaderboard" className="section">
        <div className="section__heading">
          <p className="eyebrow">Standings</p>
          <p className="section__copy">Click any player name to view their picks and how they earned their points.</p>
        </div>
        <div className="table-shell">
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Total Points</th>
                <th>Exact Scores</th>
                <th>Correct Outcomes</th>
                <th>Bonus Hits</th>
                <th>Rank change</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((entry, index) => (
                <tr key={entry.id}>
                  <td>#{index + 1}</td>
                  <td>
                    <button
                      className="leaderboard-player-button"
                      type="button"
                      onClick={() => setSelectedPlayer({ id: entry.id, name: entry.name })}
                    >
                      {entry.name}
                    </button>
                  </td>
                  <td>{entry.totalPoints}</td>
                  <td>{entry.exactScores}</td>
                  <td>{entry.outcomes}</td>
                  <td>{entry.bonusHits}</td>
                  <td>
                    <RankChangeCell entry={entry} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
