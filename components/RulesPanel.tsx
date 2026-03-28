import { pointRules } from "@/lib/constants";

export function RulesPanel() {
  return (
    <section id="rules" className="section">
      <div className="section__heading">
        <p className="eyebrow">Scoring System</p>
        <h2>Simple rules everyone can understand before the first kickoff</h2>
      </div>
      <div className="rules-grid">
        {pointRules.map((rule) => (
          <article className="rule-card" key={rule.label}>
            <span className="rule-card__points">{rule.points} pts</span>
            <h3>{rule.label}</h3>
            <p>{rule.detail}</p>
          </article>
        ))}
      </div>
      <a className="section__jump" href="#top">
        Back to top
      </a>
    </section>
  );
}
