import { DashboardStanding } from "@/lib/dashboard";
import { trendLabel } from "@/lib/utils";

type LeaderboardProps = {
  standings: DashboardStanding[];
};

export function Leaderboard({ standings }: LeaderboardProps) {
  return (
    <section id="leaderboard" className="section">
      <div className="section__heading">
        <p className="eyebrow">Standings</p>
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
              <th>Momentum</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((entry, index) => (
              <tr key={entry.id}>
                <td>#{index + 1}</td>
                <td>{entry.name}</td>
                <td>{entry.totalPoints}</td>
                <td>{entry.exactScores}</td>
                <td>{entry.outcomes}</td>
                <td>{entry.bonusHits}</td>
                <td>{trendLabel(entry.trend)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <a className="section__jump" href="#top">
        Back to top
      </a>
    </section>
  );
}
