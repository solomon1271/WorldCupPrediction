"use client";

import { useState } from "react";

import { GroupStageCelebrationModal } from "@/components/GroupStageCelebrationModal";
import { KnockoutCelebrationModal } from "@/components/KnockoutCelebrationModal";
import { MatchWinnerRevealModal } from "@/components/MatchWinnerRevealModal";
import { RoundOf32CelebrationModal } from "@/components/RoundOf32CelebrationModal";
import { TopPicksCelebrationModal } from "@/components/TopPicksCelebrationModal";
import { TournamentChampionCelebrationModal } from "@/components/TournamentChampionCelebrationModal";
import { GroupStageCelebration } from "@/lib/group-stage-announcement";
import { KnockoutCelebration } from "@/lib/knockout-announcement";
import { MatchWinnerRevealAnnouncement } from "@/lib/match-winner-announcement";
import { RoundOf32Celebration } from "@/lib/round-of-32-announcement";
import { TopPicksCelebration } from "@/lib/top-picks-announcement";
import { TournamentCelebration } from "@/lib/tournament-announcement";

type LeagueCelebrationsProps = {
  leagueSlug: string;
  matchAnnouncements: MatchWinnerRevealAnnouncement[];
  groupStageCelebration: GroupStageCelebration | null;
  roundOf32Celebration: RoundOf32Celebration | null;
  tournamentCelebration: TournamentCelebration | null;
  knockoutCelebration: KnockoutCelebration | null;
  topPicksCelebration: TopPicksCelebration | null;
  predictionTimeZone: string;
};

export function LeagueCelebrations({
  leagueSlug,
  matchAnnouncements,
  groupStageCelebration,
  roundOf32Celebration,
  tournamentCelebration,
  knockoutCelebration,
  topPicksCelebration,
  predictionTimeZone
}: LeagueCelebrationsProps) {
  const [matchRevealsDone, setMatchRevealsDone] = useState(matchAnnouncements.length === 0);
  const [groupStageDone, setGroupStageDone] = useState(!groupStageCelebration);
  const [roundOf32Done, setRoundOf32Done] = useState(!roundOf32Celebration);
  const [tournamentDone, setTournamentDone] = useState(!tournamentCelebration);
  const [knockoutDone, setKnockoutDone] = useState(!knockoutCelebration);
  const [topPicksDone, setTopPicksDone] = useState(!topPicksCelebration);

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

  if (!tournamentDone && tournamentCelebration) {
    return (
      <TournamentChampionCelebrationModal
        leagueSlug={leagueSlug}
        celebration={tournamentCelebration}
        onFinished={() => setTournamentDone(true)}
      />
    );
  }

  if (!knockoutDone && knockoutCelebration) {
    return (
      <KnockoutCelebrationModal
        leagueSlug={leagueSlug}
        celebration={knockoutCelebration}
        onFinished={() => setKnockoutDone(true)}
      />
    );
  }

  if (!topPicksDone && topPicksCelebration) {
    return (
      <TopPicksCelebrationModal
        leagueSlug={leagueSlug}
        celebration={topPicksCelebration}
        onFinished={() => setTopPicksDone(true)}
      />
    );
  }

  return null;
}
