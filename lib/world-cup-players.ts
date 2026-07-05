import { getTeamShowcase } from "@/lib/team-showcase";
import { getWorldCupTeams } from "@/lib/world-cup-teams";

const ADDITIONAL_PLAYERS_BY_TEAM: Record<string, readonly string[]> = {
  Algeria: ["Youcef Atal", "Saïd Benrahma", "Rais M'Bolhi"],
  Argentina: ["Lautaro Martínez", "Julián Álvarez", "Emiliano Martínez", "Enzo Fernández", "Alexis Mac Allister"],
  Australia: ["Mathew Ryan", "Mitchell Duke", "Martin Boyle"],
  Austria: ["David Alaba", "Marko Arnautović", "Christoph Baumgartner"],
  Belgium: ["Romelu Lukaku", "Thibaut Courtois", "Jeremy Doku", "Amadou Onana"],
  "Bosnia and Herzegovina": ["Miralem Pjanić", "Sead Kolašinac"],
  Brazil: ["Rodrygo", "Neymar", "Alisson", "Raphinha", "Endrick", "Bruno Guimarães"],
  Canada: ["Jonathan David", "Tajon Buchanan", "Milan Borjan"],
  "Cape Verde": ["Jovane Cabral", "Vozinha"],
  Colombia: ["Luis Díaz", "Radamel Falcao", "David Ospina"],
  Croatia: ["Josko Gvardiol", "Dominik Livakovic", "Bruno Petković"],
  Curacao: ["Jurich Carolina", "Eloy Room"],
  "Czech Republic": ["Tomáš Souček", "Vladimír Coufal"],
  "DR Congo": ["Cédric Bakambu", "Chancel Mbemba"],
  Ecuador: ["Enner Valencia", "Piero Hincapié", "Hernán Galíndez"],
  Egypt: ["Omar Marmoush", "Mohamed El Shenawy"],
  England: ["Jude Bellingham", "Bukayo Saka", "Phil Foden", "Jordan Pickford", "Cole Palmer"],
  France: ["Antoine Griezmann", "Ousmane Dembélé", "Mike Maignan", "Aurélien Tchouaméni", "William Saliba"],
  Germany: ["Florian Wirtz", "Manuel Neuer", "Joshua Kimmich", "Kai Havertz", "İlkay Gündoğan"],
  Ghana: ["Thomas Partey", "Lawrence Ati-Zigi"],
  Haiti: ["Frantzdy Pierrot", "Johny Placide"],
  Iran: ["Sardar Azmoun", "Alireza Beiranvand"],
  Iraq: ["Aymen Hussein", "Jalal Hassan"],
  "Ivory Coast": ["Sébastien Haller", "Franck Kessié", "Yahia Fofana"],
  Japan: ["Takefusa Kubo", "Wataru Endo", "Shūbei Hayashi"],
  Jordan: ["Yazan Al-Naimat", "Yazeed Abulaila"],
  Mexico: ["Hirving Lozano", "Raúl Jiménez", "Santiago Giménez"],
  Morocco: ["Youssef En-Nesyri", "Bono", "Sofyan Amrabat", "Brahim Díaz"],
  Netherlands: ["Cody Gakpo", "Memphis Depay", "Matthijs de Ligt", "Bart Verbruggen"],
  "New Zealand": ["Winston Reid", "Michael Boxall"],
  Norway: ["Martin Ødegaard", "Ørjan Nyland", "Alexander Sørloth"],
  Panama: ["José Fajardo", "Luis Mejía"],
  Paraguay: ["Julio Enciso", "Anthony Silva"],
  Portugal: ["Bernardo Silva", "Bruno Fernandes", "Diogo Costa", "Rafael Leão", "João Félix"],
  Qatar: ["Akram Afif", "Saad Al-Sheeb"],
  "Saudi Arabia": ["Sergej Milinković-Savić", "Mohammed Al-Owais"],
  Scotland: ["Scott McTominay", "Angus Gunn", "Che Adams"],
  Senegal: ["Nicolas Jackson", "Édouard Mendy", "Idrissa Gueye"],
  "South Africa": ["Ronwen Williams", "Themba Zwane"],
  "South Korea": ["Hwang Hee-chan", "Kim Min-jae", "Cho Gue-sung"],
  Spain: ["Rodri", "Pedri", "Álvaro Morata", "Unai Simón", "Nico Williams"],
  Sweden: ["Viktor Gyökeres", "Robin Olsen", "Emil Forsberg"],
  Switzerland: ["Breel Embolo", "Yann Sommer", "Manuel Akanji"],
  Tunisia: ["Wahbi Khazri", "Aymen Dahmen"],
  Turkey: ["Arda Güler", "Uğurcan Çakır", "Kenan Yıldız"],
  USA: ["Weston McKennie", "Matt Turner", "Folarin Balogun"],
  Uruguay: ["Darwin Núñez", "Ronald Araújo", "Sergio Rochet"],
  Uzbekistan: ["Odil Khamdamov", "Ignatiy Nesterov"]
};

