const overviewItems = [
  {
    title: "Private access",
    description: "Only invited friends can join your single league and submit picks."
  },
  {
    title: "Match-by-match predictions",
    description: "Every fixture captures winner, scoreline, and key stat predictions before kickoff."
  },
  {
    title: "Full tournament picks",
    description: "Champion, Golden Boot, Best Young Player, and group winners all count toward the crown."
  },
  {
    title: "Live leaderboard",
    description: "Points update after each result entry so everyone sees who is pulling ahead."
  }
];

export function OverviewCards() {
  return (
    <section id="overview" className="section">
      <div className="section__heading">
        <p className="eyebrow">Product Vision</p>
        <h2>The MVP you can launch for your group first</h2>
      </div>
      <div className="card-grid">
        {overviewItems.map((item) => (
          <article className="card" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
