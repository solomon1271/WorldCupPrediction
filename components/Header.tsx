import { LeagueBranding } from "@/lib/league-types";

type HeaderProps = {
  currentUserName: string;
  isAdmin?: boolean;
  league?: LeagueBranding;
  variant?: "home" | "help" | "admin";
};

const adminNavItem = { label: "Admin", href: "/admin" as const };

export function Header({ currentUserName, isAdmin = false, league, variant = "home" }: HeaderProps) {
  const firstName = currentUserName.trim().split(/\s+/)[0] || "Player";
  const leagueHome = league ? `/l/${league.slug}` : "/leagues";
  const leagueHelp = league ? `/l/${league.slug}/help` : "/help";
  const navItems =
    variant === "help"
      ? [
          { label: "Home", href: leagueHome },
          { label: "Scoring", href: "#rules" },
          ...(isAdmin ? [adminNavItem] : [])
        ]
      : variant === "admin"
        ? [
            { label: "Leagues", href: "#admin-leagues" },
            { label: "Dashboard", href: "/" },
            { label: "User Control", href: "#admin-users" },
            { label: "Help", href: leagueHelp }
          ]
        : [
            { label: "Fixtures", href: "#matches" },
            { label: "Top Picks", href: "#tournament-picks" },
            { label: "Leaderboard", href: "#leaderboard" },
            ...(isAdmin ? [adminNavItem] : []),
            { label: "Help", href: leagueHelp }
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
      <nav className="nav">
        {navItems.map((item) => (
          <a href={item.href} key={item.label}>
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
