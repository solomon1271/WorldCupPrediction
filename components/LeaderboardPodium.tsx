"use client";

import { DashboardStanding } from "@/lib/dashboard";
import {
  getLeaderboardRankZone,
  getPlayerAvatarHue,
  getPlayerInitials
} from "@/lib/leaderboard-presentation";
import { MomentumBadge } from "@/components/MomentumBadge";

type LeaderboardPodiumProps = {
  standings: DashboardStanding[];
  currentUserId: string;
  onSelectPlayer: (entry: DashboardStanding) => void;
};

type PodiumSlotProps = {
  entry: DashboardStanding;
  rank: number;
  currentUserId: string;
  onSelectPlayer: (entry: DashboardStanding) => void;
};

function PodiumSlot({ entry, rank, totalPlayers, currentUserId, onSelectPlayer }: PodiumSlotProps & { totalPlayers: number }) {
  const zone = getLeaderboardRankZone(rank, totalPlayers);
  const isCurrentUser = entry.id === currentUserId;

  if (rank > 3) {
    return null;
  }

  return (
    <button
      className={`leaderboard-podium__slot leaderboard-podium__slot--${zone}${isCurrentUser ? " leaderboard-podium__slot--you" : ""}`}
      type="button"
      onClick={() => onSelectPlayer(entry)}
    >
      {rank === 1 ? (
        <span className="leaderboard-podium__crown" aria-hidden="true">
          👑
        </span>
      ) : null}

      <span className="leaderboard-podium__rank">#{rank}</span>

      <span
        className="leaderboard-avatar leaderboard-avatar--podium"
        style={
          {
            "--avatar-hue": `${getPlayerAvatarHue(entry.name)}deg`
          } as React.CSSProperties & Record<string, string>
        }
        aria-hidden="true"
      >
        {getPlayerInitials(entry.name)}
      </span>

      <strong className="leaderboard-podium__name">{entry.name}</strong>
      <span className="leaderboard-podium__points">{entry.totalPoints} pts</span>

      <span className="leaderboard-podium__momentum">
        <MomentumBadge
          momentum={entry.trend}
          rank={entry.rank}
          previousRank={entry.previousRank}
          afterRank={entry.afterRank}
          hasSnapshot={entry.hasSnapshot}
        />
      </span>

      {isCurrentUser ? <span className="leaderboard-podium__you">You</span> : null}
    </button>
  );
}

export function LeaderboardPodium({ standings, currentUserId, onSelectPlayer }: LeaderboardPodiumProps) {
  if (standings.length < 2) {
    return null;
  }

  const topThree = standings.slice(0, 3);
  const podiumOrder =
    topThree.length >= 3
      ? [
          { entry: topThree[1], rank: 2 },
          { entry: topThree[0], rank: 1 },
          { entry: topThree[2], rank: 3 }
        ]
      : [
          { entry: topThree[1], rank: 2 },
          { entry: topThree[0], rank: 1 }
        ];

  return (
    <div
      className={`leaderboard-podium${topThree.length < 3 ? " leaderboard-podium--duo" : ""}`}
      aria-label="Top players podium"
    >
      <div className="leaderboard-podium__spotlight" aria-hidden="true" />
      <div className="leaderboard-podium__stage" aria-hidden="true" />

      {podiumOrder.map(({ entry, rank }) => (
        <PodiumSlot
          key={entry.id}
          entry={entry}
          rank={rank}
          totalPlayers={standings.length}
          currentUserId={currentUserId}
          onSelectPlayer={onSelectPlayer}
        />
      ))}
    </div>
  );
}
