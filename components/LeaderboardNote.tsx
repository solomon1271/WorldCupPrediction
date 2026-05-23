export function LeaderboardNote() {
  return (
    <p className="section-note">
      Leaderboard points update only for matches with official finished results. Future fixtures do not affect standings yet.
      Green triangle up or red triangle down appear when a player&apos;s rank changed after the last daily update.
      A dash means no change. Run the daily cron after results are added to refresh rank movement.
    </p>
  );
}
