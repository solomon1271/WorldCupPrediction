"use client";

import { useMemo, useState } from "react";

import { GroupStandingTable } from "@/lib/group-standings";

type GroupStandingsProps = {
  tables: GroupStandingTable[];
};

function formatGoalDifference(value: number) {
  if (value > 0) {
    return `+${value}`;
  }

  return String(value);
}

function getDefaultGroup(tables: GroupStandingTable[]) {
  if (tables.length === 0) {
    return "A";
  }

  const mostActive = [...tables].sort((left, right) => {
    const leftPlayed = left.rows.reduce((total, row) => total + row.played, 0);
    const rightPlayed = right.rows.reduce((total, row) => total + row.played, 0);
    return rightPlayed - leftPlayed;
  })[0];

  return mostActive.group;
}

export function GroupStandings({ tables }: GroupStandingsProps) {
  const [activeGroup, setActiveGroup] = useState(() => getDefaultGroup(tables));

  const activeTable = useMemo(
    () => tables.find((table) => table.group === activeGroup) ?? tables[0],
    [activeGroup, tables]
  );

  if (tables.length === 0 || !activeTable) {
    return null;
  }

  return (
    <section id="group-standings" className="section">
      <div className="section__heading">
        <p className="eyebrow">Tournament tables</p>
        <h2>Group standings</h2>
        <p className="section__copy">
          Live tables built from official results in this app. Top two advance; third place may qualify as a best
          third-place team.
        </p>
      </div>

      <div className="group-tabs" role="tablist" aria-label="World Cup groups">
        {tables.map((table) => (
          <button
            key={table.group}
            className={`group-tabs__button${activeGroup === table.group ? " group-tabs__button--active" : ""}`}
            type="button"
            role="tab"
            aria-selected={activeGroup === table.group}
            onClick={() => setActiveGroup(table.group)}
          >
            {table.group}
          </button>
        ))}
      </div>

      <div className="group-standings-panel" role="tabpanel" aria-label={activeTable.label}>
        <div className="group-standings-panel__header">
          <h3>{activeTable.label}</h3>
          <span>
            {activeTable.rows.reduce((total, row) => total + row.played, 0) / 2} of 6 matches played
          </span>
        </div>

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
              {activeTable.rows.map((row) => (
                <tr
                  key={row.team}
                  className={
                    row.rank <= 2
                      ? "group-standings-table__row--qualified"
                      : row.rank === 3
                        ? "group-standings-table__row--third"
                        : undefined
                  }
                >
                  <td>{row.rank}</td>
                  <th scope="row">{row.team}</th>
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

        <div className="group-standings-legend" aria-hidden="true">
          <span className="group-standings-legend__item group-standings-legend__item--qualified">Top 2 advance</span>
          <span className="group-standings-legend__item group-standings-legend__item--third">3rd — best third-place race</span>
        </div>
      </div>

      <a className="section__jump" href="#top">
        Back to top
      </a>
    </section>
  );
}
