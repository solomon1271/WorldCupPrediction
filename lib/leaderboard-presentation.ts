import type { DashboardStanding } from "@/lib/dashboard";

export type LeaderboardRankZone =
  | "crown"
  | "chaser"
  | "podium"
  | "mid-pack"
  | "tail-third"
  | "tail-second"
  | "tail-last";

const ZONE_ORDER: LeaderboardRankZone[] = [
  "crown",
  "chaser",
  "podium",
  "mid-pack",
  "tail-third",
  "tail-second",
  "tail-last"
];

const ZONE_LABELS: Record<LeaderboardRankZone, string> = {
  crown: "Crown",
  chaser: "Title chaser",
  podium: "Podium",
  "mid-pack": "Mid-pack",
  "tail-third": "Hot seat",
  "tail-second": "Danger zone",
  "tail-last": "Cellar"
};

export function getPlayerInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "?";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function getPlayerAvatarHue(name: string) {
  let hash = 0;

  for (let index = 0; index < name.length; index += 1) {
    hash = name.charCodeAt(index) + ((hash << 5) - hash);
  }

  return Math.abs(hash) % 360;
}

export function getLeaderboardRankZone(rank: number, totalPlayers: number): LeaderboardRankZone {
  if (rank === 1) {
    return "crown";
  }

  if (rank === 2) {
    return "chaser";
  }

  if (rank === 3) {
    return "podium";
  }

  const tailStart = Math.max(4, totalPlayers - 2);

  if (rank >= tailStart) {
    if (rank === totalPlayers) {
      return "tail-last";
    }

    if (rank === totalPlayers - 1) {
      return "tail-second";
    }

    return "tail-third";
  }

  return "mid-pack";
}

export function getVisibleLeaderboardZones(totalPlayers: number) {
  const zones = new Set<LeaderboardRankZone>();

  for (let rank = 1; rank <= totalPlayers; rank += 1) {
    zones.add(getLeaderboardRankZone(rank, totalPlayers));
  }

  return ZONE_ORDER.filter((zone) => zones.has(zone));
}

export function getLeaderboardZoneLabel(zone: LeaderboardRankZone) {
  return ZONE_LABELS[zone];
}

export function buildChaseMessage(
  entry: DashboardStanding,
  leader: DashboardStanding | undefined,
  totalPlayers: number,
  view: "knockout" | "round-of-32" | "group-stage" = "knockout"
) {
  if (view === "group-stage") {
    if (!leader) {
      return "Group-stage standings are frozen here for the record.";
    }

    if (entry.rank === 1) {
      return `Group-stage champion with ${leader.totalPoints} pts. Knockout is a fresh race for everyone.`;
    }

    const gapToLeader = leader.totalPoints - entry.totalPoints;
    return `${gapToLeader} pts behind group-stage leader ${leader.name}. Knockout scoring starts from zero.`;
  }

  if (view === "round-of-32") {
    if (!leader) {
      return "Round of 32 standings are frozen here for the record.";
    }

    if (entry.rank === 1) {
      return `Round of 32 leader with ${leader.totalPoints} pts. The knockout board resets from match 89.`;
    }

    const gapToLeader = leader.totalPoints - entry.totalPoints;
    return `${gapToLeader} pts behind Round of 32 leader ${leader.name}. Round of 16 scoring starts fresh.`;
  }

  if (!leader) {
    return "The knockout race is on — every Round of 16 pick counts toward a new crown.";
  }

  if (leader.totalPoints === 0) {
    return "Everyone starts at zero. The first Round of 16 results will shake up this table.";
  }

  if (entry.rank === 1) {
    return "You're wearing the crown. The rest of the league is coming for your spot.";
  }

  const gapToLeader = leader.totalPoints - entry.totalPoints;
  const zone = getLeaderboardRankZone(entry.rank, totalPlayers);

  if (zone === "tail-last") {
    return `Last place, but the knockout rounds love a plot twist — ${gapToLeader} pts to the crown.`;
  }

  if (zone === "tail-second" || zone === "tail-third") {
    return `Danger zone. ${gapToLeader} pts to ${leader.name} — one perfect scoreline changes everything.`;
  }

  if (entry.trend === "up") {
    return `Climbing fast. Just ${gapToLeader} pts behind ${leader.name} — ride the momentum.`;
  }

  if (gapToLeader <= 5) {
    return `So close. ${gapToLeader} pts off ${leader.name} — the next results could crown you.`;
  }

  if (zone === "chaser") {
    return `One step from the crown. ${gapToLeader} pts behind ${leader.name} — pressure makes diamonds.`;
  }

  if (zone === "podium") {
    return `Podium secured, crown in sight. ${gapToLeader} pts separate you from ${leader.name}.`;
  }

  return `${gapToLeader} pts behind ${leader.name}. Hunt exact scores and storm the podium.`;
}
