import {
  EXACT_SCORE_POINTS,
  RED_CARDS_POINTS,
  WINNER_POINTS,
  statThresholdOptions
} from "@/lib/match-scoring";
import {
  matchPointRules,
  thresholdExamples,
  tournamentPointRules
} from "@/lib/rules-content";
import { TOURNAMENT_AWARD_POINTS } from "@/lib/tournament-scoring";

function RuleCards({ rules }: { rules: typeof matchPointRules }) {
  return (
    <div className="rules-grid rules-grid--compact">
      {rules.map((rule) => (
        <article className="rule-card" key={rule.label}>
          <span className="rule-card__points">{rule.points} pts</span>
          <h3>{rule.label}</h3>
          <p>{rule.detail}</p>
        </article>
      ))}
    </div>
  );
}

export function RulesPanel() {
  return (
    <section id="rules" className="section">
      <div className="section__heading">
        <p className="eyebrow">Scoring System</p>
        <h2>How picks work and how points are earned</h2>
        <p className="section__copy">
          One prediction per match. Submit everything before the match locks. Points are added after official
          results are entered.
        </p>
      </div>

      <div className="rules-sections">
        <article className="rules-block card card--feature">
          <p className="card__label">Before you pick</p>
          <h3>Lock timing</h3>
          <ul className="rules-list">
            <li>
              Submit your pick before the daily lock runs at about <strong>8:00 AM Central</strong> on the day the
              match kicks off.
            </li>
            <li>
              Matches that already kicked off stay locked. You cannot change a pick after lock.
            </li>
            <li>
              Games highlighted in pink on the dashboard are kicking off <strong>tomorrow</strong> and still need a
              pick.
            </li>
            <li>
              Exact score is optional. Leave both scores blank if you only want to pick the winner and stat lines.
            </li>
          </ul>
        </article>

        <article className="rules-block">
          <div className="rules-block__heading">
            <p className="eyebrow">Per match</p>
            <h3>Match scoring</h3>
            <p className="section__copy">
              Each finished match can earn up to{" "}
              <strong>{WINNER_POINTS + EXACT_SCORE_POINTS + 10 + 10 + 10 + RED_CARDS_POINTS} points</strong> when all official stats
              are recorded (winner, exact score, goals, corners, yellow cards, and a correct red-card pick).
            </p>
          </div>
          <RuleCards rules={matchPointRules} />
        </article>

        <article className="rules-block card">
          <p className="card__label">Line picks explained</p>
          <h3>Goals, corners, and yellow cards use the same system</h3>
          <p className="section__copy">
            For total goals, total corners, and yellow cards you choose a line from the dropdown. If the official
            result clears your line, you earn points. Bolder lines pay more when you are right.
          </p>
          <ul className="rules-list">
            <li>
              <strong>0</strong> — you are calling exactly zero on that stat. Pays <strong>1 point</strong> if correct.
            </li>
            <li>
              <strong>&gt;0.5, &gt;1.5, &gt;2.5 …</strong> — the result must be <em>above</em> that number. The points
              you earn equal the weight of the line (for example, &gt;1.5 pays 2, &gt;4.5 pays 5).
            </li>
            <li>
              Available lines: {statThresholdOptions.join(", ")}.
            </li>
          </ul>

          <div className="rules-table-shell">
            <table className="rules-table">
              <thead>
                <tr>
                  <th>Official total</th>
                  <th>Your pick</th>
                  <th>Points</th>
                  <th>Why</th>
                </tr>
              </thead>
              <tbody>
                {thresholdExamples.map((row) => (
                  <tr key={`${row.actual}-${row.pick}`}>
                    <td>{row.actual}</td>
                    <td>{row.pick}</td>
                    <td>{row.points}</td>
                    <td>{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="rules-block card">
          <p className="card__label">Red cards</p>
          <h3>Yes or No only</h3>
          <p className="section__copy">
            Pick <strong>Yes</strong> for <strong>{RED_CARDS_POINTS} points</strong> when at least one red card is shown, or{" "}
            <strong>No</strong> for <strong>{RED_CARDS_POINTS} points</strong> when the match finishes with zero red cards.
          </p>
        </article>

        <article className="rules-block">
          <div className="rules-block__heading">
            <p className="eyebrow">Top picks</p>
            <h3>Tournament awards — {TOURNAMENT_AWARD_POINTS} points each</h3>
            <p className="section__copy">
              Submit your six tournament picks once in <strong>Top Picks</strong>. Each correct award pays{" "}
              {TOURNAMENT_AWARD_POINTS} points when official winners are announced at the end of the tournament.
            </p>
          </div>
          <RuleCards rules={tournamentPointRules} />
        </article>

        <article className="rules-block card card--feature">
          <p className="card__label">Leaderboard</p>
          <h3>How standings are calculated</h3>
          <ul className="rules-list">
            <li>
              <strong>Total Points</strong> — everything combined: match picks plus tournament awards.
            </li>
            <li>
              <strong>Exact Scores</strong> — number of matches where you nailed the optional exact scoreline.
            </li>
            <li>
              <strong>Correct Outcomes</strong> — number of matches where you picked the right winner or draw.
            </li>
            <li>
              <strong>Bonus Hits</strong> — stat-line and red-card picks that scored (goals, corners, yellow cards,
              red-card Yes).
            </li>
            <li>
              Click a player&apos;s name in the standings to see their picks and a full point breakdown.
            </li>
          </ul>
        </article>
      </div>

      <a className="section__jump" href="#top">
        Back to top
      </a>
    </section>
  );
}
