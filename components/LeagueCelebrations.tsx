"use client";

import { useState } from "react";

import { GroupStageCelebrationModal } from "@/components/GroupStageCelebrationModal";
import { MatchWinnerRevealModal } from "@/components/MatchWinnerRevealModal";
import { RoundOf32CelebrationModal } from "@/components/RoundOf32CelebrationModal";
import { GroupStageCelebration } from "@/lib/group-stage-announcement";
import { MatchWinnerRevealAnnouncement } from "@/lib/match-winner-announcement";
import { RoundOf32Celebration } from "@/lib/round-of-32-announcement";

type LeagueCelebrationsProps = {
  leagueSlug: string;
  matchAnnouncements: MatchWinnerRevealAnnouncement[];
  groupStageCelebration: GroupStageCelebration | null;
  roundOf32Celebration: RoundOf32Celebration | null;
  predictionTimeZone: string;
};

export function LeagueCelebrations({
  leagueSlug,
  matchAnnouncements,
  groupStageCelebration,
  roundOf32Celebration,
  predictionTimeZone
}: LeagueCelebrationsProps) {
  const [matchRevealsDone, setMatchRevealsDone] = useState(matchAnnouncements.length === 0);
  const [groupStageDone, setGroupStageDone] = useState(!groupStageCelebration);
  const [roundOf32Done, setRoundOf32Done] = useState(!roundOf32Celebration);

  if (!matchRevealsDone) {
    return (
      <MatchWinnerRevealModal
        leagueSlug={leagueSlug}
        announcements={matchAnnouncements}
        predictionTimeZone={predictionTimeZone}
        onFinished={() => setMatchRevealsDone(true)}
      />
    );
  }

  if (!groupStageDone && groupStageCelebration) {
    return (
      <GroupStageCelebrationModal
        leagueSlug={leagueSlug}
        celebration={groupStageCelebration}
        onFinished={() => setGroupStageDone(true)}
      />
    );
  }

  if (!roundOf32Done && roundOf32Celebration) {
    return (
      <RoundOf32CelebrationModal
        leagueSlug={leagueSlug}
        celebration={roundOf32Celebration}
        onFinished={() => setRoundOf32Done(true)}
      />
    );
  }

  return null;
}
