type HeaderProps = {
  currentUserName: string;
  isAdmin?: boolean;
  variant?: "home" | "help" | "admin";
};

export function Header({ currentUserName, isAdmin = false, variant = "home" }: HeaderProps) {
  const firstName = currentUserName.trim().split(/\s+/)[0] || "Player";
  const navItems =
    variant === "help"
      ? [
          { label: "Home", href: "/" },
          { label: "Scoring", href: "#rules" }
        ]
      : variant === "admin"
        ? [
            { label: "Dashboard", href: "/" },
            { label: "User Control", href: "#admin-users" },
            { label: "Help", href: "/help" }
          ]
      : [
          { label: "Fixtures", href: "#matches" },
          { label: "Top Picks", href: "#tournament-picks" },
          { label: "Leaderboard", href: "#leaderboard" },
          ...(isAdmin ? [{ label: "Admin", href: "/admin" }] : []),
          { label: "Help", href: "/help" }
        ];

  return (
    <header className="hero" id="top">
      <div className="hero__topbar">
        <div className="hero__badge">Miles Apart Prediction League</div>
        <div className="hero__account">
          <span className="hero__account-name">{firstName}</span>
          <a className="ghost-button ghost-button--link" href="/logout">
            Sign out
          </a>
        </div>
      </div>
      <div className="hero__content">
        <div>
          <p className="eyebrow">2026 World Cup Challenge</p>
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
