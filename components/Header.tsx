import { LeagueBranding } from "@/lib/league-types";

type HeaderProps = {
  currentUserName: string;
  isAdmin?: boolean;
  league?: LeagueBranding;
  variant?: "home" | "help" | "admin";
};

type NavTone = "fixtures" | "groups" | "tournament" | "leaderboard" | "help" | "admin" | "home" | "scoring" | "leagues" | "dashboard" | "users";

type NavItem = {
  label: string;
  href: string;
  tone: NavTone;
};

const adminNavItem: NavItem = { label: "Admin", href: "/admin", tone: "admin" };

function NavIcon({ tone }: { tone: NavTone }) {
  const props = {
    className: "nav-link__icon",
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
    case "help":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M9.5 9.2a2.7 2.7 0 1 1 4.3 2.1c-.9.7-1.3 1.2-1.3 2.2" />
          <path d="M12 16.8h.01" strokeWidth="2.4" />
        </svg>
      );
    case "admin":
      return (
        <svg {...props}>
          <path d="M12 3.5 14.8 9l6.2.9-4.5 4.4 1.1 6.2L12 17.8 6.4 20.5l1.1-6.2L3 9.9 9.2 9 12 3.5Z" />
        </svg>
      );
    case "home":
      return (
        <svg {...props}>
          <path d="M4.5 10.5 12 4.5l7.5 6v8.5a1 1 0 0 1-1 1h-5v-5.5H10.5V20h-5a1 1 0 0 1-1-1v-8.5Z" />
        </svg>
      );
    case "scoring":
      return (
        <svg {...props}>
          <path d="M7 4.5h10a1.5 1.5 0 0 1 1.5 1.5v12a1.5 1.5 0 0 1-1.5 1.5H7a1.5 1.5 0 0 1-1.5-1.5V6A1.5 1.5 0 0 1 7 4.5Z" />
          <path d="M9 9h6M9 12.5h6M9 16h4" />
        </svg>
      );
    case "leagues":
      return (
        <svg {...props}>
          <circle cx="9" cy="8.5" r="2.8" />
          <circle cx="16.5" cy="9.5" r="2.3" />
          <path d="M4.5 18.5c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5M13.5 18.5c0-1.8 1.4-3.3 3.2-3.3" />
        </svg>
      );
    case "dashboard":
      return (
        <svg {...props}>
          <rect x="4.5" y="4.5" width="6.5" height="6.5" rx="1.5" />
          <rect x="13" y="4.5" width="6.5" height="6.5" rx="1.5" />
          <rect x="4.5" y="13" width="6.5" height="6.5" rx="1.5" />
          <rect x="13" y="13" width="6.5" height="6.5" rx="1.5" />
        </svg>
      );
    case "users":
      return (
        <svg {...props}>
          <circle cx="10" cy="9" r="3" />
          <path d="M4.5 18.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
          <path d="M16.5 8.5v3M18 10h-3" />
        </svg>
      );
  }
}

export function Header({ currentUserName, isAdmin = false, league, variant = "home" }: HeaderProps) {
  const firstName = currentUserName.trim().split(/\s+/)[0] || "Player";
  const leagueHome = league ? `/l/${league.slug}` : "/leagues";
  const leagueHelp = league ? `/l/${league.slug}/help` : "/help";
  const navItems: NavItem[] =
    variant === "help"
      ? [
          { label: "Home", href: leagueHome, tone: "home" },
          { label: "Scoring", href: "#rules", tone: "scoring" },
          ...(isAdmin ? [adminNavItem] : [])
        ]
      : variant === "admin"
        ? [
            { label: "Leagues", href: "#admin-leagues", tone: "leagues" },
            { label: "Dashboard", href: "/", tone: "dashboard" },
            { label: "User Control", href: "#admin-users", tone: "users" },
            { label: "Help", href: leagueHelp, tone: "help" }
          ]
        : [
            { label: "Fixtures", href: "#matches", tone: "fixtures" },
            { label: "Groups", href: "#group-standings", tone: "groups" },
            { label: "Top Picks", href: "#tournament-picks", tone: "tournament" },
            { label: "Leaderboard", href: "#leaderboard", tone: "leaderboard" },
            ...(isAdmin ? [adminNavItem] : []),
            { label: "Help", href: leagueHelp, tone: "help" }
          ];

  return (
    <header className="hero" id="top">
      <div className="hero__topbar">
        <div className="hero__badge">{league?.name || "World Cup Prediction"}</div>
        <div className="hero__account">
          <span className="hero__account-name">{firstName}</span>
          <a className="ghost-button ghost-button--link" href="/logout">
            Sign out
          </a>
        </div>
      </div>
      <div className="hero__content">
        <div>
          <p className="eyebrow">{league?.subtitle || "2026 World Cup Challenge"}</p>
        </div>
      </div>
      <nav className="nav" aria-label="Main">
        {navItems.map((item) => (
          <a className={`nav-link nav-link--${item.tone}`} href={item.href} key={item.label}>
            <NavIcon tone={item.tone} />
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
    </header>
  );
}