const PLAYER_ALIASES: Record<string, string> = {
  mbappe: "Kylian Mbappé",
  "kylian mbappe": "Kylian Mbappé",
  messi: "Lionel Messi",
  "lionel messi": "Lionel Messi",
  ronaldo: "Cristiano Ronaldo",
  "cristiano ronaldo": "Cristiano Ronaldo",
  haaland: "Erling Haaland",
  "erling haaland": "Erling Haaland",
  kane: "Harry Kane",
  "harry kane": "Harry Kane",
  salah: "Mohamed Salah",
  "mohamed salah": "Mohamed Salah",
  yamal: "Lamine Yamal",
  "lamine yamal": "Lamine Yamal",
  musiala: "Jamal Musiala",
  "jamal musiala": "Jamal Musiala",
  vinicius: "Vinícius Júnior",
  "vinicius junior": "Vinícius Júnior",
  "vinícius júnior": "Vinícius Júnior"
};

let cachedPlayersByTeam: Record<string, string[]> | null = null;
let cachedPlayers: string[] | null = null;
let cachedPlayerLookup: Map<string, string> | null = null;

function stripDiacritics(value: string) {
  return value.normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

function buildPlayerLookup(players: string[]) {
  const lookup = new Map<string, string>();

  for (const player of players) {
    lookup.set(player.toLowerCase(), player);
    lookup.set(stripDiacritics(player).toLowerCase(), player);
  }

  for (const [alias, canonical] of Object.entries(PLAYER_ALIASES)) {
    lookup.set(alias.toLowerCase(), canonical);
    lookup.set(stripDiacritics(alias).toLowerCase(), canonical);
  }

  return lookup;
}

function buildPlayersByTeam() {
  const playersByTeam: Record<string, string[]> = {};

  for (const team of getWorldCupTeams()) {
    const names = new Set<string>();
    const showcasePlayer = getTeamShowcase(team)?.player;

    if (showcasePlayer && showcasePlayer !== "Star player") {
      names.add(showcasePlayer);
    }

    for (const player of ADDITIONAL_PLAYERS_BY_TEAM[team] ?? []) {
      names.add(player);
    }

    if (names.size > 0) {
      playersByTeam[team] = [...names].sort((left, right) => left.localeCompare(right));
    }
  }

  return playersByTeam;
}

export function getWorldCupPlayersByTeam() {
  if (!cachedPlayersByTeam) {
    cachedPlayersByTeam = buildPlayersByTeam();
  }

  return cachedPlayersByTeam;
}

export function getWorldCupPlayers() {
  if (!cachedPlayers) {
    const players = new Set<string>();

    for (const teamPlayers of Object.values(getWorldCupPlayersByTeam())) {
      for (const player of teamPlayers) {
        players.add(player);
      }
    }

    cachedPlayers = [...players].sort((left, right) => left.localeCompare(right));
  }

  return cachedPlayers;
}

function getPlayerLookup() {
  if (!cachedPlayerLookup) {
    cachedPlayerLookup = buildPlayerLookup(getWorldCupPlayers());
  }

  return cachedPlayerLookup;
}

export function isValidWorldCupPlayer(value: string | null | undefined) {
  const trimmed = value?.trim() ?? "";
  return trimmed.length === 0 || resolveCanonicalPlayerName(trimmed) !== null;
}

export function resolveCanonicalPlayerName(value: string | null | undefined) {
  const trimmed = value?.trim() ?? "";

  if (!trimmed) {
    return null;
  }

  const lookup = getPlayerLookup();

  return (
    lookup.get(trimmed.toLowerCase()) ??
    lookup.get(stripDiacritics(trimmed).toLowerCase()) ??
    null
  );
}
