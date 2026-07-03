"use client";

import { useState } from "react";

import { GroupStageCelebrationModal } from "@/components/GroupStageCelebrationModal";
import { MatchWinnerRevealModal } from "@/components/MatchWinnerRevealModal";
import { GroupStageCelebration } from "@/lib/group-stage-announcement";
import { MatchWinnerRevealAnnouncement } from "@/lib/match-winner-announcement";

type LeagueCelebrationsProps = {
  leagueSlug: string;
  matchAnnouncements: MatchWinnerRevealAnnouncement[];
  groupStageCelebration: GroupStageCelebration | null;
  predictionTimeZone: string;
};

export function LeagueCelebrations({
  leagueSlug,
  matchAnnouncements,
  groupStageCelebration,
  predictionTimeZone
}: LeagueCelebrationsProps) {
  const [matchRevealsDone, setMatchRevealsDone] = useState(matchAnnouncements.length === 0);
  const [groupStageDone, setGroupStageDone] = useState(!groupStageCelebration);

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

  return null;
}
