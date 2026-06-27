import { isKnockoutStage } from "@/lib/match-presentation";
import { isPlaceholderTeam } from "@/lib/placeholder-team";

export type TeamShowcase = {
  team: string;
  player: string;
  countryCode: string;
  accent: string;
};

const TEAM_SHOWCASE: Record<string, TeamShowcase> = {
  Algeria: { team: "Algeria", player: "Riyad Mahrez", countryCode: "dz", accent: "#006233" },
  Argentina: { team: "Argentina", player: "Lionel Messi", countryCode: "ar", accent: "#74acdf" },
  Australia: { team: "Australia", player: "Harry Souttar", countryCode: "au", accent: "#ffcd00" },
  Austria: { team: "Austria", player: "Marcel Sabitzer", countryCode: "at", accent: "#ed2939" },
  Belgium: { team: "Belgium", player: "Kevin De Bruyne", countryCode: "be", accent: "#fdda25" },
  "Bosnia and Herzegovina": { team: "Bosnia and Herzegovina", player: "Edin Džeko", countryCode: "ba", accent: "#002395" },
  Brazil: { team: "Brazil", player: "Vinícius Júnior", countryCode: "br", accent: "#ffdf00" },
  Canada: { team: "Canada", player: "Alphonso Davies", countryCode: "ca", accent: "#ff0000" },
  "Cape Verde": { team: "Cape Verde", player: "Ryan Mendes", countryCode: "cv", accent: "#003893" },
  Colombia: { team: "Colombia", player: "James Rodríguez", countryCode: "co", accent: "#fcd116" },
  Croatia: { team: "Croatia", player: "Luka Modrić", countryCode: "hr", accent: "#ff0000" },
  Curacao: { team: "Curacao", player: "Leandro Bacuna", countryCode: "cw", accent: "#002b7f" },
  "Czech Republic": { team: "Czech Republic", player: "Patrik Schick", countryCode: "cz", accent: "#11457e" },
  "DR Congo": { team: "DR Congo", player: "Yoane Wissa", countryCode: "cd", accent: "#007fff" },
  Ecuador: { team: "Ecuador", player: "Moisés Caicedo", countryCode: "ec", accent: "#ffdd00" },
  Egypt: { team: "Egypt", player: "Mohamed Salah", countryCode: "eg", accent: "#ce1126" },
  England: { team: "England", player: "Harry Kane", countryCode: "gb-eng", accent: "#cf081f" },
  France: { team: "France", player: "Kylian Mbappé", countryCode: "fr", accent: "#0055a4" },
  Germany: { team: "Germany", player: "Jamal Musiala", countryCode: "de", accent: "#ffcc00" },
  Ghana: { team: "Ghana", player: "Mohammed Kudus", countryCode: "gh", accent: "#fcd116" },
  Haiti: { team: "Haiti", player: "Duckens Nazon", countryCode: "ht", accent: "#00209f" },
  Iran: { team: "Iran", player: "Mehdi Taremi", countryCode: "ir", accent: "#239f40" },
  Iraq: { team: "Iraq", player: "Mohanad Ali", countryCode: "iq", accent: "#ce1126" },
  "Ivory Coast": { team: "Ivory Coast", player: "Nicolas Pépé", countryCode: "ci", accent: "#f77f00" },
  Japan: { team: "Japan", player: "Kaoru Mitoma", countryCode: "jp", accent: "#bc002d" },
  Jordan: { team: "Jordan", player: "Musa Al-Taamari", countryCode: "jo", accent: "#007a3d" },
  Mexico: { team: "Mexico", player: "Guillermo Ochoa", countryCode: "mx", accent: "#006847" },
  Morocco: { team: "Morocco", player: "Achraf Hakimi", countryCode: "ma", accent: "#c1272d" },
  Netherlands: { team: "Netherlands", player: "Virgil van Dijk", countryCode: "nl", accent: "#ff6600" },
  "New Zealand": { team: "New Zealand", player: "Chris Wood", countryCode: "nz", accent: "#00247d" },
  Norway: { team: "Norway", player: "Erling Haaland", countryCode: "no", accent: "#ba0c2f" },
  Panama: { team: "Panama", player: "Roman Torres", countryCode: "pa", accent: "#005293" },
  Paraguay: { team: "Paraguay", player: "Miguel Almiron", countryCode: "py", accent: "#d52b1e" },
  Portugal: { team: "Portugal", player: "Cristiano Ronaldo", countryCode: "pt", accent: "#006600" },
  Qatar: { team: "Qatar", player: "Almoez Ali", countryCode: "qa", accent: "#8a1538" },
  "Saudi Arabia": { team: "Saudi Arabia", player: "Salem Al-Dawsari", countryCode: "sa", accent: "#006c35" },
  Scotland: { team: "Scotland", player: "Andy Robertson", countryCode: "gb-sct", accent: "#005eb8" },
  Senegal: { team: "Senegal", player: "Sadio Mané", countryCode: "sn", accent: "#00853f" },
  "South Africa": { team: "South Africa", player: "Percy Tau", countryCode: "za", accent: "#007a4d" },
  "South Korea": { team: "South Korea", player: "Son Heung-min", countryCode: "kr", accent: "#cd2e3a" },
  Spain: { team: "Spain", player: "Lamine Yamal", countryCode: "es", accent: "#aa151b" },
  Sweden: { team: "Sweden", player: "Alexander Isak", countryCode: "se", accent: "#006aa7" },
  Switzerland: { team: "Switzerland", player: "Granit Xhaka", countryCode: "ch", accent: "#ff0000" },
  Tunisia: { team: "Tunisia", player: "Youssef Msakni", countryCode: "tn", accent: "#e70013" },
  Turkey: { team: "Turkey", player: "Hakan Çalhanoğlu", countryCode: "tr", accent: "#e30a17" },
  USA: { team: "USA", player: "Christian Pulisic", countryCode: "us", accent: "#3c3b6e" },
  Uruguay: { team: "Uruguay", player: "Federico Valverde", countryCode: "uy", accent: "#0038a8" },
  Uzbekistan: { team: "Uzbekistan", player: "Eldor Shomurodov", countryCode: "uz", accent: "#1eb53a" }
};

export function isShowcaseTeam(team: string) {
  return team.trim().length > 0 && !isPlaceholderTeam(team);
}

export function getTeamShowcase(team: string): TeamShowcase | null {
  if (!isShowcaseTeam(team)) {
    return null;
  }

  return TEAM_SHOWCASE[team] ?? {
    team,
    player: "Star player",
    countryCode: "un",
    accent: "#00f5d4"
  };
}

export function getFlagImageUrl(countryCode: string) {
  return `/flags/${countryCode}.png`;
}

export function getPlayerImageUrl(countryCode: string) {
  return `/players/${countryCode}.png`;
}

export function canShowMatchShowcase(homeTeam: string, awayTeam: string) {
  return Boolean(getTeamShowcase(homeTeam) && getTeamShowcase(awayTeam));
}

export type MatchShowcaseMode = "full" | "tbd" | false;

export function getMatchShowcaseMode(stage: string, homeTeam: string, awayTeam: string): MatchShowcaseMode {
  if (canShowMatchShowcase(homeTeam, awayTeam)) {
    return "full";
  }

  if (!isKnockoutStage(stage)) {
    return false;
  }

  if (isPlaceholderTeam(homeTeam) || isPlaceholderTeam(awayTeam) || isShowcaseTeam(homeTeam) || isShowcaseTeam(awayTeam)) {
    return "tbd";
  }

  return false;
}
