"use client";

import { SectionStoryHeader } from "@/components/SectionStoryHeader";
import { getGroupQualificationLabel, getGroupStandingsRowClassName } from "@/lib/group-standings-presentation";
import type { GroupStandingTable } from "@/lib/group-standings-types";

type GroupStandingsProps = {
  tables: GroupStandingTable[];
};

function formatGoalDifference(value: number) {
  if (value > 0) {
    return `+${value}`;
  }

  return String(value);
}

function getMatchesPlayed(table: GroupStandingTable) {
  return table.rows.reduce((total, row) => total + row.played, 0) / 2;
}

function GroupStandingCard({ table }: { table: GroupStandingTable }) {
  const matchesPlayed = getMatchesPlayed(table);
  const leaderPreview = table.rows
    .slice(0, 2)
    .map((row) => row.team)
    .join(" · ");

  return (
    <details className="group-standings-card">
      <summary className="group-standings-card__summary">
        <div className="group-standings-card__summary-main">
          <strong>{table.label}</strong>
          <span>{matchesPlayed} of 6 matches played</span>
          {leaderPreview ? <span className="group-standings-card__preview">{leaderPreview}</span> : null}
        </div>
        <span className="group-standings-card__chevron" aria-hidden="true" />
      </summary>

      <div className="group-standings-card__body">
        <div className="table-shell group-standings-table-shell">
          <table className="group-standings-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Team</th>
                <th>P</th>
                <th>W</th>
                <th>D</th>
                <th>L</th>
                <th>GF</th>
                <th>GA</th>
                <th>GD</th>
                <th>Pts</th>
              </tr>
            </thead>
            <tbody>
              {table.rows.map((row) => (
                <tr key={row.team} className={getGroupStandingsRowClassName(row.qualificationStatus)}>
                  <td>{row.rank}</td>
                  <th scope="row">
                    <span className="group-standings-team">
                      <span>{row.team}</span>
                      <span
                        className={`group-standings-tag group-standings-tag--${row.qualificationStatus}`}
                      >
                        {getGroupQualificationLabel(row.qualificationStatus)}
                      </span>
                    </span>
                  </th>
                  <td>{row.played}</td>
                  <td>{row.won}</td>
                  <td>{row.drawn}</td>
                  <td>{row.lost}</td>
                  <td>{row.goalsFor}</td>
                  <td>{row.goalsAgainst}</td>
                  <td>{formatGoalDifference(row.goalDifference)}</td>
                  <td>
                    <strong>{row.points}</strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </details>
  );
}

export function GroupStandings({ tables }: GroupStandingsProps) {
  if (tables.length === 0) {
    return null;
  }

  return (
    <section id="group-standings" className="section">
      <SectionStoryHeader
        tone="groups"
        eyebrow="Road to the knockouts"
        title="Group standings"
        copy="Top two advance automatically. The best eight third-place teams join them — everyone else goes home."
      />

      <div className="group-standings-grid">
        {tables.map((table) => (
          <GroupStandingCard key={table.group} table={table} />
        ))}
      </div>

      <div className="group-standings-legend" aria-hidden="true">
        <span className="group-standings-legend__item group-standings-legend__item--through">
          1st &amp; 2nd — through automatically
        </span>
        <span className="group-standings-legend__item group-standings-legend__item--lucky-third">
          Best 3rd — lucky qualifier
        </span>
        <span className="group-standings-legend__item group-standings-legend__item--third-hope">
          3rd hunt — still chasing a best-third spot
        </span>
        <span className="group-standings-legend__item group-standings-legend__item--eliminated">
          Out — eliminated
        </span>
      </div>

      <a className="section__jump" href="#top">
        Back to top
      </a>
    </section>
  );
}
