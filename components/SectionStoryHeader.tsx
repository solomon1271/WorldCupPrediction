type SectionStoryTone = "fixtures" | "groups" | "tournament" | "leaderboard";

type SectionStoryHeaderProps = {
  tone: SectionStoryTone;
  eyebrow: string;
  title: string;
  copy?: string;
  children?: React.ReactNode;
};

function SectionStoryIcon({ tone }: { tone: SectionStoryTone }) {
  const props = {
    className: "section-story__icon",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true
  };

  switch (tone) {
    case "fixtures":
      return (
        <svg {...props}>
          <rect x="3.5" y="5.5" width="17" height="15" rx="2.5" />
          <path d="M8 3.5v4M16 3.5v4M3.5 10.5h17" />
        </svg>
      );
    case "groups":
      return (
        <svg {...props}>
          <path d="M4.5 6.5h6.5v6.5H4.5zM13 6.5h6.5v6.5H13zM4.5 15h6.5v3.5H4.5zM13 15h6.5v3.5H13z" />
        </svg>
      );
    case "tournament":
      return (
        <svg {...props}>
          <path d="M7 4h10v3a5 5 0 0 1-10 0V4Z" />
          <path d="M9 17h6M12 12v5" />
          <path d="M8 21h8" />
        </svg>
      );
    case "leaderboard":
      return (
        <svg {...props}>
          <path d="M4 19V11M10 19V5M16 19v-8M22 19V9" />
        </svg>
      );
  }
}

export function SectionStoryHeader({ tone, eyebrow, title, copy, children }: SectionStoryHeaderProps) {
  return (
    <div className={`section-story section-story--${tone}`}>
      <div className="section-story__mark" aria-hidden="true">
        <span className="section-story__orb" />
        <SectionStoryIcon tone={tone} />
      </div>
      <div className="section-story__content">
        <p className="section-story__eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        {copy ? <p className="section-story__copy">{copy}</p> : null}
        {children}
      </div>
    </div>
  );
}
