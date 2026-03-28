const nextItems = [
  "Replace SQLite with PostgreSQL when you are ready to host the app online.",
  "Create an admin result-entry screen for manual scoring updates.",
  "Add edit/save forms for match predictions and tournament futures.",
  "Lock predictions automatically at match kickoff.",
  "Send reminder notifications before matches start."
];

export function BuildNext() {
  return (
    <section className="section section--compact">
      <div className="section__heading">
        <p className="eyebrow">Next Build Steps</p>
        <h2>What we should wire up after this prototype</h2>
      </div>
      <ul className="next-list">
        {nextItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
